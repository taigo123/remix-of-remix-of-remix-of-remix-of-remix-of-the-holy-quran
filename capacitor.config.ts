import type { CapacitorConfig } from '@capacitor/cli';

const isDevelopment = process.env.NODE_ENV === 'development';

const config: CapacitorConfig = {
  appId: 'app.lovable.39454bea4ce44499a47f73fe520f6535',
  appName: 'القرآن الكريم',
  webDir: 'dist',
  // Development server config only enabled in development mode
  ...(isDevelopment && {
    server: {
      url: 'https://39454bea-4ce4-4499-a47f-73fe520f6535.lovableproject.com?forceHideBadge=true',
      cleartext: true
    }
  }),
  ios: {
    contentInset: 'automatic'
  },
  android: {
    backgroundColor: '#1a1f2e'
  }
};

export default config;
