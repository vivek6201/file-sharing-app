import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {act, useEffect, useState} from 'react';
import useSocket from '../../hooks/useSocket';
import {resetAndPush} from '../../helpers/NavigationManager.';
import CommonHeader from '../../components/shared/Header';
import {Alert} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {dimensions, isIos} from '../../utils/constants';
import colors from '../../styles/colors';
import LinearGradient from 'react-native-linear-gradient';
import ResponsiveText from '../../components/shared/ResponsiveText';
import {filePicker, formatFileSize} from '../../utils/utils';
import {FileImage, FileText, Folder, Music, Play} from 'lucide-react-native';
import blobUtil from 'react-native-blob-util';

const ConnectionScreen = () => {
  const {
    connectedDevice,
    disconnect,
    sendFileAck,
    sentFiles,
    receivedFiles,
    totalReceivedBytes,
    totalSentBytes,
    isConnected,
  } = useSocket();
  const [activeTab, setActiveTab] = useState('SENT');

  useEffect(() => {
    if (!isConnected) {
      resetAndPush('Home');
    }
  }, [isConnected]);
  
  const customBackAction = () => {
    Alert.alert(
      'Are you sure?',
      'Your connection will be lost',
      [
        {
          text: 'No',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            disconnect();
          },
        },
      ],
      {cancelable: false},
    );
  };

  const handlePicker = async (type: string) => {
    const result = await filePicker(type);
    sendFileAck(result);
  };

  const optionList = [
    {
      name: 'photos',
      icon: require('../../../assets/images/picture.png'),
      action: () => handlePicker('image'),
    },
    {
      name: 'videos',
      icon: require('../../../assets/images/videos.png'),
      action: () => handlePicker('video'),
    },
    {
      name: 'files',
      icon: require('../../../assets/images/folder.png'),
      action: () => handlePicker('file'),
    },
    {
      name: 'audio',
      icon: require('../../../assets/images/audio.png'),
      action: () => handlePicker('audio'),
    },
  ];

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const renderThumbnail = (type: string) => {
    switch (type) {
      case '.mp3':
        return <Music />;
      case '.pdf':
      case '.docx':
        return <FileText />;
      case '.mp4':
      case '.mov':
        return <Play />;
      case '.jpg':
      case '.png':
      case '.jpeg':
      case ".webp":
        return <FileImage />;
      default:
        return <Folder />;
    }
  };

  const openFile = async (item: any) => {
    const normalizedPath = isIos ? `file://${item?.uri}` : item?.uri;

    console.log({item});

    if (isIos) {
      try {
        await blobUtil.ios.openDocument(normalizedPath);
      } catch (error) {
        console.error('error opening file', error);
      }
    } else {
      try {
        await blobUtil.android.actionViewIntent(normalizedPath, item?.mimeType);
      } catch (error) {
        console.error('error opening file', error);
      }
    }
  };

  const renderItems = ({item}: {item: any}) => {
    console.log({item});
    return (
      <View style={styles.fileItem}>
        <View style={styles.fileInfoContainer}>
          {renderThumbnail(item?.type)}
          <View style={styles.fileDetails}>
            <ResponsiveText color="black">{item?.name}</ResponsiveText>
            <ResponsiveText>
              {item?.mimeType} . {formatFileSize(item.size)}
            </ResponsiveText>
          </View>
          {item.available ? (
            <TouchableOpacity
              onPress={() => openFile(item)}
              style={styles.openButton}>
              <ResponsiveText>Open</ResponsiveText>
            </TouchableOpacity>
          ) : (
            <ActivityIndicator color={colors.BG_PRIMARY} size={'small'} />
          )}
        </View>
      </View>
    );
  };

  return (
    <LinearGradient
      colors={[colors.BG_LIGHT, '#89CFF0', '#00308F']}
      start={{x: 0, y: 1}}
      end={{x: 0, y: 0}}
      style={styles.container}>
      <SafeAreaView style={styles.safeArea} />
      <CommonHeader
        title="Transfer Screen"
        customBackAction={customBackAction}
      />

      <View style={styles.content}>
        <View style={styles.subContainer}>
          <View>
            <ResponsiveText variant="h6" color="black">
              Connected to
            </ResponsiveText>
            <ResponsiveText
              variant="h5"
              fontWeight={'600'}
              color="black"
              textTransform={'capitalize'}>
              {connectedDevice}
            </ResponsiveText>
          </View>
          <TouchableOpacity onPress={disconnect}>
            <ResponsiveText variant="h6" fontWeight={'800'} color="black">
              Disconnect
            </ResponsiveText>
          </TouchableOpacity>
        </View>

        <View style={styles.subContainer}>
          {optionList.map(item => {
            return (
              <TouchableOpacity
                key={item.name}
                style={styles.optionIcon}
                onPress={item.action}>
                <Image
                  source={item.icon}
                  alt={`${item.name} icon`}
                  style={styles.imageStyle}
                />
                <ResponsiveText
                  variant="h6"
                  color="black"
                  textTransform={'capitalize'}
                  fontSize={14}
                  fontWeight={'700'}>
                  {item.name}
                </ResponsiveText>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.fileContainer}>
          <View style={styles.sendReceiveContainer}>
            <View style={styles.sendReceiveButtonContainer}>
              <TouchableOpacity
                style={[
                  styles.sendRecieveButton,
                  activeTab === 'SENT'
                    ? styles.activeButton
                    : styles.inactiveButton,
                ]}
                onPress={() => handleTabChange('SENT')}>
                <ResponsiveText
                  color={activeTab === 'SENT' ? 'white' : 'black'}>
                  Sent
                </ResponsiveText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.sendRecieveButton,
                  activeTab === 'RECEIVED'
                    ? styles.activeButton
                    : styles.inactiveButton,
                ]}
                onPress={() => handleTabChange('RECEIVED')}>
                <ResponsiveText
                  color={activeTab === 'RECEIVED' ? 'white' : 'black'}>
                  Received
                </ResponsiveText>
              </TouchableOpacity>
            </View>
            <View style={styles.sendReceiveDataContainer}>
              <ResponsiveText color="black" fontWeight="800">
                {formatFileSize(
                  activeTab === 'SENT' ? totalSentBytes : totalReceivedBytes,
                )}
              </ResponsiveText>
              <ResponsiveText fontWeight="800" color="black">
                /
              </ResponsiveText>
              <ResponsiveText fontWeight="800" color="black">
                {activeTab === 'SENT'
                  ? formatFileSize(
                      sentFiles.reduce(
                        (total: Number, file: any) => total + file.size,
                        0,
                      ),
                    )
                  : formatFileSize(
                      receivedFiles.reduce(
                        (total: number, file: any) => total + file.size,
                        0,
                      ),
                    )}
              </ResponsiveText>
            </View>
          </View>
          {(activeTab === 'SENT' ? sentFiles.length : receivedFiles.length) >
          0 ? (
            <FlatList
              data={activeTab === 'SENT' ? sentFiles : receivedFiles}
              keyExtractor={(_, index) => index.toString()}
              renderItem={renderItems}
              contentContainerStyle={styles.fileList}
            />
          ) : (
            <View style={styles.noDataContainer}>
              <ResponsiveText numberOfLines={1} fontSize={15} color="black">
                {activeTab === 'SENT'
                  ? 'No files sent yet'
                  : 'Nothing received yet'}
              </ResponsiveText>
            </View>
          )}
        </View>
      </View>
    </LinearGradient>
  );
};

