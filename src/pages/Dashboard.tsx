import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonGrid, IonRow, IonCol, IonIcon } from '@ionic/react';
import { sunny, flash, flashOff, power, checkmarkCircle } from 'ionicons/icons';
import MetricCard from '../components/MetricCard';
import PowerChart from '../components/PowerChart';
import QuickControls from '../components/QuickControls';
import './Home.css';

const Dashboard: React.FC = () => {
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

  const chartLabels = ['10:00', '10:05', '10:10', '10:15', '10:20', '10:25', '10:30'];
  const chartDataPoints = [15, 20, 22, 26, 25, 26.25, 26.25];

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
        <div className="ion-padding" style={{ paddingBottom: '30px' }}>
          <IonGrid style={{ padding: 0 }}>
            <IonRow>
              <IonCol size="6">
                <MetricCard 
                  title="Panel Voltage" 
                  value={sensorData.voltage} 
                  unit="V" 
                  icon={flash} 
                  colorClass="voltage" 
                />
              </IonCol>
              <IonCol size="6">
                <MetricCard 
                  title="Current" 
                  value={sensorData.current} 
                  unit="A" 
                  icon={flashOff} 
                  colorClass="current" 
                />
              </IonCol>
              <IonCol size="6">
                <MetricCard 
                  title="Power Output" 
                  value={sensorData.power} 
                  unit="W" 
                  icon={power} 
                  colorClass="power" 
                />
              </IonCol>
              <IonCol size="6">
                <MetricCard 
                  title="System Status" 
                  value={sensorData.status} 
                  unit="" 
                  icon={checkmarkCircle} 
                  colorClass="status" 
                />
              </IonCol>
            </IonRow>
          </IonGrid>

          <PowerChart labels={chartLabels} dataPoints={chartDataPoints} />

          <QuickControls 
            systemLoad={controls.systemLoad}
            maintenanceMode={controls.maintenanceMode}
            onSystemLoadChange={(v) => setControls({...controls, systemLoad: v})}
            onMaintenanceModeChange={(v) => setControls({...controls, maintenanceMode: v})}
          />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Dashboard;
