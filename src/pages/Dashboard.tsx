import React, { useState, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonGrid, IonRow, IonCol, IonIcon, useIonAlert } from '@ionic/react';
import { sunny, flash, flashOff, power, checkmarkCircle } from 'ionicons/icons';
import MetricCard from '../components/MetricCard';
import PowerChart from '../components/PowerChart';
import QuickControls from '../components/QuickControls';
import { useHardware } from '../contexts/HardwareContext';
import { Preferences } from '@capacitor/preferences';
import './Home.css';

const Dashboard: React.FC = () => {
  const { data, ipAddress, isSimulatorEnabled } = useHardware();
  const [presentAlert] = useIonAlert();

  const [controls, setControls] = useState({
    systemLoad: true,
    maintenanceMode: false
  });

  const [chartLabels, setChartLabels] = useState<string[]>([]);
  const [chartDataPoints, setChartDataPoints] = useState<number[]>([]);

  useEffect(() => {
    if (data) {
      const timeString = new Date(data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      
      setChartLabels(prev => {
        const newArr = [...prev, timeString];
        if (newArr.length > 8) newArr.shift(); // Keep only 8 points so it walks smoothly
        return newArr;
      });
      
      setChartDataPoints(prev => {
        const newArr = [...prev, data.metrics.power_w];
        if (newArr.length > 8) newArr.shift();
        return newArr;
      });
    }
  }, [data]);

  useEffect(() => {
    const checkBatteryNotice = async () => {
      const { value } = await Preferences.get({ key: 'battery_notice_shown' });
      if (value !== 'true') {
        presentAlert({
          header: 'Background Execution',
          message: 'To ensure the app receives alerts when closed, please go to your Android Settings -> Apps -> SolarMS -> Battery, and set it to "Unrestricted".',
          buttons: ['Got it!']
        });
        await Preferences.set({ key: 'battery_notice_shown', value: 'true' });
      }
    };
    checkBatteryNotice();
  }, [presentAlert]);

  const handleSystemLoadChange = async (checked: boolean) => {
    setControls(prev => ({ ...prev, systemLoad: checked }));
    if (!isSimulatorEnabled && ipAddress) {
      try {
        await fetch(`http://${ipAddress}/control`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ system_load: checked })
        });
      } catch (e) {
        console.warn('Failed to send control to ESP32', e);
      }
    }
  };

  const handleMaintenanceModeChange = async (checked: boolean) => {
    setControls(prev => ({ ...prev, maintenanceMode: checked }));
    if (!isSimulatorEnabled && ipAddress) {
      try {
        await fetch(`http://${ipAddress}/control`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ maintenance_mode: checked })
        });
      } catch (e) {
        console.warn('Failed to send control to ESP32', e);
      }
    }
  };

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
            onSystemLoadChange={handleSystemLoadChange}
            onMaintenanceModeChange={handleMaintenanceModeChange}
          />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Dashboard;
