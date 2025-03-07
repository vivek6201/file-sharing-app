import {createContext, useCallback, useState} from 'react';
import {ISocketType} from '../types/socket.types';
import TCPSocket from 'react-native-tcp-socket';
import DeviceInfo from 'react-native-device-info';
import {useChunkStore} from '../store/chunkStore';
import {isIos} from '../utils/constants';
import RNFS from 'react-native-fs';
import {produce} from 'immer';
import {Buffer} from 'buffer';
import {receiveChunkAck, receiveFileAck, sendChunkAck} from '../utils/tcpUtils';
import {Alert} from 'react-native';
import {randomUUID} from 'crypto';

export const SocketContext = createContext<ISocketType | null>(null);

const options = {
  keystore: require('../../certs/server-keystore.p12'),
};

const TcpContextProvider = ({children}: {children: React.ReactNode}) => {
  const [server, setServer] = useState<TCPSocket.TLSServer | null>(null);
  const [client, setClient] = useState<TCPSocket.TLSSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState<any>(null);
  const [serverSocket, setServerSocket] = useState<TCPSocket.TLSSocket | null>(
    null,
  );
  const [sentFiles, setSentFiles] = useState<any>([]);
  const [receivedFiles, setReceivedFiles] = useState<any>([]);
  const [totalSentBytes, setTotalSentBytes] = useState(0);
  const [totalReceivedBytes, setTotalReceivedBytes] = useState(0);

  const {currentChunkSet, setCurrentChunkSet, setChunkStore} = useChunkStore();

  const disconnect = useCallback(() => {
    if (client) client.destroy();

    if (server) server.close();

    setReceivedFiles([]);
    setSentFiles([]);
    setCurrentChunkSet(null);
    setChunkStore(null);
    setTotalReceivedBytes(0);
    setIsConnected(false);
  }, [client, server]);

  //Start server
  const startServer = useCallback(() => {
    const port = 8080; // or any port number you prefer
    if (server) {
      console.log('Server already running');
      return;
    }

    const newServer = TCPSocket.createTLSServer(options, socket => {
      console.log('client connected', socket.address);

      setServerSocket(socket);
      socket.setNoDelay(true);
      socket.readableHighWaterMark = 1024 * 1024 * 1;
      socket.writableHighWaterMark = 1024 * 1024 * 1;

      socket.on('data', async data => {
        const parsedData = JSON.parse(data.toString());

        switch (parsedData.event) {
          case 'connect':
            setIsConnected(true);
            setConnectedDevice(parsedData?.deviceName);
            break;
          case 'file-ack':
            receiveFileAck(parsedData?.file, socket, setReceivedFiles);
            break;
          case 'send-chunk-ack':
            sendChunkAck(
              parsedData?.chunkNo,
              socket,
              setTotalSentBytes,
              setSentFiles,
            );
            break;
          case 'receive-chunk-ack':
            receiveChunkAck(
              parsedData?.chunk,
              parsedData?.chunkNo,
              socket,
              setTotalReceivedBytes,
              generateFile,
            );
            break;
        }
      });

      socket.on('close', () => {
        console.log('client disconnected');
        setReceivedFiles([]);
        setSentFiles([]);
        setCurrentChunkSet(null);
        setTotalReceivedBytes(0);
        setChunkStore(null);
        setIsConnected(false);
        disconnect();
      });
    });

    newServer.listen({port, host: '0.0.0.0'}, () => {
      const address = newServer.address();
      console.log(`server is running on ${address?.address}:${address?.port}`);
    });

    newServer.on('error', err => console.error('Server error', err));
    setServer(newServer);
  }, [server]);

  //Stack client
  const connectToServer = useCallback(
    (host: string, port: number, deviceName: string) => {
      const newClient = TCPSocket.connectTLS(
        {
          host,
          port,
          cert: true,
          ca: require('../../certs/server-cert.pem'),
        },
        () => {
          setIsConnected(true);
          setConnectedDevice(deviceName);
          const myDeviceName = DeviceInfo.getDeviceNameSync();
          newClient.write(
            JSON.stringify({event: 'connect', deviceName: myDeviceName}),
          );
        },
      );

      newClient.setNoDelay(true);
      newClient.readableHighWaterMark = 1024 * 1024 * 1;
      newClient.writableHighWaterMark = 1024 * 1024 * 1;

      newClient.on('data', async data => {
        const parsedData = JSON.parse(data.toString());
        switch (parsedData.event) {
          case 'file-ack':
            receiveFileAck(parsedData?.file, newClient, setReceivedFiles);
            break;
          case 'send-chunk-ack':
            sendChunkAck(
              parsedData?.chunkNo,
              newClient,
              setTotalSentBytes,
              setSentFiles,
            );
            break;
          case 'receive-chunk-ack':
            receiveChunkAck(
              parsedData?.chunk,
              parsedData?.chunkNo,
              newClient,
              setTotalReceivedBytes,
              generateFile,
            );
        }
      });

      newClient.on('error', err => console.error('client err', err));

      setClient(newClient);

      newClient.on('close', () => {
        setReceivedFiles([]);
        setSentFiles([]);
        setCurrentChunkSet(null);
        setTotalReceivedBytes(0);
        setChunkStore(null);
        setIsConnected(false);
        disconnect();
      });
    },
    [],
  );

  const generateFile = async () => {
    const {chunkStore, resetChunkStore} = useChunkStore.getState();

    if (!chunkStore) {
      console.log('no chunks or files to process!');
      return;
    }

    if (chunkStore.totalChunks !== chunkStore.chunkArray.length) {
      console.log('all chunks are not received!');
      return;
    }

    try {
      const combinedChunks = Buffer.concat(chunkStore.chunkArray);
      const platformPath = isIos
        ? RNFS.DocumentDirectoryPath
        : RNFS.DownloadDirectoryPath;

      const filePath = `${platformPath}/${chunkStore.name}`;

      await RNFS.writeFile(
        filePath,
        combinedChunks.toString('base64'),
        'base64',
      );

      setReceivedFiles((prevFiles: any[]) =>
        produce(prevFiles, (draftFiles: any[]) => {
          const fileIndex = draftFiles.findIndex(
            (f: any) => f.id === chunkStore.id,
          );
          if (fileIndex !== -1) {
            draftFiles[fileIndex] = {
              ...draftFiles[fileIndex],
              uri: filePath,
              available: true,
            };
          }
        }),
      );

      console.log('file received successsfully!');
      resetChunkStore();
    } catch (error) {
      console.log('error while generating file', error);
    }
  };

  const sendMessage = useCallback(
    (message: Buffer | string) => {
      if (client) {
        client.write(JSON.stringify(message));
        console.log('sent from client');
      } else if (server) {
        serverSocket?.write(JSON.stringify(message));
        console.log('sent from client');
      } else {
        console.log('no client or server socket available');
      }
    },
    [client, server],
  );

  const sendFileAck = async (file: any, type: 'image' | 'file') => {
    if (currentChunkSet !== null) {
      Alert.alert('Wait for current file sent');
      return;
    }

    const normalizedPath = isIos
      ? file?.uri?.replace('file://', '')
      : file?.uri;

    const fileData = await RNFS.readFile(normalizedPath, 'base64');
    const buffer = Buffer.from(fileData, 'base64');
    const chunkSize = 1024 * 8;

    let totalChunks = 0;
    let offset = 0;
    let chunkArray = [];

    while (offset < buffer.length) {
      const chunk = buffer.slice(offset, offset + chunkSize);
      totalChunks += 1;
      chunkArray.push(chunk);
      offset += chunk.length;
    }

    const rawData = {
      id: randomUUID(),
      name: type === 'file' ? file?.name : file?.fileName,
      size: type === 'file' ? file.size : file.fileSize,
      mimeType: type === 'file' ? 'file' : '.jpg',
      totalChunks,
    };

    setCurrentChunkSet({
      id: rawData.id,
      chunkArray,
      totalChunks,
    });

    setSentFiles((prev: any) =>
      produce(prev, (draft: any) => {
        draft.push({
          ...rawData,
          uri: file?.uri,
        });
      }),
    );

    const socket = client || serverSocket;

    if (!socket) return;

    try {
      console.log('file ack done!');
      socket.write(
        JSON.stringify({
          event: 'file-ack',
          file: rawData,
        }),
      );
    } catch (error) {
      console.error('error while sending file', error);
    }
  };

  return (
    <SocketContext.Provider
      value={{
        server,
        client,
        isConnected,
        connectedDevice,
        sentFiles,
        receivedFiles,
        startServer,
        connectToServer,
        disconnect,
        totalReceivedBytes,
        totalSentBytes,
        sendFileAck,
        sendMessage,
      }}>
      {children}
    </SocketContext.Provider>
  );
};

export default TcpContextProvider;
