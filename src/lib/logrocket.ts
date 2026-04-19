import LogRocket from 'logrocket';

export const initLogRocket = () => {
  if (typeof window === 'undefined') return;
  
  // Initialize LogRocket with the provided app ID
  LogRocket.init('d8haum/typemaster-pro');
  
  // Register global listeners for exception capturing
  window.addEventListener('error', (e) => {
    LogRocket.captureException(e.error);
  });
  
  window.addEventListener('unhandledrejection', (e) => {
    LogRocket.captureException(e.reason);
  });
};
