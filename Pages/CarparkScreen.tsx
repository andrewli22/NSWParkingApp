import { View, Text } from "react-native"
import { RootStackParamList } from '../utils/types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<RootStackParamList, 'Carpark'>;

export const CarparkScreen = ({ route }: Props) => {
  const { facilityId } = (route.params as RootStackParamList['Carpark']);
  return (
    <View>
      <Text>{facilityId}</Text>
    </View>
  )
}