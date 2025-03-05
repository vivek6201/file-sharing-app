import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {
  Download,
  LucideIcon,
  ScanQrCode,
  SendHorizontal,
} from 'lucide-react-native';
import {navigate, pushToStack} from '../../helpers/NavigationManager.';
import {dimensions} from '../../utils/constants';
import colors from '../../styles/colors';
import ResponsiveText from '../../components/shared/ResponsiveText';

const TransferScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerInnerContainer}>
          <View>
            <ResponsiveText variant="h4" fontWeight={600}>
              Quick Share
            </ResponsiveText>
            <ResponsiveText variant="h6">Share files with ease</ResponsiveText>
          </View>
          <TouchableOpacity style={styles.scannerBtn} onPress={() => navigate("Code")}>
            <ScanQrCode color={"white"} size={20}/>
          </TouchableOpacity>
        </View>
        <View style={styles.actionContainer}>
          <HeaderActionButton
            name="Send"
            Icon={SendHorizontal}
            screenName="Send"
          />
          <HeaderActionButton
            name="Receive"
            Icon={Download}
            screenName="Receive"
          />
        </View>
      </View>
      <View style={styles.historyContainer}>
        <ResponsiveText variant="h5" color="black">
          No History to Show
        </ResponsiveText>
      </View>
    </View>
  );
};

export default TransferScreen;

function HeaderActionButton({
  name,
  Icon,
  screenName,
}: {
  name: string;
  Icon: LucideIcon;
  screenName: string;
}) {
  return (
    <TouchableOpacity
      style={styles.actionButtonOuter}
      onPress={() => pushToStack(screenName)}>
      <View style={styles.actionButtonInner}>
        <Icon />
      </View>
      <ResponsiveText variant="h6" color="black">
        {name}
      </ResponsiveText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: dimensions.height,
    width: dimensions.width,
  },
  scannerBtn: {
    borderRadius: '100%',
    backgroundColor: colors.BG_SECONDARY,
    padding: 8,
    marginTop: 3,
  },
  headerContainer: {
    width: dimensions.width,
    height: 120,
    backgroundColor: colors.BG_PRIMARY,
    borderBottomEndRadius: 30,
    borderBottomStartRadius: 30,
    padding: 20,
    position: 'relative',
  },
  headerInnerContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  actionButtonInner: {
    borderRadius: 20,
    backgroundColor: 'white',
    width: 50,
    aspectRatio: 1,
    padding: 5,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 50,
  },
  actionContainer: {
    maxWidth: '95%',
    marginLeft: 'auto',
    marginRight: 'auto',
    position: 'absolute',
    left: 30,
    right: 30,
    bottom: -40,
    flex: 1,
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionButtonOuter: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 5,
  },
  historyContainer: {
    flexGrow: 1,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
