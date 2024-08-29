import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { View, Text, Button } from "react-native";

type HomeScreenNavigationProp = NativeStackNavigationProp<any>;
type Props = {
  navigation: HomeScreenNavigationProp;
};
export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View>
      <Text>Home Screen</Text>
      <Button title='Next page' onPress={() => navigation.navigate('Search')} />
    </View>
  );
}