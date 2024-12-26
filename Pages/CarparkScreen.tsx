import React from 'react';
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
    {value: total , color: '#ED6665', gradientCenterColor: 'pink'},
    {value: spots-total, color: '#177AD5', gradientCenterColor: 'lightblue'},
  ];

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      fetchCarParks();
    }, 1000);
  }, []);

  const fetchCarParks = () => {
    try{
      fetch(URL+`/carpark?facility=${facilityId}`, {
        headers: {
          'Authorization': `apikey ${API_KEY}`,
          'Content-Type': 'application/json'
        }
      })
        .then((res) => res.json())
        .then((data) => {
          setTotal(Number(data.occupancy.total));
          setSpots(Number(data.spots));
        });
    } catch (e) {
      console.error(e)
    }
  };

  useEffect(() => {
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
        <View>
          <Text style={{ fontSize: 25 }}>Number of spots available</Text>
        </View>
        <View style={styles.pieChart}>
          <View style={styles.pieTextContainer}>
            <View style={styles.pieText}>
              <Text style={{ fontSize: 40 }}>{spots - total} / {spots}</Text>
            </View>
          </View>
          <PieChart
            donut
            semiCircle={true}
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
    padding: 10
  },
  scrollView: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pieChart: {
    height: '100%',
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 50
  },
  pieText: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pieTextContainer: {
    zIndex: 1,
    position: 'absolute',
    top: 340
  }
});