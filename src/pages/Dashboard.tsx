import React, { useState, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonGrid, IonRow, IonCol, IonIcon } from '@ionic/react';
import { sunny, flash, flashOff, power, checkmarkCircle } from 'ionicons/icons';
import MetricCard from '../components/MetricCard';
import PowerChart from '../components/PowerChart';
import QuickControls from '../components/QuickControls';
import { useHardware } from '../contexts/HardwareContext';
import './Home.css';

const Dashboard: React.FC = () => {
  const { data } = useHardware();

  const [controls, setControls] = useState({
    systemLoad: true,
    maintenanceMode: false
  });

  const [chartLabels, setChartLabels] = useState<string[]>([]);
  const [chartDataPoints, setChartDataPoints] = useState<number[]>([]);

  useEffect(() => {
    if (data) {
      const timeString = new Date(data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      // Keep only the last 10 points for the live chart
      setChartLabels(prev => [...prev.slice(-9), timeString]);
      setChartDataPoints(prev => [...prev.slice(-9), data.metrics.power_w]);
    }
  }, [data]);

  const voltage = data?.metrics.voltage_v ?? 0;
  const current = data?.metrics.current_a ?? 0;
  const powerVal = data?.metrics.power_w ?? 0;
  const status = data?.status === 'online' ? 'Normal' : 'Offline';

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
                  value={voltage} 
                  unit="V" 
                  icon={flash} 
                  colorClass="voltage" 
                />
              </IonCol>
              <IonCol size="6">
                <MetricCard 
                  title="Current" 
                  value={current} 
                  unit="A" 
                  icon={flashOff} 
                  colorClass="current" 
                />
              </IonCol>
              <IonCol size="6">
                <MetricCard 
                  title="Power Output" 
                  value={powerVal} 
                  unit="W" 
                  icon={power} 
                  colorClass="power" 
                />
              </IonCol>
              <IonCol size="6">
                <MetricCard 
                  title="System Status" 
                  value={status as any} 
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
