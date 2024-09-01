import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, Button, TextInput, StyleSheet } from "react-native";

type HomeScreenNavigationProp = NativeStackNavigationProp<any>;
type Props = {
  navigation: HomeScreenNavigationProp;
};
export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <SafeAreaView>
      <StatusBar />
      <TextInput
        style={styles.textInput}
        placeholder="Enter Carpark"
      />
      <Button title='Next page' onPress={() => navigation.navigate('Search')} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  textInput: {
    borderColor: 'red',
    borderRadius: 20,
    borderWidth: 2,
    padding: 5
  }
})