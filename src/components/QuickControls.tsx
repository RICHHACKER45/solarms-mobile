import React from 'react';
import { IonList, IonItem, IonIcon, IonLabel, IonToggle, IonListHeader } from '@ionic/react';
import { power, checkmarkCircle } from 'ionicons/icons';

interface QuickControlsProps {
  systemLoad: boolean;
  maintenanceMode: boolean;
  onSystemLoadChange: (checked: boolean) => void;
  onMaintenanceModeChange: (checked: boolean) => void;
}

const QuickControls: React.FC<QuickControlsProps> = ({ 
  systemLoad, 
  maintenanceMode, 
  onSystemLoadChange, 
  onMaintenanceModeChange 
}) => {
  return (
    <IonList inset={true} className="glass-list">
      <IonListHeader>
        <IonLabel style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 'bold' }}>Quick Controls</IonLabel>
      </IonListHeader>
      
      <IonItem>
        <IonIcon icon={power} slot="start" color="primary" />
        <IonLabel>
          <h2>System Load</h2>
          <p>Toggle main power relay</p>
        </IonLabel>
        <IonToggle 
          checked={systemLoad} 
          onIonChange={e => onSystemLoadChange(e.detail.checked)}
        />
      </IonItem>

      <IonItem lines="none">
        <IonIcon icon={checkmarkCircle} slot="start" color="warning" />
        <IonLabel>
          <h2>Maintenance Mode</h2>
          <p>Disable auto-alerts for service</p>
        </IonLabel>
        <IonToggle 
          checked={maintenanceMode} 
          onIonChange={e => onMaintenanceModeChange(e.detail.checked)}
        />
      </IonItem>
    </IonList>
  );
};

export default QuickControls;
