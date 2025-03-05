/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './app/App';
import {name as appName} from './app.json';
import {NavigationContainer} from '@react-navigation/native';
import {navigationRef} from './app/helpers/NavigationManager.';
import AppContextProvider from './app/contexts/appContext';

const MainApp = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <AppContextProvider>
        <App />
      </AppContextProvider>
    </NavigationContainer>
  );
};

AppRegistry.registerComponent(appName, () => MainApp);
