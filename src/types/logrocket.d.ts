export {};

declare global {
  interface Window {
    LogRocket?: {
      init: (appId: string, options?: any) => void;
      captureException: (error: any, options?: any) => void;
      identify: (uid: string, traits?: any) => void;
      track: (eventName: string, properties?: any) => void;
    };
  }
}
