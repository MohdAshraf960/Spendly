// Splash decides auth; Home is the main ledger. Headers are set per screen.
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {LoginScreen} from '../screens/auth';
import {AddExpenseScreen, EditExpenseScreen} from '../screens/expenses';
import {HomeScreen} from '../screens/home';
import {SplashScreen} from '../screens/splash';
import type {RootStackParamList} from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen
        name="AddExpense"
        component={AddExpenseScreen}
        options={{headerShown: true, title: 'Add Expense'}}
      />
      <Stack.Screen
        name="EditExpense"
        component={EditExpenseScreen}
        options={{headerShown: true, title: 'Edit Expense'}}
      />
    </Stack.Navigator>
  );
};

export default RootStack;
