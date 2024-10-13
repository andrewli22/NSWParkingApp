import { View, Text, RefreshControl, ScrollView, StyleSheet } from "react-native"
import { RootStackParamList } from '../utils/types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useEffect, useState } from "react";
import { API_KEY } from "../config";
import { URL } from "../utils/api";
import { SafeAreaView } from "react-native-safe-area-context";


type Props = NativeStackScreenProps<RootStackParamList, 'Carpark'>;

export const CarparkScreen = ({ route }: Props) => {
  const { facilityId, facilityName } = (route.params as RootStackParamList['Carpark']);
  const [spots, setSpots] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  useEffect(() => {
    const fetchCarParks = async () => {
      try{
        fetch(URL+`/carpark?facility=${facilityId}`, {
          headers: {
            'Authorization': `apikey ${API_KEY}`,
            'Content-Type': 'application/json'
          }
        })
          .then((res) => res.json())
          .then((data) => {
            setTotal(data.occupancy.total);
            setSpots(data.spots);
          });
      } catch (e) {
        console.error(e)
      }
    };
    fetchCarParks();
  }, [])
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <Text>Pull down to see RefreshControl indicator</Text>
      </ScrollView>
    </SafeAreaView>
    // <Text style={styles.container}>{spots - total} Spots Available</Text>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    backgroundColor: 'pink',
    alignItems: 'center',
    justifyContent: 'center',
  },
});