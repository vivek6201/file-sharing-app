import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {CircleArrowLeft} from 'lucide-react-native';
import {goBack, navigationRef} from '../../helpers/NavigationManager.';
import colors from '../../styles/colors';
import {dimensions} from '../../utils/constants';
import ResponsiveText from './ResponsiveText';

const CommonHeader = ({
  title,
  customBackAction,
}: {
  title: string;
  customBackAction?: () => void;
}) => {
  const canGoBack = navigationRef.canGoBack();
  return (
    <View style={styles.headerContainer}>
      {/* Render button only if canGoBack is true */}
      {canGoBack && (
        <TouchableOpacity onPress={() => customBackAction ? customBackAction() : goBack()} style={styles.goBackButton}>
          <CircleArrowLeft color={'white'} />
        </TouchableOpacity>
      )}

      {/* Center title properly */}
      <ResponsiveText variant="h4" fontWeight="600" textAlign="center">
        {title}
      </ResponsiveText>
    </View>
  );
};

export default CommonHeader;

const styles = StyleSheet.create({
  headerContainer: {
    width: dimensions.width,
    height: 100,
    maxHeight: 80,
    borderBottomEndRadius: 20,
    borderBottomStartRadius: 20,
    padding: 20,
    backgroundColor: colors.BG_PRIMARY,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Center items horizontally
  },
  headerText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 20,
    textAlign: 'center',
  },
  withBackButton: {
    flex: 1, // Ensures title takes remaining space when button exists
    textAlign: 'center',
  },
  goBackButton: {
    position: 'absolute',
    left: 20, // Ensures button stays on the left
    zIndex: 10,
  },
});
