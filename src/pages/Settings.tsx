import React, { useState } from 'react';
import { 
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonIcon, 
  IonList, IonItem, IonLabel, IonInput, IonSelect, IonSelectOption, 
  IonButton, IonListHeader, useIonToast, useIonAlert, IonToggle
} from '@ionic/react';
import { cog, chatbubbleOutline, lockClosedOutline, personAddOutline, warningOutline, wifiOutline, constructOutline, alertCircleOutline } from 'ionicons/icons';
import { useHardware } from '../contexts/HardwareContext';
import './Home.css';

const Settings: React.FC = () => {
  const [presentToast] = useIonToast();
  const [presentAlert] = useIonAlert();
  const { ipAddress, setIpAddress, isSimulatorEnabled, setSimulatorEnabled, triggerFakeSpike } = useHardware();
  
  // States based on db.php settings
  const [settings, setSettings] = useState({
    adminPhone: '+639123456789',
    voltageThreshold: '11.0',
    smsMode: 'log'
  });

  const [passwordForm, setPasswordForm] = useState('');
  
  const [newUser, setNewUser] = useState({
    username: '',
    password: ''
  });

  const handleSaveNotification = () => {
    presentToast({ message: 'Notification settings updated!', duration: 2000, color: 'success' });
  };

  const handleUpdatePassword = () => {
    presentToast({ message: 'Security update: Password changed!', duration: 2000, color: 'medium' });
    setPasswordForm('');
  };

  const handleAddUser = () => {
    presentToast({ message: `Technician ${newUser.username} added successfully!`, duration: 2000, color: 'success' });
    setNewUser({ username: '', password: '' });
  };

  const confirmFactoryReset = () => {
    presentAlert({
      header: 'Critical Action!',
      message: 'Are you absolutely sure? This will WIPE the entire system including all users, settings, sensor data, and logs. This action is IRREVERSIBLE.',
      buttons: [
        { text: 'Cancel', role: 'cancel', cssClass: 'secondary' },
        { 
          text: 'Reset System', 
          role: 'destructive',
          handler: () => {
            presentToast({ message: 'System has been wiped. Logging out...', duration: 3000, color: 'danger' });
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
          
          {/* Connection Manager */}
          <IonList inset={true} className="glass-list settings-list">
            <IonListHeader style={{ paddingBottom: '10px' }}>
              <IonIcon icon={wifiOutline} style={{ marginRight: '8px', color: '#f39c12' }} />
              <IonLabel style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 'bold' }}>Hardware Connection</IonLabel>
            </IonListHeader>
            <IonItem lines="none" style={{ flexDirection: 'column', alignItems: 'flex-start', paddingBottom: '16px' }}>
              <IonLabel style={{ marginBottom: '8px', fontSize: '0.9rem', opacity: 0.8 }}>Hardware IP Address</IonLabel>
              <IonInput 
                className="custom-input"
                type="text"
                placeholder="192.168.4.1"
                value={ipAddress} 
                onIonChange={e => setIpAddress(e.detail.value!)}
              />
            </IonItem>
          </IonList>

          {/* Developer Options */}
          <IonList inset={true} className="glass-list settings-list" style={{ border: '1px solid rgba(56, 189, 248, 0.3)' }}>
            <IonListHeader style={{ paddingBottom: '10px' }}>
              <IonIcon icon={constructOutline} style={{ marginRight: '8px', color: '#38bdf8' }} />
              <IonLabel style={{ color: '#38bdf8', fontSize: '1.2rem', fontWeight: 'bold' }}>Developer Options</IonLabel>
            </IonListHeader>
            <IonItem lines="none" style={{ paddingBottom: '8px' }}>
              <IonLabel style={{ fontSize: '0.95rem' }}>Mock Data Simulator</IonLabel>
              <IonToggle 
                checked={isSimulatorEnabled} 
                onIonChange={e => setSimulatorEnabled(e.detail.checked)}
                color="secondary"
              />
            </IonItem>
            {isSimulatorEnabled && (
              <IonItem lines="none" style={{ paddingTop: '8px', paddingBottom: '16px' }}>
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
            <IonItem lines="none" style={{ flexDirection: 'column', alignItems: 'flex-start', paddingBottom: '16px' }}>
              <IonLabel style={{ marginBottom: '8px', fontSize: '0.9rem', opacity: 0.8 }}>Admin Phone Number</IonLabel>
              <IonInput 
                className="custom-input"
                type="tel"
                placeholder="+639123456789"
                value={settings.adminPhone} 
                onIonChange={e => setSettings({...settings, adminPhone: e.detail.value!})}
              />
            </IonItem>
            <IonItem lines="none" style={{ flexDirection: 'column', alignItems: 'flex-start', paddingBottom: '16px' }}>
              <IonLabel style={{ marginBottom: '8px', fontSize: '0.9rem', opacity: 0.8 }}>Voltage Threshold (Alert when below)</IonLabel>
              <IonInput 
                className="custom-input"
                type="number" 
                step="0.1"
                value={settings.voltageThreshold} 
                onIonChange={e => setSettings({...settings, voltageThreshold: e.detail.value!})}
              />
            </IonItem>
            <IonItem lines="none" style={{ flexDirection: 'column', alignItems: 'flex-start', paddingBottom: '16px' }}>
              <IonLabel style={{ marginBottom: '8px', fontSize: '0.9rem', opacity: 0.8 }}>SMS Sending Mode</IonLabel>
              <IonSelect 
                className="custom-input"
                value={settings.smsMode} 
                onIonChange={e => setSettings({...settings, smsMode: e.detail.value})}
                interface="popover"
              >
                <IonSelectOption value="log">Log Mode (Simulated)</IonSelectOption>
                <IonSelectOption value="api">API Mode (Real SMS)</IonSelectOption>
              </IonSelect>
            </IonItem>
            <IonButton expand="block" className="settings-button" color="primary" onClick={handleSaveNotification}>
              Save Changes
            </IonButton>
          </IonList>

          {/* 2. Account Security */}
          <IonList inset={true} className="glass-list settings-list">
            <IonListHeader style={{ paddingBottom: '10px' }}>
              <IonIcon icon={lockClosedOutline} style={{ marginRight: '8px', color: '#f39c12' }} />
              <IonLabel style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 'bold' }}>Account Security</IonLabel>
            </IonListHeader>
            <IonItem lines="none" style={{ paddingTop: '8px', paddingBottom: '16px' }}>
              <IonLabel>Current Username: <strong style={{ color: '#fff' }}>admin</strong></IonLabel>
            </IonItem>
            <IonItem lines="none" style={{ flexDirection: 'column', alignItems: 'flex-start', paddingBottom: '16px' }}>
              <IonLabel style={{ marginBottom: '8px', fontSize: '0.9rem', opacity: 0.8 }}>New Password</IonLabel>
              <IonInput 
                className="custom-input"
                type="password"
                placeholder="Minimum 8 characters"
                value={passwordForm} 
                onIonChange={e => setPasswordForm(e.detail.value!)}
              />
            </IonItem>
            <IonButton expand="block" className="settings-button" color="medium" onClick={handleUpdatePassword}>
              Update Password
            </IonButton>
          </IonList>

          {/* 3. Add New User (Technician) */}
          <IonList inset={true} className="glass-list settings-list">
            <IonListHeader style={{ paddingBottom: '10px' }}>
              <IonIcon icon={personAddOutline} style={{ marginRight: '8px', color: '#f39c12' }} />
              <IonLabel style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 'bold' }}>Add New User (Technician)</IonLabel>
            </IonListHeader>
            <IonItem lines="none" style={{ flexDirection: 'column', alignItems: 'flex-start', paddingBottom: '16px' }}>
              <IonLabel style={{ marginBottom: '8px', fontSize: '0.9rem', opacity: 0.8 }}>Username</IonLabel>
              <IonInput 
                className="custom-input"
                type="text"
                placeholder="Technician Name"
                value={newUser.username} 
                onIonChange={e => setNewUser({...newUser, username: e.detail.value!})}
              />
            </IonItem>
            <IonItem lines="none" style={{ flexDirection: 'column', alignItems: 'flex-start', paddingBottom: '16px' }}>
              <IonLabel style={{ marginBottom: '8px', fontSize: '0.9rem', opacity: 0.8 }}>Password</IonLabel>
              <IonInput 
                className="custom-input"
                type="password"
                placeholder="Create Password"
                value={newUser.password} 
                onIonChange={e => setNewUser({...newUser, password: e.detail.value!})}
              />
            </IonItem>
            <IonButton expand="block" className="settings-button" color="success" onClick={handleAddUser}>
              Create User Account
            </IonButton>
          </IonList>

          {/* 4. Factory Reset */}
          <IonList inset={true} className="glass-list settings-list" style={{ border: '2px solid rgba(231, 76, 60, 0.5)', background: 'rgba(231, 76, 60, 0.05)' }}>
            <IonListHeader style={{ paddingBottom: '10px' }}>
              <IonIcon icon={warningOutline} style={{ marginRight: '8px', color: '#e74c3c' }} />
              <IonLabel style={{ color: '#e74c3c', fontSize: '1.2rem', fontWeight: 'bold' }}>Factory Reset</IonLabel>
            </IonListHeader>
            <IonItem lines="none" style={{ paddingTop: '8px', paddingBottom: '16px' }}>
              <p style={{ color: '#ccc', fontSize: '0.85rem', lineHeight: '1.4' }}>
                Warning: This will delete ALL users, settings, sensor data, and logs. This action is IRREVERSIBLE.
              </p>
            </IonItem>
            <IonButton expand="block" className="settings-button" color="danger" onClick={confirmFactoryReset}>
              Reset System
            </IonButton>
          </IonList>

        </div>
      </IonContent>
    </IonPage>
  );
};

export default Settings;
