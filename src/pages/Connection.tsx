import React, { useState, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonIcon, IonButton, IonInput, IonItem, IonLabel, useIonToast } from '@ionic/react';
import { wifiOutline, hardwareChipOutline, saveOutline } from 'ionicons/icons';
import { useHardware } from '../contexts/HardwareContext';
import './Home.css';

const Connection: React.FC = () => {
  const { ipAddress, setIpAddress } = useHardware();
  const [tempIp, setTempIp] = useState(ipAddress);
  const [presentToast] = useIonToast();

  useEffect(() => {
    setTempIp(ipAddress);
  }, [ipAddress]);

  const handleSave = () => {
    setIpAddress(tempIp);
    presentToast({
      message: 'ESP32 Connection updated! Polling new IP...',
      duration: 3000,
      color: 'success',
      icon: wifiOutline
    });
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar className="dashboard-header">
          <IonTitle className="header-title">
            <IonIcon icon={wifiOutline} /> Connection
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="ion-padding" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '40px' }}>
          
          <div style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: 'rgba(243, 156, 18, 0.1)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '30px',
            border: '2px solid rgba(243, 156, 18, 0.5)',
            boxShadow: '0 0 30px rgba(243, 156, 18, 0.2)'
          }}>
            <IonIcon icon={hardwareChipOutline} style={{ fontSize: '4rem', color: '#f39c12' }} />
          </div>

          <h2 style={{ color: '#fff', fontWeight: 'bold', marginBottom: '8px' }}>Hardware Link</h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', textAlign: 'center', marginBottom: '30px', padding: '0 20px' }}>
            Enter the local IP address of the ESP32 module to establish a direct connection.
          </p>

          <div className="glass-card" style={{ width: '100%', padding: '20px', borderRadius: '16px' }}>
            <IonInput 
              label="ESP32 IP Address"
              labelPlacement="stacked"
              fill="outline"
              type="text" 
              placeholder="e.g. 192.168.4.1" 
              value={tempIp}
              onIonInput={(e: any) => setTempIp(e.target.value)}
              style={{
                '--background': 'rgba(0,0,0,0.5)',
                '--color': '#fff',
                marginBottom: '10px'
              }}
            />

            <IonButton expand="block" color="primary" onClick={handleSave} style={{ marginTop: '16px', '--border-radius': '8px' }}>
              <IonIcon slot="start" icon={saveOutline} />
              Connect
            </IonButton>
          </div>

        </div>
      </IonContent>
    </IonPage>
  );
};

export default Connection;
