if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
        .then(function(registration) {
            console.log('Service Worker registered with scope:', registration.scope);
        }).catch(function(err) {
            console.error('Service Worker registration failed:', err);
        });
}

// Public VAPID key (phải khớp với server)
const publicVapidKey = 'BAZTAB3Qp6oFej3S-rOK2U_jh0On5kUmoBj8x4t7zoLLNKCTox-Q3plHcVlmH0zZtoRTF9eyZh-__vRQBpDXVMY';

// Chuyển đổi VAPID key thành Uint8Array
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

// Xử lý sự kiện nhấn nút "Enable Push Notification"
document.getElementById('notify-btn').addEventListener('click', () => {
    navigator.serviceWorker.ready.then(function(registration) {
        return registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
        });
    }).then(function(subscription) {
        console.log('User is subscribed:', subscription);
        // Gửi subscription về server
        fetch('/subscribe', {
            method: 'POST',
            body: JSON.stringify(subscription),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (response.ok) {
                console.log('Subscription sent to server');
            } else {
                console.error('Failed to send subscription to server');
            }
        });
    }).catch(function(error) {
        console.error('Failed to subscribe the user: ', error);
    });
});
