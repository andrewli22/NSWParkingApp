import { View, Text, RefreshControl, ScrollView, StyleSheet } from 'react-native'
import { RootStackParamList } from '../utils/types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useEffect, useState } from 'react';
import { API_KEY } from '../config';
import { URL } from '../utils/api';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PieChart } from 'react-native-gifted-charts';

type Props = NativeStackScreenProps<RootStackParamList, 'Carpark'>;

export const CarparkScreen = ({ route }: Props) => {
  const { facilityId } = (route.params as RootStackParamList['Carpark']);
  const [refreshing, setRefreshing] = useState(false);
  const [spots, setSpots] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);

  const pieData = [
    {value: spots-total, color: 'blue'},
    {value: spots, color: 'red'},
  ];

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
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.pieWrapper}>
          <Text>{spots - total} / {spots}</Text>
        </View>
        <View>
          <PieChart
            donut
            // semiCircle={true}
            radius={150}
            innerRadius={130}
            data={pieData}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pieWrapper: {
    zIndex: 1,
    position: 'absolute'
  }
});