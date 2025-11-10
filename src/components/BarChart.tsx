import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

interface BarChartProps {
  data: {label: string; value: number; color: string}[];
  height?: number;
}

const BarChart: React.FC<BarChartProps> = ({data, height = 200}) => {
  const maxValue = Math.max(...data.map(item => item.value));

  return (
    <View style={styles.container}>
      <View style={[styles.chartContainer, {height}]}>
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * (height - 40);
          return (
            <View key={index} style={styles.barWrapper}>
              <View style={styles.barContainer}>
                <Text style={styles.valueText}>${item.value}</Text>
                <View
                  style={[
                    styles.bar,
                    {
                      height: barHeight,
                      backgroundColor: item.color,
                    },
                  ]}
                />
              </View>
              <Text style={styles.labelText}>{item.label}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    paddingBottom: 8,
  },
  barWrapper: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  barContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
    width: '100%',
  },
  bar: {
    width: '85%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    minHeight: 25,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  valueText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1a2332',
    marginBottom: 6,
  },
  labelText: {
    fontSize: 12,
    color: '#6b7c8d',
    marginTop: 10,
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default BarChart;
