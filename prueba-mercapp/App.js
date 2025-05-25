import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import Main from './src/components/Main.jsx';
import { NotificationProvider } from './src/context/NotificationContext.jsx';

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="auto" />
      <NotificationProvider>
        <Main />
      </NotificationProvider>
    </View>
  );
}
