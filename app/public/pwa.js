if ('serviceWorker' in navigator) {
  window.addEventListener('load', async function setupPwa() {
    const workers = navigator.serviceWorker;
    const banner = document.getElementById('pwa-update');
    const reload = document.getElementById('pwa-reload');
    let controller = workers.controller;
    let applying = false;

    workers.addEventListener('controllerchange', () => {
      if (applying) window.location.reload();
      else if (controller && workers.controller) banner.hidden = false;
      controller = workers.controller;
    });

    try {
      const registration = await workers.register('/app/sw.js');
      const showWaitingUpdate = () => {
        if (workers.controller && registration.waiting) banner.hidden = false;
      };
      const watchInstall = () => {
        registration.installing?.addEventListener('statechange', showWaitingUpdate);
        showWaitingUpdate();
      };
      registration.addEventListener('updatefound', watchInstall);
      watchInstall();

      reload.addEventListener('click', () => {
        reload.disabled = true;
        applying = true;
        if (registration.waiting) registration.waiting.postMessage('YAFT_APPLY_UPDATE');
        else window.location.reload();
      });

      // A standalone PWA can stay open across releases without navigating.
      const checkForUpdate = () => registration.update().catch(() => {});
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') checkForUpdate();
      });
      window.addEventListener('online', checkForUpdate);
    } catch (error) {
      console.warn('YAFT offline setup failed', error);
    }
  });
}
