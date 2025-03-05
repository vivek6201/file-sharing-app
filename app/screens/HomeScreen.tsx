import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import TransferScreen from './Transfer/TransferScreen';
import HistoryScreen from './HistoryScreen';

const Tab = createBottomTabNavigator();

const HomeScreen = () => {
  return (
    <Tab.Navigator
      initialRouteName="Transfer"
      screenOptions={{headerShown: false}}>
      <Tab.Screen name="Transfer" component={TransferScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
    </Tab.Navigator>
  );
};

export default HomeScreen;
