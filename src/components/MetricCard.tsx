import React from 'react';
import { IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonIcon } from '@ionic/react';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit: string;
  icon: string;
  colorClass: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, unit, icon, colorClass }) => {
  return (
    <IonCard className={`glass-card metric-card ${colorClass}`}>
      <IonCardHeader style={{ paddingTop: '15px' }}>
        <div className="metric-icon-container">
          <IonIcon icon={icon} />
        </div>
        <IonCardTitle>
          {value} <span style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.7)' }}>{unit}</span>
        </IonCardTitle>
        <IonCardSubtitle>{title}</IonCardSubtitle>
      </IonCardHeader>
    </IonCard>
  );
};

export default MetricCard;
