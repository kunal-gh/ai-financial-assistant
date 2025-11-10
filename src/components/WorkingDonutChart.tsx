import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

interface ChartData {
  label: string;
  value: number;
  color: string;
}

interface WorkingDonutChartProps {
  data: ChartData[];
  size?: number;
}

const WorkingDonutChart: React.FC<WorkingDonutChartProps> = ({
  data,
  size = 200,
}) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <View style={styles.container}>
      {/* Simple Pie Chart using stacked bars */}
      <View style={styles.chartContainer}>
        <View style={[styles.pieChart, {width: size, height: size, borderRadius: size / 2}]}>
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100;
            return (
              <View
                key={index}
                style={[
                  styles.pieSlice,
                  {
                    backgroundColor: item.color,
                    height: `${percentage}%`,
                  },
                ]}
              />
            );
          })}
        </View>
        
        {/* Center circle for donut effect */}
        <View style={[styles.centerCircle, {
          width: size * 0.6,
          height: size * 0.6,
          borderRadius: (size * 0.6) / 2,
        }]}>
          <Text style={styles.totalLabel}>TOTAL</Text>
          <Text style={styles.totalValue}>₹{total.toLocaleString()}</Text>
        </View>
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        {data.map((item, index) => {
          const percentage = ((item.value / total) * 100).toFixed(1);
          return (
            <View key={index} style={styles.legendItem}>
              <View style={[styles.legendDot, {backgroundColor: item.color}]} />
              <Text style={styles.legendLabel}>{item.label}</Text>
              <Text style={styles.legendValue}>
                ₹{item.value.toLocaleString()} ({percentage}%)
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  chartContainer: {
    position: 'relative',
    marginBottom: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pieChart: {
    overflow: 'hidden',
    flexDirection: 'column',
  },
  pieSlice: {
    width: '100%',
  },
  centerCircle: {
    position: 'absolute',
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  totalLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#b0b0b0',
    letterSpacing: 0.5,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 4,
  },
  legend: {
    width: '100%',
    paddingHorizontal: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
    paddingHorizontal: 20,
  },
  legendDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 12,
  },
  legendLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#1a2332',
  },
  legendValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1a2332',
  },
});

export default WorkingDonutChart;
