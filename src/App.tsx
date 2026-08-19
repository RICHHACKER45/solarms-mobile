import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { home, time, cog, wifi } from 'ionicons/icons';

import Dashboard from './pages/Dashboard';
import History from './pages/History';
import Settings from './pages/Settings';
import Connection from './pages/Connection';
import AnimatedSplash from './components/AnimatedSplash';
import LockScreen from './components/LockScreen';
import { useState, useEffect } from 'react';
import { HardwareProvider } from './contexts/HardwareContext';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Filesystem } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [isLocked, setIsLocked] = useState(false);
  const [correctPin, setCorrectPin] = useState('');

  useEffect(() => {
    // Request permissions programmatically so the OS actually shows the popup!
    const requestPermissions = async () => {
      try {
        await LocalNotifications.requestPermissions();
        await Filesystem.requestPermissions();
      } catch (e) {
        console.warn('Could not request permissions', e);
      }
    };

    const checkSecurity = async () => {
      const pin = await Preferences.get({ key: 'app_pin' });
      if (pin.value && pin.value.length === 6) {
        setCorrectPin(pin.value);
        setIsLocked(true);
      }
    };

    requestPermissions();
    checkSecurity();
  }, []);

  if (showSplash) {
    return <AnimatedSplash onAnimationComplete={() => setShowSplash(false)} />;
  }

  if (isLocked) {
    return <LockScreen correctPin={correctPin} onUnlock={() => setIsLocked(false)} />;
  }

  return (
    <HardwareProvider>
      <IonApp>
        <IonReactRouter>
          <IonTabs>
        <IonRouterOutlet>
          <Route exact path="/dashboard">
            <Dashboard />
          </Route>
          <Route exact path="/history">
            <History />
          </Route>
          <Route exact path="/connection">
            <Connection />
          </Route>
          <Route path="/settings">
            <Settings />
          </Route>
          <Route exact path="/">
            <Redirect to="/dashboard" />
          </Route>
        </IonRouterOutlet>
        
        <IonTabBar slot="bottom" className="custom-tab-bar" style={{ '--background': 'rgba(255, 255, 255, 0.05)', 'backdropFilter': 'blur(15px)', 'borderTop': '1px solid rgba(255,255,255,0.1)' }}>
          <IonTabButton tab="dashboard" href="/dashboard">
            <IonIcon aria-hidden="true" icon={home} />
            <IonLabel>Dashboard</IonLabel>
          </IonTabButton>
          <IonTabButton tab="history" href="/history">
            <IonIcon aria-hidden="true" icon={time} />
            <IonLabel>Logs</IonLabel>
          </IonTabButton>
          <IonTabButton tab="connection" href="/connection">
            <IonIcon aria-hidden="true" icon={wifi} />
            <IonLabel>Connect</IonLabel>
          </IonTabButton>
          <IonTabButton tab="settings" href="/settings">
            <IonIcon aria-hidden="true" icon={cog} />
            <IonLabel>Settings</IonLabel>
          </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
    </HardwareProvider>
  );
};

export default App;
