import {ActivityIndicator, Animated, StyleSheet, View} from 'react-native';
import React, {FC, useEffect, useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import QRCode from 'react-native-qrcode-svg';
import {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import ResponsiveText from '../shared/ResponsiveText';

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const MyCodeScreen = () => {
  const [loading, setLoading] = useState(false);
  const [qrValue, setQrValue] = useState('Vivek');
  const shimmerTranslateX = useSharedValue(-300);

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{translateX: shimmerTranslateX.value}],
  }));

  useEffect(() => {
    shimmerTranslateX.value = withRepeat(
      withTiming(300, {duration: 1500, easing: Easing.linear}),
      -1,
      false,
    );
  }, []);

  return (
    <View style={styles.container}>
      {loading || qrValue === null || qrValue === '' ? (
        <View style={styles.skeleton}>
          <AnimatedLinearGradient
            colors={['#f3f3f3', 'gray', '#f3f3f3']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={[styles.shimmerGradient, shimmerStyle]}
          />
        </View>
      ) : (
        <QRCode
          value={qrValue}
          size={250}
          logoSize={60}
          logoBackgroundColor="#fff"
          logoMargin={2}
          logoBorderRadius={10}
        />
      )}

      <View style={styles.infoContainer}>
        <ResponsiveText variant="h6" color="gray">
          Ensure you both are on same Wi-Fi network
        </ResponsiveText>
        <ResponsiveText
          variant="h6"
          fontWeight={'600'}
          color="black"
          numberOfLines={2}>
          Ask the sender to scan the QRcode to connect and transfer files
        </ResponsiveText>
        {loading && (
          <ActivityIndicator
            size={'small'}
            color={'#000'}
            style={{alignSelf: 'center'}}
          />
        )}
      </View>
    </View>
  );
};

export default MyCodeScreen;

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
  },
  shimmerGradient: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    borderRadius: 12,
  },
  infoContainer: {
    marginTop: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 6,
  },
});
