import {Image, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import {Camera, CodeScanner, useCameraDevice} from 'react-native-vision-camera';

const ScanCodeScreen = () => {
  const [codeFound, setCodeFound] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const device = useCameraDevice('back');
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const checkPermission = async () => {
      const cameraPermission = await Camera.requestCameraPermission();
      setHasPermission(cameraPermission === 'granted');
    };

    checkPermission();
    setIsActive(true);

    return () => {
      setIsActive(false);
    };
  }, []);

  const handleScannedData = (data?: string) => {
    const [connectionData, deviceName] = data?.replace('tcp://', '').split('|');
    const [host, port] = connectionData.split(':');
  };

  const codeScanner = useMemo<CodeScanner>(
    () => ({
      codeTypes: ['qr', 'codabar'],
      onCodeScanned: codes => {
        if (codeFound) return;
        console.log(`Scanned ${codes?.length}`);

        if (codes.length > 0) {
          const scannedData = codes[0].value;
          console.log(scannedData);
          setCodeFound(true);
          handleScannedData(scannedData);
        }
      },
    }),
    [codeFound],
  );

  return (
    <View style={styles.container}>
      <View style={styles.skeleton}>
        {!device || !hasPermission ? (
          <Text>No Camera Found</Text>
        ) : (
          <Camera
            style={{width: 250, height: 250}}
            device={device}
            codeScanner={codeScanner}
            isActive={isActive}
          />
        )}
      </View>
      <Text>Scan QRCode to establish a connection.</Text>
    </View>
  );
};

export default ScanCodeScreen;

const styles = StyleSheet.create({
  container: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  skeleton: {
    width: 250,
    height: 250,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 10
  },
});
