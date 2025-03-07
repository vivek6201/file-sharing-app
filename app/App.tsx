import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import SendScreen from './screens/Transfer/SendScreen';
import ReceiveScreen from './screens/Transfer/ReceiveScreen';
import CodeActions from './screens/Transfer/CodeActions';
import ConnectionScreen from './screens/Transfer/ConnectionScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Send" component={SendScreen} />
      <Stack.Screen name="Receive" component={ReceiveScreen} />
      <Stack.Screen name="Code" component={CodeActions} />
      <Stack.Screen name="Connection" component={ConnectionScreen} />
    </Stack.Navigator>
  );
};

export default App;
