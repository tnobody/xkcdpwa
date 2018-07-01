import {capabilities} from './capabilities';

export default function registerServiceWorker() {
    console.log('Trying to register service worker.');
    if (capabilities.sw) {
        navigator.serviceWorker
            .register(process.env.PUBLIC_URL + '/sw.js')
            .then(registration => console.log("Successfully registered service worker:", registration))
            .catch(err => console.log("Failed to register service worker:", err));
    } else {
        console.log('Service workers not supported, skipping registration.');
    }
}
