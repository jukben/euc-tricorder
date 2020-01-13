// Type definitions for react-native-tts
// author: @jukben
// Project: https://www.npmjs.com/package/react-native-tts

declare module 'react-native-tts' {
  type Tts = {
    speak: (text: string) => void;
    stop: () => void;
    getInitStatus: () => Promise<void>;
    setDucking: (on: boolean) => void;
    voices: () => Promise<{
      id: string;
      name: string;
      language: string;
      quality: number;
      latency: number;
      networkConnectionRequired: boolean;
      notInstalled: boolean;
    }>;
    setDefaultLanguage: (lang: string) => void;
    setDefaultRate: (speed: number) => void;
    setIgnoreSilentSwitch: (rule: 'ignore' | 'obey') => void;
    addEventListener: (
      event: 'tts-start' | 'tts-finish' | 'tts-cancel',
      listener: (event: Event) => void,
    ) => void;
  };

  var api: Tts;

  export default api;
}
