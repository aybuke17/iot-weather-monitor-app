import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, RefreshControl, SafeAreaView, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Card } from 'react-native-paper';
import { CHANNEL_ID } from '@env';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sensorData, setSensorData] = useState({
    labels: [],
    temperature: [],
    humidity: [],
    pressure: [],
    lux: [],
    lastUpdate: 'Henüz veri alınmadı'
  });

  const fetchThingSpeakData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`https://api.thingspeak.com/channels/${CHANNEL_ID}/feeds.json`);
      const data = await response.json();
      const feeds = data.feeds || [];

      const temperature = feeds
        .filter(feed => feed.field1 !== null && feed.field1 !== undefined)
        .map(feed => parseFloat(feed.field1))
        .slice(-20);

      const humidity = feeds
        .filter(feed => feed.field2 !== null && feed.field2 !== undefined)
        .map(feed => parseFloat(feed.field2))
        .slice(-20);

      const pressure = feeds
        .filter(feed => feed.field4 !== null && feed.field4 !== undefined)
        .map(feed => parseFloat(feed.field4))
        .slice(-20);

      const lux = feeds
        .filter(feed => feed.field5 !== null && feed.field5 !== undefined)
        .map(feed => parseFloat(feed.field5))
        .slice(-20);

      const labels = feeds
        .filter(feed => feed.field1 !== null && feed.field1 !== undefined)
        .map((feed, index) => {
          const date = new Date(feed.created_at);
          return index % 5 === 0 ? `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}` : '';
        })
        .slice(-20);

      const lastUpdateDate = new Date(feeds[feeds.length - 1].created_at);
      const lastUpdate = `${lastUpdateDate.toLocaleDateString()} ${lastUpdateDate.toLocaleTimeString()}`;

      setSensorData({
        labels,
        temperature,
        humidity,
        pressure,
        lux,
        lastUpdate
      });
    } catch (error) {
      console.error('Veri çekme hatası:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchThingSpeakData();
  }, []);

  useEffect(() => {
    fetchThingSpeakData();
    const interval = setInterval(() => {
      fetchThingSpeakData();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Text style={styles.title}>ESP32 Sensör Verileri</Text>
        <Text style={styles.updateText}>Son güncelleme: {sensorData.lastUpdate}</Text>

        {isLoading ? (
          <Text style={styles.loadingText}>Veriler yükleniyor...</Text>
        ) : (
          <>
            <Card style={styles.card}>
              <Card.Title title="Sıcaklık Grafiği" />
              <Card.Content>
                <LineChart
                  data={{
                    labels: sensorData.labels,
                    datasets: [{ data: sensorData.temperature, color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`, strokeWidth: 2 }],
                    legend: ["Sıcaklık (°C)"]
                  }}
                  width={Dimensions.get("window").width - 40}
                  height={220}
                  chartConfig={chartConfig}
                  bezier
                  style={styles.chart}
                />
              </Card.Content>
            </Card>

            <Card style={styles.card}>
              <Card.Title title="Nem Grafiği" />
              <Card.Content>
                <LineChart
                  data={{
                    labels: sensorData.labels,
                    datasets: [{ data: sensorData.humidity, color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`, strokeWidth: 2 }],
                    legend: ["Nem (%)"]
                  }}
                  width={Dimensions.get("window").width - 40}
                  height={220}
                  chartConfig={chartConfig}
                  bezier
                  style={styles.chart}
                />
              </Card.Content>
            </Card>

            <Card style={styles.card}>
              <Card.Title title="Basınç Grafiği" />
              <Card.Content>
                <LineChart
                  data={{
                    labels: sensorData.labels,
                    datasets: [{ data: sensorData.pressure, color: (opacity = 1) => `rgba(0, 128, 0, ${opacity})`, strokeWidth: 2 }],
                    legend: ["Basınç (hPa)"]
                  }}
                  width={Dimensions.get("window").width - 40}
                  height={220}
                  chartConfig={chartConfig}
                  bezier
                  style={styles.chart}
                />
              </Card.Content>
            </Card>

            <Card style={styles.card}>
              <Card.Title title="Işık Şiddeti Grafiği" />
              <Card.Content>
                <LineChart
                  data={{
                    labels: sensorData.labels,
                    datasets: [{ data: sensorData.lux, color: (opacity = 1) => `rgba(255, 165, 0, ${opacity})`, strokeWidth: 2 }],
                    legend: ["Işık (lux)"]
                  }}
                  width={Dimensions.get("window").width - 40}
                  height={220}
                  chartConfig={chartConfig}
                  bezier
                  style={styles.chart}
                />
              </Card.Content>
            </Card>

            <Card style={styles.card}>
              <Card.Title title="Son Değerler" />
              <Card.Content>
                <View style={styles.valueContainer}>
                  <Text style={styles.valueText}>Sıcaklık: {sensorData.temperature[sensorData.temperature.length - 1]} °C</Text>
                  <Text style={styles.valueText}>Nem: {sensorData.humidity[sensorData.humidity.length - 1]} %</Text>
                  <Text style={styles.valueText}>Basınç: {sensorData.pressure[sensorData.pressure.length - 1]} hPa</Text>
                  <Text style={styles.valueText}>Işık: {sensorData.lux[sensorData.lux.length - 1]} lux</Text>
                </View>
              </Card.Content>
            </Card>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const chartConfig = {
  backgroundColor: "#fff",
  backgroundGradientFrom: "#fff",
  backgroundGradientTo: "#fff",
  decimalPlaces: 1,
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  style: {
    borderRadius: 16
  },
  propsForDots: {
    r: "6",
    strokeWidth: "2",
    stroke: "#ffa726"
  },
  propsForLabels: {
    fontSize: 8
  }
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  scrollView: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 16 },
  updateText: { textAlign: 'center', color: '#666', marginBottom: 16 },
  loadingText: { textAlign: 'center', fontSize: 18, marginTop: 50 },
  card: { marginBottom: 20, elevation: 4, borderRadius: 8 },
  chart: { marginVertical: 8, borderRadius: 16 },
  valueContainer: { padding: 10 },
  valueText: { fontSize: 18, marginVertical: 4 }
});