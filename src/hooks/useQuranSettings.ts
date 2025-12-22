import { useState, useEffect, useCallback } from 'react';

export type FontSize = 'small' | 'medium' | 'large' | 'xlarge';
export type CardStyle = 'grid' | 'list' | 'compact';
export type LineSpacing = 'tight' | 'normal' | 'relaxed' | 'loose';
export type Brightness = 'dim' | 'normal' | 'bright';

export interface QuranSettings {
  fontSize: FontSize;
  cardStyle: CardStyle;
  lineSpacing: LineSpacing;
  brightness: Brightness;
  showAudioIcon: boolean;
  showVerseCount: boolean;
  enableAnimations: boolean;
}

const defaultSettings: QuranSettings = {
  fontSize: 'medium',
  cardStyle: 'grid',
  lineSpacing: 'normal',
  brightness: 'normal',
  showAudioIcon: true,
  showVerseCount: true,
  enableAnimations: true,
};

const STORAGE_KEY = 'quran-display-settings';

export const useQuranSettings = () => {
  const [settings, setSettings] = useState<QuranSettings>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load settings from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setSettings({ ...defaultSettings, ...parsed });
      }
    } catch (e) {
      console.error('Failed to load Quran settings:', e);
    }
    setIsLoaded(true);
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      } catch (e) {
        console.error('Failed to save Quran settings:', e);
      }
    }
  }, [settings, isLoaded]);

  const updateSetting = useCallback(<K extends keyof QuranSettings>(
    key: K,
    value: QuranSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);
  }, []);

  // Generate CSS classes based on settings
  const getFontSizeClass = useCallback(() => {
    const classes = {
      small: 'quran-font-small',
      medium: 'quran-font-medium',
      large: 'quran-font-large',
      xlarge: 'quran-font-xlarge',
    };
    return classes[settings.fontSize];
  }, [settings.fontSize]);

  const getLineSpacingClass = useCallback(() => {
    const classes = {
      tight: 'quran-spacing-tight',
      normal: 'quran-spacing-normal',
      relaxed: 'quran-spacing-relaxed',
      loose: 'quran-spacing-loose',
    };
    return classes[settings.lineSpacing];
  }, [settings.lineSpacing]);

  const getBrightnessClass = useCallback(() => {
    const classes = {
      dim: 'quran-brightness-dim',
      normal: 'quran-brightness-normal',
      bright: 'quran-brightness-bright',
    };
    return classes[settings.brightness];
  }, [settings.brightness]);

  return {
    settings,
    updateSetting,
    resetSettings,
    isLoaded,
    getFontSizeClass,
    getLineSpacingClass,
    getBrightnessClass,
  };
};
