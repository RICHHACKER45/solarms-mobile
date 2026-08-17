import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
  IonToggle
} from '@ionic/react';
import { sunny, flash, flashOff, power, checkmarkCircle } from 'ionicons/icons';
import { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import './Home.css';

// Register ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Home: React.FC = () => {
  // Dummy Data State for UI visualization
  const [sensorData] = useState({
    voltage: 12.5,
    current: 2.1,
    power: 26.25,
    status: 'Normal'
  });

  const [controls, setControls] = useState({
    systemLoad: true,
    maintenanceMode: false
  });

  // Dummy Chart Data
  const chartData = {
    labels: ['10:00', '10:05', '10:10', '10:15', '10:20', '10:25', '10:30'],
    datasets: [
      {
        label: 'Power Output (W)',
        data: [15, 20, 22, 26, 25, 26.25, 26.25],
        borderColor: '#f39c12',
        backgroundColor: 'rgba(243, 156, 18, 0.2)',
        tension: 0.4,
        fill: true,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        ticks: { color: 'rgba(255, 255, 255, 0.7)' }
      },
      x: {
        grid: { display: false },
        ticks: { color: 'rgba(255, 255, 255, 0.7)' }
      }
    }
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar className="dashboard-header">
          <IonTitle className="header-title">
            <IonIcon icon={sunny} /> SolarPro
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="ion-padding">
          {/* Metrics Grid */}
          <IonGrid>
            <IonRow>
              <IonCol size="6">
                <IonCard className="metric-card voltage">
                  <IonIcon icon={flash} />
                  <div className="metric-value">{sensorData.voltage} V</div>
                  <div className="metric-label">Panel Voltage</div>
                </IonCard>
              </IonCol>
              <IonCol size="6">
                <IonCard className="metric-card current">
                  <IonIcon icon={flashOff} />
                  <div className="metric-value">{sensorData.current} A</div>
                  <div className="metric-label">Current</div>
                </IonCard>
              </IonCol>
              <IonCol size="6">
                <IonCard className="metric-card power">
                  <IonIcon icon={power} />
                  <div className="metric-value">{sensorData.power} W</div>
                  <div className="metric-label">Power Output</div>
                </IonCard>
              </IonCol>
              <IonCol size="6">
                <IonCard className="metric-card status">
                  <IonIcon icon={checkmarkCircle} />
                  <div className="metric-value">{sensorData.status}</div>
                  <div className="metric-label">System Status</div>
                </IonCard>
              </IonCol>
            </IonRow>
          </IonGrid>

          {/* Real-time Chart */}
          <IonCard className="chart-card">
            <div className="chart-title">Real-time Power Output</div>
            <Line data={chartData} options={chartOptions} />
          </IonCard>

          {/* Quick Controls */}
          <IonCard className="controls-card">
            <IonList lines="none" style={{ background: 'transparent' }}>
              <IonItem>
                <IonIcon icon={power} slot="start" color="primary" />
                <IonLabel>
                  <h2>System Load</h2>
                  <p>Turn power output ON/OFF</p>
                </IonLabel>
                <IonToggle 
                  checked={controls.systemLoad} 
                  onIonChange={e => setControls({...controls, systemLoad: e.detail.checked})}
                />
              </IonItem>
              <IonItem>
                <IonIcon icon={checkmarkCircle} slot="start" color="warning" />
                <IonLabel>
                  <h2>Maintenance Mode</h2>
                  <p>Safely inspect system</p>
                </IonLabel>
                <IonToggle 
                  checked={controls.maintenanceMode} 
                  onIonChange={e => setControls({...controls, maintenanceMode: e.detail.checked})}
                />
              </IonItem>
            </IonList>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
