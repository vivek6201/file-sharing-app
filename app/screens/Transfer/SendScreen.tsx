import {
  Animated,
  Easing,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {dimensions} from '../../utils/constants';
import colors from '../../styles/colors';
import {CircleArrowLeft} from 'lucide-react-native';
import {goBack, navigate} from '../../helpers/NavigationManager.';
import LottieView from 'lottie-react-native';
import ResponsiveText from '../../components/shared/ResponsiveText';
import {SafeAreaView} from 'react-native-safe-area-context';
import useSocket from '../../hooks/useSocket';
import dgarm from 'react-native-udp';
import {v4 as uuid} from 'uuid';

const SendScreen = () => {
  const {connectToServer, isConnected} = useSocket();
  const [nearbyDevices, setNearbyDevices] = useState<any>([]);

  useEffect(() => {
    if (!isConnected) return;

    navigate('Connection');
  }, [isConnected]);

  const handleConnect = (data: any) => {
    const [connectionData, deviceName] = data
      ? data.replace('tcp://', '').split('|')
      : ['', ''];
    const [host, port] = connectionData.split(':');

    connectToServer(host, Number(port), deviceName);
  };

  const listenForDevices = async (): Promise<void> => {
    const server = await dgarm.createSocket({
      type: 'udp4',
      reusePort: true,
    });

    const port = 57143;
    server.bind(port, () => {
      console.log('listening for devices');
    });

    const getRandomPosition = (
      radius: number,
      existingPosition: {x: number; y: number}[],
      minDistance: number,
    ) => {
      let pos: any;
      let isOverlap: any;

      do {
        const angle = Math.random() * 360;
        const dist = Math.random() * (radius - 50) + 50;
        const x = dist * Math.cos((angle + Math.PI) / 180);
        const y = dist * Math.sin((angle + Math.PI) / 180);

        pos = {x, y};
        isOverlap = existingPosition.some(exPos => {
          const dx = exPos.x - pos.x;
          const dy = exPos.y - pos.y;
          return Math.sqrt(dx * dx + dy * dy) < minDistance;
        });
      } while (isOverlap);

      return pos;
    };

    server.on('message', (message, info) => {
      const [connectionData, otherDevice] = message
        ?.toString()
        ?.replace('tcp://', '')
        ?.split('|');

      setNearbyDevices((prev: any) => {
        const deviceExists = prev.some(
          (device: any) => device?.name === otherDevice,
        );
        if (!deviceExists) {
          const newDevice = {
            id: uuid(),
            name: otherDevice,
            image: require('../../../assets/images/user.png'),
            fullAddress: message?.toString(),
            position: getRandomPosition(
              150,
              prev?.map((d: any) => d.position),
              50,
            ),
            scale: new Animated.Value(0),
          };

          Animated.timing(newDevice.scale, {
            toValue: 1,
            duration: 1500,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }).start();

          return [...prev, newDevice];
        }
        return prev;
      });
    });
  };

  useEffect(() => {
    let udpServer: any;

    const startServer = async () => {
      udpServer = await listenForDevices();
    };

    startServer();

    return () => {
      if (udpServer) {
        udpServer.close(() => console.log('udp server closed'));
      }
      setNearbyDevices([]);
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={goBack}>
        <CircleArrowLeft color={'white'} size={26} />
      </TouchableOpacity>

      <View style={styles.waveContainer}>
        <ResponsiveText variant="h5" fontWeight={'600'}>
          Scanning for Receiver
        </ResponsiveText>
        <LottieView
          source={require('../../../assets/animations/senderWaveAnimation.json')}
          style={{width: 300, height: 300, marginTop: 10}}
          autoPlay
          loop
        />
        {nearbyDevices.map((device: any) => {
          return (
            <Animated.View
              key={device.id}
              style={[
                styles.deviceIcon,
                {
                  transform: [{scale: device.scale}],
                  left: dimensions.width / 2.33 + device.position?.x,
                  top: dimensions.width / 2.2 + device.position?.y,
                },
              ]}>
              <TouchableOpacity
                style={styles.popup}
                onPress={() => handleConnect(device?.fullAddress)}>
                <Image source={device.image} style={styles.deviceImage} />
                <ResponsiveText numberOfLines={1} fontWeight="600" fontSize={8}>
                  {device?.name}
                </ResponsiveText>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

export default SendScreen;

const styles = StyleSheet.create({
  container: {
    height: dimensions.height,
    width: dimensions.width,
    flex: 1,
    backgroundColor: colors.BG_PRIMARY,
    position: 'relative',
  },
  backBtn: {
    position: 'absolute',
    left: 25,
    top: 25,
  },
  deviceIcon: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popup: {
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: 120,
  },
  deviceImage: {
    width: 35,
    height: 35,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#fff',
  },
  waveContainer: {
    flex: 1,
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: dimensions.height,
    width: dimensions.width,
    position: 'relative',
  },
  devicesContainer: {},
});
