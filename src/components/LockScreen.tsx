import React, { useState } from 'react';
import { IonPage, IonContent, IonIcon, IonButton, useIonAlert } from '@ionic/react';
import { lockClosed, backspaceOutline, alertCircleOutline } from 'ionicons/icons';
import { StorageService } from '../services/StorageService';
import { Preferences } from '@capacitor/preferences';

interface LockScreenProps {
  correctPin: string;
  onUnlock: () => void;
}

const LockScreen: React.FC<LockScreenProps> = ({ correctPin, onUnlock }) => {
  const [pinEntry, setPinEntry] = useState<string>('');
  const [isError, setIsError] = useState(false);
  const [presentAlert] = useIonAlert();

  const handleKeyPress = (num: string) => {
    if (pinEntry.length < 6) {
      const newPin = pinEntry + num;
      setPinEntry(newPin);

      if (newPin.length === 6) {
        verifyPin(newPin);
      }
    }
  };

  const handleDelete = () => {
    setPinEntry(pinEntry.slice(0, -1));
  };

  const verifyPin = (enteredPin: string) => {
    if (enteredPin === correctPin) {
      onUnlock();
    } else {
      setIsError(true);
      setTimeout(() => {
        setPinEntry('');
        setIsError(false);
      }, 500); // Shakes and resets after 500ms
    }
  };

  const handleForgotPin = () => {
    presentAlert({
      header: 'Forgot PIN?',
      message: 'If you forgot your PIN, you can factory reset the app. This will WIPE all your saved settings and local logs.',
      buttons: [
        { text: 'Cancel', role: 'cancel', cssClass: 'secondary' },
        { 
          text: 'Factory Reset', 
          role: 'destructive',
          handler: async () => {
            // Completely wipe app data and unlock
            await Preferences.clear();
            await StorageService.clearLogs();
            onUnlock(); // Unlock since the PIN is now erased
          }
        }
      ]
    });
  };

  return (
    <IonPage>
      <IonContent fullscreen style={{ '--background': '#0f172a' }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          padding: '20px',
          background: 'radial-gradient(circle at 50% -20%, #1e293b, #0f172a)'
        }}>
          
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'rgba(243, 156, 18, 0.1)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '30px',
            border: '2px solid rgba(243, 156, 18, 0.5)',
            boxShadow: '0 0 30px rgba(243, 156, 18, 0.2)'
          }}>
            <IonIcon icon={lockClosed} style={{ fontSize: '3rem', color: '#f39c12' }} />
          </div>

          <h2 style={{ color: '#fff', fontWeight: 'bold', marginBottom: '8px' }}>App Locked</h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '40px' }}>Enter your 6-digit Security PIN</p>

          {/* Dots Indicator */}
          <div 
            style={{ 
              display: 'flex', 
              gap: '12px', 
              marginBottom: '50px',
              animation: isError ? 'shake 0.4s ease-in-out' : 'none'
            }}
          >
            {[...Array(6)].map((_, i) => (
              <div 
                key={i}
                style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  border: '2px solid rgba(255,255,255,0.3)',
                  background: i < pinEntry.length ? '#f39c12' : 'transparent',
                  transition: 'background 0.2s ease',
                  borderColor: isError ? '#e74c3c' : (i < pinEntry.length ? '#f39c12' : 'rgba(255,255,255,0.3)')
                }}
              />
            ))}
          </div>

          {/* Custom Keypad */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', maxWidth: '300px', width: '100%' }}>
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
              <IonButton 
                key={num}
                fill="clear" 
                onClick={() => handleKeyPress(num)}
                style={{ 
                  height: '70px', 
                  fontSize: '1.8rem', 
                  color: '#fff', 
                  fontWeight: 'bold',
                  '--background-hover': 'rgba(255,255,255,0.1)',
                  '--border-radius': '50%'
                }}
              >
                {num}
              </IonButton>
            ))}
            
            <IonButton fill="clear" disabled style={{ height: '70px' }}></IonButton>
            
            <IonButton 
              fill="clear" 
              onClick={() => handleKeyPress('0')}
              style={{ height: '70px', fontSize: '1.8rem', color: '#fff', fontWeight: 'bold', '--border-radius': '50%' }}
            >
              0
            </IonButton>

            <IonButton 
              fill="clear" 
              onClick={handleDelete}
              style={{ height: '70px', color: 'rgba(255,255,255,0.6)', '--border-radius': '50%' }}
            >
              <IonIcon icon={backspaceOutline} style={{ fontSize: '1.8rem' }} />
            </IonButton>
          </div>

          <IonButton fill="clear" color="medium" onClick={handleForgotPin} style={{ marginTop: '40px', fontSize: '0.9rem' }}>
            <IonIcon icon={alertCircleOutline} slot="start" />
            Forgot PIN?
          </IonButton>

          <style>
            {`
              @keyframes shake {
                0%, 100% { transform: translateX(0); }
                20% { transform: translateX(-10px); }
                40% { transform: translateX(10px); }
                60% { transform: translateX(-10px); }
                80% { transform: translateX(10px); }
              }
            `}
          </style>

        </div>
      </IonContent>
    </IonPage>
  );
};

export default LockScreen;
