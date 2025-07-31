
//install btn pwa 

let deferredPrompt;
const installBtn = document.getElementById('installButton');

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.style.display = 'block';
});

installBtn.addEventListener('click', () => {
  installBtn.style.display = 'none';
  deferredPrompt.prompt();
  deferredPrompt.userChoice.then((choiceResult) => {
    if (choiceResult.outcome === 'accepted') {
      console.log('✅ App installed');
    } else {
      console.log('❌ Install dismissed');
    }
    deferredPrompt = null;
  });
});




if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((reg) => {
        console.log('✅ Service Worker registered:', reg.scope);
      })
      .catch((err) => {
        console.log('❌ Service Worker registration failed:', err);
      });
  });
}

