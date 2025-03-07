import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {dimensions} from '../utils/constants';
import CommonHeader from '../components/shared/Header';

const HistoryScreen = () => {
  return (
    <View style={styles.container}>
      <CommonHeader title="History"/>
    </View>
  );
};

export default HistoryScreen;

const styles = StyleSheet.create({
  container: {
    width: dimensions.width,
    height: dimensions.height,
    flex: 1
  },
});
