import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {dimensions} from '../../utils/constants';
import colors from '../../styles/colors';
import {CircleArrowLeft} from 'lucide-react-native';
import {goBack} from '../../helpers/NavigationManager.';

const ReceiveScreen = () => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={goBack}>
        <CircleArrowLeft color={'white'} size={26} />
      </TouchableOpacity>

      <View></View>
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
});
