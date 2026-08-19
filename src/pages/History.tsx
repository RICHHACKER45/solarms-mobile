import React, { useState, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonIcon, IonButton, IonTextarea } from '@ionic/react';
import { time, documentTextOutline, trashOutline } from 'ionicons/icons';
import { StorageService } from '../services/StorageService';

const History: React.FC = () => {
  const [logData, setLogData] = useState<string>('Loading logs...');

  const fetchLogs = async () => {
    const logs = await StorageService.readLogFile();
    setLogData(logs);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

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
            Refresh Logs
          </IonButton>
          <IonButton color="danger" fill="outline" onClick={handleClearLogs}>
            <IonIcon slot="start" icon={trashOutline} />
            Clear
          </IonButton>
        </div>
        
        <IonTextarea 
          readonly 
          value={logData} 
          style={{ 
            fontFamily: 'monospace', 
            background: 'rgba(0,0,0,0.3)', 
            color: '#a0aec0', 
            padding: '10px', 
            minHeight: '400px',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.1)'
          }} 
        />
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', textAlign: 'center', marginTop: '16px' }}>
          These logs are saved to your Android device's Documents folder as <strong>solarms_history.csv</strong>.
        </p>
      </IonContent>
    </IonPage>
  );
};

export default History;