export default ConnectionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: dimensions.width,
    height: dimensions.height,
  },
  safeArea: {
    flex: 0,
  },
  optionIcon: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
    width: '33%',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
  },
  imageStyle: {
    width: 25,
    height: 25,
  },
  subContainer: {
    width: '95%',
    padding: 15,
    borderRadius: 15,
    backgroundColor: '#89CFF0',
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  fileContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: 25,
    width: '95%',
    height: '60%',
  },
  sendReceiveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    padding: 12,
    borderBottomColor: '#ccc',
  },
  activeButton: {
    backgroundColor: colors.BG_SECONDARY,
    borderColor: '#888',
    borderWidth: 1,
  },
  inactiveButton: {
    backgroundColor: '#fff',
    borderColor: '#888',
    borderWidth: 1,
  },
  sendReceiveButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  openButton: {
    backgroundColor: colors.BG_SECONDARY,
    borderRadius: 100,
    padding: 5,
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendReceiveDataContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 1,
  },
  sendRecieveButton: {
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 2,
    paddingVertical: 5,
    gap: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  fileInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fileDetails: {
    marginLeft: 10,
    width: '70%',
  },
  fileList: {
    // height: screenHeight * 0.4,
  },
  noDataContainer: {
    height: dimensions.height * 0.4,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
