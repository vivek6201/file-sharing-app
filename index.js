/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './app/App';
import {name as appName} from './app.json';
import {NavigationContainer} from '@react-navigation/native';
import {navigationRef} from './app/helpers/NavigationManager.';
import SocketContextProvider from './app/contexts/socketContext';
import AppContextProvider from './app/contexts/appContext';
import {SafeAreaProvider} from 'react-native-safe-area-context';

const MainApp = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <SocketContextProvider>
        <AppContextProvider>
          <SafeAreaProvider>
            <App />
          </SafeAreaProvider>
        </AppContextProvider>
      </SocketContextProvider>
    </NavigationContainer>
  );
};

AppRegistry.registerComponent(appName, () => MainApp);
