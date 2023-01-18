import {type Writable, writable} from 'svelte/store'

const isBrowser = typeof window !== 'undefined';
export const persistentStore = (key: string, initialValue: string): Writable<string> => {
    const store = writable(initialValue, () => {
        if (isBrowser) {
            const value = localStorage.getItem(key);
            if (value) {
                store.set(JSON.parse(value));
            }
        }
    });

    store.subscribe(value => {
        if (isBrowser) {
            localStorage.setItem(key, JSON.stringify(value));
        }
    });

    return store;
}

export const hypixelApiKey = persistentStore('hypixelApiKey', null);
export const iTemApiKey = persistentStore('iTemApiKey', null);
export const showSettings = writable(false);
export const showDupePopup = writable(false);