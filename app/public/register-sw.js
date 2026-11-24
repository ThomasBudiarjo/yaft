if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/app/sw.js').catch((error) => console.warn('YAFT offline setup failed', error));
  });
}
