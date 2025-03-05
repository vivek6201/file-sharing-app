import {View, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import ResponsiveText from '../../components/shared/ResponsiveText';
import MyCodeScreen from '../../components/CodeComponents/MyCode';
import ScanCodeScreen from '../../components/CodeComponents/ScanCode';
import CommonHeader from '../../components/shared/Header';

enum IMode {
  MyCode = 'MyCode',
  ScanCode = 'ScanCode',
}

const CodeActions = () => {
  const [activeMode, setActiveMode] = useState(IMode.MyCode);
  return (
    <View style={styles.container}>
      <CommonHeader title="Actions" />
      <View style={styles.codeContainer}>
        {activeMode === IMode.MyCode ? <MyCodeScreen /> : <ScanCodeScreen />}
        <View style={styles.modeContainer}>
          <TouchableOpacity
            style={[
              styles.defaultMode,
              activeMode === IMode.MyCode && styles.activeMode,
            ]}
            onPress={() => setActiveMode(IMode.MyCode)}>
            <ResponsiveText
              color={activeMode === IMode.MyCode ? 'white' : 'black'}>
              My Code
            </ResponsiveText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.defaultMode,
              activeMode === IMode.ScanCode && styles.activeMode,
            ]}
            onPress={() => setActiveMode(IMode.ScanCode)}>
            <ResponsiveText
              color={activeMode === IMode.ScanCode ? 'white' : 'black'}>
              Scan Code
            </ResponsiveText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default CodeActions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
    alignItems: 'center',
  },
  codeContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  modeContainer: {
    flexDirection: 'row',
    marginTop: 20,
    borderRadius: 25,
    backgroundColor: '#EAEAEA',
    padding: 4,
    width: '60%',
    height: 45,
    justifyContent: 'space-between',
  },
  defaultMode: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 20,
  },
  activeMode: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    shadowColor: '#007AFF',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
});
