import React, { useState, useEffect } from 'react';
import { 
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonIcon, 
  IonList, IonItem, IonLabel, IonInput, 
  IonButton, IonListHeader, useIonToast, useIonAlert, IonToggle
} from '@ionic/react';
import { cog, chatbubbleOutline, lockClosedOutline, warningOutline, constructOutline, alertCircleOutline, keyOutline } from 'ionicons/icons';
import { useHardware } from '../contexts/HardwareContext';
import { Preferences } from '@capacitor/preferences';
import './Home.css';

const Settings: React.FC = () => {
  const [presentToast] = useIonToast();
  const [presentAlert] = useIonAlert();
  const { isSimulatorEnabled, setSimulatorEnabled, triggerFakeSpike } = useHardware();
  
  const [settings, setSettings] = useState({
    adminPhone: '+639123456789',
    voltageThreshold: '11.0'
  });

  const [pinForm, setPinForm] = useState('');
  
  const handleSaveNotification = () => {
    presentToast({ message: 'Notification settings updated!', duration: 2000, color: 'success' });
  };

  const handleUpdatePin = async () => {
    if (pinForm.length < 4) {
      presentToast({ message: 'PIN must be at least 4 digits.', duration: 2000, color: 'danger' });
      return;
    }
    await Preferences.set({ key: 'app_pin', value: pinForm });
    presentToast({ message: 'Security PIN successfully updated!', duration: 2000, color: 'success' });
    setPinForm('');
  };

  const confirmFactoryReset = () => {
    presentAlert({
      header: 'Critical Action!',
      message: 'Are you absolutely sure? This will WIPE the entire system including all settings, sensor data, and logs. This action is IRREVERSIBLE.',
      buttons: [
        { text: 'Cancel', role: 'cancel', cssClass: 'secondary' },
        { 
          text: 'Reset System', 
          role: 'destructive',
          handler: () => {
            presentToast({ message: 'System has been wiped. Rebooting...', duration: 3000, color: 'danger' });
          }
        }
      ]
    });
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar className="dashboard-header">
          <IonTitle className="header-title">
            <IonIcon icon={cog} /> System Settings
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="ion-padding" style={{ paddingBottom: '40px' }}>
          
          {/* Developer Options */}
          <IonList inset={true} className="glass-list settings-list" style={{ border: '1px solid rgba(56, 189, 248, 0.3)' }}>
            <IonListHeader style={{ paddingBottom: '10px' }}>
              <IonIcon icon={constructOutline} style={{ marginRight: '8px', color: '#38bdf8' }} />
              <IonLabel style={{ color: '#38bdf8', fontSize: '1.2rem', fontWeight: 'bold' }}>Developer Options</IonLabel>
            </IonListHeader>
            <IonItem lines="none" style={{ paddingBottom: '8px', '--background': 'transparent' }}>
              <IonLabel style={{ fontSize: '0.95rem', color: '#fff' }}>Mock Data Simulator</IonLabel>
              <IonToggle 
                checked={isSimulatorEnabled} 
                onIonChange={e => setSimulatorEnabled(e.detail.checked)}
                color="secondary"
              />
            </IonItem>
            {isSimulatorEnabled && (
              <IonItem lines="none" style={{ paddingTop: '8px', paddingBottom: '16px', '--background': 'transparent' }}>
                <IonButton 
                  fill="outline" 
                  expand="block" 
                  color="warning" 
                  onClick={() => {
                    triggerFakeSpike();
                    presentToast({ message: 'Fake voltage spike triggered!', duration: 2000, color: 'warning' });
                  }}
                  style={{ width: '100%' }}
                >
                  <IonIcon icon={alertCircleOutline} slot="start" />
                  Test Voltage Spike
                </IonButton>
              </IonItem>
            )}
          </IonList>

          {/* 1. Notification Settings */}
          <IonList inset={true} className="glass-list settings-list">
            <IonListHeader style={{ paddingBottom: '10px' }}>
              <IonIcon icon={chatbubbleOutline} style={{ marginRight: '8px', color: '#f39c12' }} />
              <IonLabel style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 'bold' }}>Notification Settings</IonLabel>
            </IonListHeader>
            <IonItem lines="none" style={{ flexDirection: 'column', alignItems: 'flex-start', paddingBottom: '16px', '--background': 'transparent' }}>
              <IonLabel style={{ marginBottom: '8px', fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>Alert Phone Number</IonLabel>
              <IonInput 
                className="custom-input"
                type="tel"
                placeholder="+639123456789"
                value={settings.adminPhone} 
                onIonChange={e => setSettings({...settings, adminPhone: e.detail.value!})}
              />
            </IonItem>
            <IonItem lines="none" style={{ flexDirection: 'column', alignItems: 'flex-start', paddingBottom: '16px', '--background': 'transparent' }}>
              <IonLabel style={{ marginBottom: '8px', fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>Voltage Threshold (Alert when below)</IonLabel>
              <IonInput 
                className="custom-input"
                type="number" 
                step="0.1"
                value={settings.voltageThreshold} 
                onIonChange={e => setSettings({...settings, voltageThreshold: e.detail.value!})}
              />
            </IonItem>
            <IonButton expand="block" color="primary" onClick={handleSaveNotification} style={{ margin: '0 16px 16px', '--border-radius': '8px' }}>
              Save Changes
            </IonButton>
          </IonList>

          {/* 2. Account Security (PIN) */}
          <IonList inset={true} className="glass-list settings-list">
            <IonListHeader style={{ paddingBottom: '10px' }}>
              <IonIcon icon={lockClosedOutline} style={{ marginRight: '8px', color: '#f39c12' }} />
              <IonLabel style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 'bold' }}>App Security</IonLabel>
            </IonListHeader>
            <IonItem lines="none" style={{ flexDirection: 'column', alignItems: 'flex-start', paddingBottom: '16px', '--background': 'transparent' }}>
              <IonLabel style={{ marginBottom: '8px', fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>New Security PIN</IonLabel>
              <IonInput 
                className="custom-input"
                type="password"
                inputMode="numeric"
                placeholder="4-digit PIN"
                value={pinForm} 
                onIonChange={e => setPinForm(e.detail.value!)}
                maxlength={4}
              />
            </IonItem>
            <IonButton expand="block" color="medium" onClick={handleUpdatePin} style={{ margin: '0 16px 16px', '--border-radius': '8px' }}>
              <IonIcon slot="start" icon={keyOutline} />
              Set PIN
            </IonButton>
          </IonList>

          {/* 3. Factory Reset */}
          <IonList inset={true} className="glass-list settings-list" style={{ border: '2px solid rgba(231, 76, 60, 0.5)', background: 'rgba(231, 76, 60, 0.05)' }}>
            <IonListHeader style={{ paddingBottom: '10px' }}>
              <IonIcon icon={warningOutline} style={{ marginRight: '8px', color: '#e74c3c' }} />
              <IonLabel style={{ color: '#e74c3c', fontSize: '1.2rem', fontWeight: 'bold' }}>Factory Reset</IonLabel>
            </IonListHeader>
            <IonItem lines="none" style={{ paddingTop: '8px', paddingBottom: '16px', '--background': 'transparent' }}>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', lineHeight: '1.4' }}>
                Warning: This will delete ALL settings, sensor data, and local logs. This action is IRREVERSIBLE.
              </p>
            </IonItem>
            <IonButton expand="block" color="danger" onClick={confirmFactoryReset} style={{ margin: '0 16px 16px', '--border-radius': '8px' }}>
              Reset System
            </IonButton>
          </IonList>

        </div>
      </IonContent>
    </IonPage>
  );
};

export default Settings;
