import React from 'react';
import { IonCard } from '@ionic/react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

interface PowerChartProps {
  labels: string[];
  dataPoints: number[];
}

const PowerChart: React.FC<PowerChartProps> = ({ labels, dataPoints }) => {
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Power Output (W)',
        data: dataPoints,
        borderColor: '#f39c12',
        backgroundColor: 'rgba(243, 156, 18, 0.15)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#f39c12',
        pointBorderColor: '#ffffff',
        pointRadius: 4,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        titleColor: '#f39c12',
        bodyColor: '#ffffff',
        cornerRadius: 8,
      }
    },
    scales: {
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: 'rgba(255, 255, 255, 0.5)' },
        beginAtZero: true
      },
      x: {
        grid: { display: false },
        ticks: { color: 'rgba(255, 255, 255, 0.5)' }
      }
    }
  };

  return (
    <IonCard className="glass-card">
      <div className="chart-title">Real-time Power Output</div>
      <div style={{ padding: '0 10px 15px 10px' }}>
        <Line data={chartData} options={chartOptions} />
      </div>
    </IonCard>
  );
};

export default PowerChart;
