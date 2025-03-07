import {produce} from 'immer';
import {Alert} from 'react-native';
import {useChunkStore} from '../store/chunkStore';
import {Buffer} from 'buffer';

export const receiveFileAck = async (
  data: any,
  socket: any,
  setReceivedFiles: any,
) => {
  const {setChunkStore, chunkStore} = useChunkStore.getState();

  if (chunkStore) {
    Alert.alert('please wait, some file are yet to be received!');
    return;
  }

  setReceivedFiles((prevData: any) =>
    produce(prevData, (draft: any) => {
      draft.push(data);
    }),
  );

  setChunkStore({
    id: data.id,
    totalChunks: data.totalChunks,
    name: data.name,
    size: data.size,
    miniType: data.mimeType,
    chunkArray: [],
  });

  if (!socket) {
    console.log('socket not available');
    return;
  }

  try {
    await new Promise(resolve => setTimeout(resolve, 10));
    console.log('File received');
    socket.write(
      JSON.stringify({
        event: 'send-chunk-ack',
        chunkNo: 0,
      }),
    );
    console.log('requested for first chunk');
  } catch (error) {
    console.error('error while sending file: ', error);
  }
};

export const sendChunkAck = async (
  chunkIndex: any,
  socket: any,
  setTotalSentBytes: any,
  setSentFiles: any,
) => {
  const {currentChunkSet, resetCurrentChunkSet} = useChunkStore.getState();

  if (!currentChunkSet) {
    Alert.alert('there are no chunks to send!');
    return;
  }

  if (!socket) {
    console.log('socket not available');
    return;
  }

  const totalChunks = currentChunkSet?.totalChunks;

  try {
    await new Promise(resolve => setTimeout(resolve, 10));
    socket.write(
      JSON.stringify({
        event: 'receive-chunk-ack',
        chunk: currentChunkSet?.chunkArray[chunkIndex].toString('base64'),
        chunkNo: chunkIndex,
      }),
    );

    setTotalSentBytes(
      (prev: number) => prev + currentChunkSet.chunkArray[chunkIndex].length,
    );

    if (chunkIndex + 2 > totalChunks) {
      console.log('All chunks sent');
      setSentFiles((prev: any) =>
        produce(prev, (draft: any) => {
          const fileIndex = draft.findIndex(
            (f: any) => f.id === currentChunkSet.id,
          );

          if (fileIndex !== -1) {
            draft[fileIndex].available = true;
          }
        }),
      );

      resetCurrentChunkSet();
    }
  } catch (error) {
    console.error('error while sending chunk ack', error);
  }
};

export const receiveChunkAck = async (
  chunk: any,
  chunkNo: any,
  socket: any,
  setTotalReceivedBytes: any,
  generateFile: any,
) => {
  const {chunkStore, resetChunkStore, setChunkStore} = useChunkStore.getState();

  if (!socket) {
    console.log('socket not available');
    return;
  }

  if (!chunkStore) {
    console.log('chunk store is null');
    return;
  }

  try {
    const buffer = Buffer.from(chunk, 'base64');
    const updatedChunkArray = [...(chunkStore.chunkArray || [])];
    updatedChunkArray[chunkNo] = buffer;

    console.log({chunkStore});

    setChunkStore({
      ...chunkStore,
      chunkArray: updatedChunkArray,
    });

    setTotalReceivedBytes((prev: number) => prev + buffer.length);
  } catch (error) {
    console.error('error while updating chunk', error);
  }

  console.log({chunkNo, totalChunks: chunkStore.totalChunks});

  if (chunkNo + 1 === chunkStore.totalChunks) {
    console.log('all chunks received');
    generateFile();
    resetChunkStore();
    return;
  }

  try {
    await new Promise(resolve => setTimeout(resolve, 10));
    console.log('req next chunk!');
    socket.write(
      JSON.stringify({
        event: 'send-chunk-ack',
        chunkNo: chunkNo + 1,
      }),
    );
  } catch (error) {
    console.error('error sending file', error);
  }
};
