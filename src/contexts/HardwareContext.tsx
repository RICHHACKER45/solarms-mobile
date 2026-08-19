import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Preferences } from '@capacitor/preferences';
import { LocalNotifications } from '@capacitor/local-notifications';
import { StorageService } from '../services/StorageService';

// The exact API schema the Arduino will send (or the simulator generates)
export interface HardwareData {
  hardware_id: string;
  status: 'online' | 'offline';
  metrics: {
    voltage_v: number;
    current_a: number;
    power_w: number;
    temperature_c: number;
  };
  timestamp: number;
}

interface HardwareContextType {
  data: HardwareData | null;
  ipAddress: string;
  setIpAddress: (ip: string) => void;
  isSimulatorEnabled: boolean;
  setSimulatorEnabled: (enabled: boolean) => void;
  triggerFakeSpike: () => void;
}

const HardwareContext = createContext<HardwareContextType | undefined>(undefined);

export const useHardware = () => {
  const context = useContext(HardwareContext);
  if (!context) {
    throw new Error('useHardware must be used within a HardwareProvider');
  }
  return context;
};

export const HardwareProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<HardwareData | null>(null);
  const [ipAddress, setIpAddressState] = useState<string>('');
  const [isSimulatorEnabled, setSimulatorEnabledState] = useState<boolean>(false);
  const [lastNotificationTime, setLastNotificationTime] = useState<number>(0);

  // Load saved preferences on startup
  useEffect(() => {
    const loadPreferences = async () => {
      const savedIp = await Preferences.get({ key: 'hardware_ip' });
      const savedSim = await Preferences.get({ key: 'simulator_enabled' });
      
      if (savedIp.value) setIpAddressState(savedIp.value);
      if (savedSim.value) setSimulatorEnabledState(savedSim.value === 'true');
    };
    loadPreferences();
  }, []);

  const setIpAddress = async (ip: string) => {
    setIpAddressState(ip);
    await Preferences.set({ key: 'hardware_ip', value: ip });
  };

  const setSimulatorEnabled = async (enabled: boolean) => {
    setSimulatorEnabledState(enabled);
    setData(null); // Clear old data so the dashboard resets!
    await Preferences.set({ key: 'simulator_enabled', value: enabled ? 'true' : 'false' });
  };

  const triggerFakeSpike = async () => {
    if (!isSimulatorEnabled || !data) return;
    
    // Simulate a massive voltage spike
    const newData: HardwareData = {
      ...data,
      metrics: {
        ...data.metrics,
        voltage_v: 15.5, // Dangerously high
        power_w: 15.5 * data.metrics.current_a
      },
      timestamp: Date.now()
    };
    
    setData(newData);
    StorageService.logData(newData);
    await processNotifications(newData, true); // true = force notification for fake spike
  };

  const processNotifications = async (hardwareData: HardwareData, force = false) => {
    // Check if out of bounds
    if (hardwareData.metrics.voltage_v > 14.5 || hardwareData.metrics.voltage_v < 11.5) {
      
      const now = Date.now();
      // 15-minute cooldown (900000ms) to prevent spamming notifications, unless forced by the manual test button
      if (!force && (now - lastNotificationTime < 15 * 60 * 1000)) {
        return; 
      }

      const localPushReq = await Preferences.get({ key: 'local_push_enabled' });
      if (localPushReq.value !== 'false') {
        
        // Request permissions just in case it wasn't done at boot
        const permStatus = await LocalNotifications.checkPermissions();
        if (permStatus.display !== 'granted') {
          await LocalNotifications.requestPermissions();
        }

        await LocalNotifications.schedule({
          notifications: [
            {
              title: '⚠️ CRITICAL: Voltage Alert',
              body: `SolarMS Voltage is at ${hardwareData.metrics.voltage_v}V!`,
              id: Math.floor(Math.random() * 2147483647), // Must be a 32-bit int
              schedule: { at: new Date(Date.now() + 1000) },
            }
          ]
        });

        setLastNotificationTime(now);
      }
    }
  };

  // The main engine loop
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isSimulatorEnabled) {
      // ----------------------------------------------------
      // DEVELOPER SIMULATOR MODE
      // Generates fluctuating data every 2 seconds
      // ----------------------------------------------------
      interval = setInterval(() => {
        const baseVoltage = 13.0;
        const baseCurrent = 4.0;
        const temp = 35.0;
        
        // Random fluctuation between -0.5 and +0.5
        const vFluc = (Math.random() - 0.5);
        const cFluc = (Math.random() - 0.5);
        
        const v = parseFloat((baseVoltage + vFluc).toFixed(2));
        const c = parseFloat((baseCurrent + cFluc).toFixed(2));
        
        const newData: HardwareData = {
          hardware_id: 'SIMULATOR_001',
          status: 'online',
          metrics: {
            voltage_v: v,
            current_a: c,
            power_w: parseFloat((v * c).toFixed(2)),
            temperature_c: parseFloat((temp + (Math.random()*2)).toFixed(1))
          },
          timestamp: Date.now()
        };
        setData(newData);
        StorageService.logData(newData);
        processNotifications(newData);
      }, 5000); // 5 seconds for simulator log
      
    } else if (ipAddress) {
      // ----------------------------------------------------
      // REAL HARDWARE MODE
      // Fetches JSON from the Arduino IP address every 5s
      // ----------------------------------------------------
      interval = setInterval(async () => {
        try {
          const response = await fetch(`http://${ipAddress}/data`);
          if (response.ok) {
            const hardwareData: HardwareData = await response.json();
            setData(hardwareData);
            StorageService.logData(hardwareData);
            processNotifications(hardwareData);
          }
        } catch (error) {
          // Hardware is unreachable or disconnected
          setData(prev => prev ? { ...prev, status: 'offline' } : null);
        }
      }, 5000);
    }

    return () => clearInterval(interval);
  }, [ipAddress, isSimulatorEnabled]);

  return (
    <HardwareContext.Provider 
      value={{ 
        data, 
        ipAddress, 
        setIpAddress, 
        isSimulatorEnabled, 
        setSimulatorEnabled, 
        triggerFakeSpike 
      }}
    >
      {children}
    </HardwareContext.Provider>
  );
};
