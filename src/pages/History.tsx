import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonIcon } from '@ionic/react';
import { time } from 'ionicons/icons';

const History: React.FC = () => {
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
        <p style={{ color: 'rgba(255,255,255,0.7)', textAlign: 'center', marginTop: '50px' }}>
          Historical data and system logs will appear here.
        </p>
      </IonContent>
    </IonPage>
  );
};

export default History;
