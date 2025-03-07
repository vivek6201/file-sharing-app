import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {dimensions} from '../../utils/constants';
import colors from '../../styles/colors';
import {CircleArrowLeft} from 'lucide-react-native';
import {goBack} from '../../helpers/NavigationManager.';
import LottieView from 'lottie-react-native';
import ResponsiveText from '../../components/shared/ResponsiveText';
import { SafeAreaView } from 'react-native-safe-area-context';

const SendScreen = () => {

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
  waveContainer: {
    flex: 1,
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: dimensions.height,
    width: dimensions.width,
  },
});
