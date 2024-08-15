navigator.serviceWorker.register('sw.js')
    .then(function(registration) {
        console.log('Service Worker registered with scope:', registration.scope);

        // Đăng ký nhận thông báo đẩy
        return registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array('BMOF3429mw7S0IhEs9xFa-PubK4tgOpgKsQ1leZ-2BGm25cEal3hcUh0HCsZBqI3eHMKVbr2aOOK_UeHr-mXOag')
        });
    })
    .then(function(subscription) {
        console.log('User is subscribed:', subscription);

        // Gửi subscription đến server
        return fetch('http://localhost:3000/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(subscription)
        });
    })
    .then(function(response) {
        if (response.ok) {
            console.log('Subscription details sent to server');
        } else {
            console.error('Failed to send subscription details to server');
        }
    })
    .catch(function(err) {
        console.error('Failed to subscribe the user:', err);
    });

// Hàm chuyển đổi VAPID key
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}
