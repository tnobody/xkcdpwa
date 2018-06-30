export const capabilities = {
    sw: 'serviceWorker' in navigator,
    idb: 'indexedDB' in window || 'mozIndexedDB' in window || 'webkitIndexedDB' in window || 'msIndexedDB' in window,
    sync: 'serviceWorker' in navigator && 'SyncManager' in window
};
