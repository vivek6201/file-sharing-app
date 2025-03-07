import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useRef} from 'react';
import {dimensions, isIos} from '../../utils/constants';
import colors from '../../styles/colors';
import {CircleArrowLeft} from 'lucide-react-native';
import {goBack, navigate} from '../../helpers/NavigationManager.';
import ResponsiveText from '../../components/shared/ResponsiveText';
import LottieView from 'lottie-react-native';
import useSocket from '../../hooks/useSocket';
import DeviceInfo from 'react-native-device-info';
import {getBroadcastIPAddress} from '../../utils/utils';
import useApp from '../../hooks/useApp';
import dgram from 'react-native-udp';

const ReceiveScreen = () => {
  const {isConnected} = useSocket();
  const {qrValue, setupServer} = useApp();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const sendDiscoverySignal = async () => {
    const deviceName = await DeviceInfo.getDeviceName();
    const broadcastAddress = await getBroadcastIPAddress();
    const targetAddress = broadcastAddress || '255.255.255.255';
    const port = 57143;

    const client = dgram.createSocket({
      type: 'udp4',
      reusePort: true,
    });
    
    try {
      client.bind(() => {
        try {
          if (isIos) {
            client.setBroadcast(true);
          }

          client.send(qrValue, 0, qrValue.length, port, targetAddress, err => {
            if (err) {
              console.log('error while sending discovery signal', err);
            }
            client.close();
          });
        } catch (error) {
          console.error('failed to set broadcast', error);
          client.close();
        }
      });
    } catch (error) {
      console.error('failed to bind to the client', error);
    }
  };

  useEffect(() => {
    if (!qrValue) return;

    sendDiscoverySignal();
    intervalRef.current = setInterval(sendDiscoverySignal, 10);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [qrValue]);

  const handleGoBack = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    goBack();
  };

  useEffect(() => {
    setupServer();
  }, []);

  useEffect(() => {
    if (isConnected) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      navigate('Connection');
    }
  }, [isConnected]);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={handleGoBack}>
        <CircleArrowLeft color={'white'} size={26} />
      </TouchableOpacity>

      <View style={styles.waveContainer}>
        <ResponsiveText variant="h5" fontWeight={'600'}>
          Scanning for Sender to Connect
        </ResponsiveText>
        <LottieView
          source={require('../../../assets/animations/receiversWaveAnimation.json')}
          style={{width: 300, height: 300, marginTop: 10}}
          autoPlay
          loop
        />
      </View>
    </View>
  );
};

export default ReceiveScreen;

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
  waveContainer: {
    flex: 1,
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: dimensions.height,
    width: dimensions.width,
  },
});
