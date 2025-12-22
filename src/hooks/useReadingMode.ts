import { useState, useEffect, useCallback } from 'react';

export type FontType = 'naskh' | 'amiri' | 'arabic';

interface ReadingModeSettings {
  isEnabled: boolean;
  fontSize: number;
  fontType: FontType;
  brightness: number;
  hideSidebar: boolean;
}

const defaultSettings: ReadingModeSettings = {
  isEnabled: false,
  fontSize: 100,
  fontType: 'naskh',
  brightness: 100,
  hideSidebar: false,
};

const STORAGE_KEY = 'reading-mode-settings';

export const useReadingMode = () => {
  const [settings, setSettings] = useState<ReadingModeSettings>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    }
    return defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    // Apply brightness filter
    document.documentElement.style.filter = settings.isEnabled && settings.brightness < 100 
      ? `brightness(${settings.brightness}%)` 
      : '';
    
    // Apply font size
    document.documentElement.style.setProperty(
      '--reading-font-scale', 
      settings.isEnabled ? `${settings.fontSize / 100}` : '1'
    );

    return () => {
      document.documentElement.style.filter = '';
      document.documentElement.style.setProperty('--reading-font-scale', '1');
    };
  }, [settings.isEnabled, settings.brightness, settings.fontSize]);

  const toggleReadingMode = useCallback(() => {
    setSettings(prev => ({ ...prev, isEnabled: !prev.isEnabled }));
  }, []);

  const setFontSize = useCallback((size: number) => {
    setSettings(prev => ({ ...prev, fontSize: Math.min(150, Math.max(80, size)) }));
  }, []);

  const setFontType = useCallback((type: FontType) => {
    setSettings(prev => ({ ...prev, fontType: type }));
  }, []);

  const setBrightness = useCallback((value: number) => {
    setSettings(prev => ({ ...prev, brightness: Math.min(100, Math.max(50, value)) }));
  }, []);

  const toggleHideSidebar = useCallback(() => {
    setSettings(prev => ({ ...prev, hideSidebar: !prev.hideSidebar }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings({ ...defaultSettings, isEnabled: true });
  }, []);

  return {
    ...settings,
    toggleReadingMode,
    setFontSize,
    setFontType,
    setBrightness,
    toggleHideSidebar,
    resetSettings,
  };
};
