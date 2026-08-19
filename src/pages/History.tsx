import React, { useState, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonIcon, IonButton, IonList, IonItem, IonLabel, IonCard, IonBadge } from '@ionic/react';
import { time, documentTextOutline, trashOutline, warning, checkmarkCircle } from 'ionicons/icons';
import { StorageService } from '../services/StorageService';
import { useHardware } from '../contexts/HardwareContext';
import './Home.css';

const History: React.FC = () => {
  const { data } = useHardware();
  const [logs, setLogs] = useState<Array<{timestamp: string, voltage: string, current: string, power: string, temp: string}>>([]);

  const fetchLogs = async () => {
    const parsedLogs = await StorageService.getParsedLogs();
    // Reverse the array so the newest logs are at the top
    setLogs(parsedLogs.reverse());
  };

  useEffect(() => {
    fetchLogs();
  }, [data]);

  const handleClearLogs = async () => {
    await StorageService.clearLogs();
    fetchLogs();
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar className="dashboard-header">
          <IonTitle className="header-title">
            <IonIcon icon={time} /> History & Logs
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
          <IonButton color="primary" onClick={fetchLogs}>
            <IonIcon slot="start" icon={documentTextOutline} />
            Refresh
          </IonButton>
          <IonButton color="danger" fill="outline" onClick={handleClearLogs}>
            <IonIcon slot="start" icon={trashOutline} />
            Clear
          </IonButton>
        </div>

        <IonList style={{ background: 'transparent' }}>
          {logs.length === 0 ? (
            <p style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', marginTop: '40px' }}>No logs recorded yet.</p>
          ) : (
            logs.map((log, index) => {
              const isWarning = parseFloat(log.voltage) > 14.5 || parseFloat(log.voltage) < 11.5;
              return (
                <IonCard key={index} className="glass-card" style={{ margin: '0 0 12px 0', border: isWarning ? '1px solid rgba(231, 76, 60, 0.5)' : '1px solid rgba(255,255,255,0.1)' }}>
                  <IonItem lines="none" style={{ '--background': 'transparent' }}>
                    <IonIcon 
                      icon={isWarning ? warning : checkmarkCircle} 
                      slot="start" 
                      color={isWarning ? 'danger' : 'success'} 
                      style={{ fontSize: '2rem' }}
                    />
                    <IonLabel>
                      <h2 style={{ color: '#fff', fontWeight: 'bold', fontSize: '1.1rem' }}>{log.timestamp}</h2>
                      <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', marginTop: '4px' }}>
                        Voltage: <strong style={{ color: '#f39c12' }}>{log.voltage}V</strong> | 
                        Current: <strong>{log.current}A</strong>
                      </p>
                    </IonLabel>
                    <IonBadge color={isWarning ? 'danger' : 'medium'} slot="end">
                      {log.power}W
                    </IonBadge>
                  </IonItem>
                </IonCard>
              );
            })
          )}
        </IonList>
        
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', textAlign: 'center', marginTop: '16px', paddingBottom: '20px' }}>
          Saved as <strong>solarms_history.csv</strong> in local app storage.
        </p>
      </IonContent>
    </IonPage>
  );
};

export default History;
