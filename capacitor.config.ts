import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.solarms.mobile',
  appName: 'solarms-mobile',
  webDir: 'dist',
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
      launchAutoHide: false,
      backgroundColor: "#0f0f1a",
      splashFullScreen: true,
      splashImmersive: true,
    },
  },
};

export default config;
