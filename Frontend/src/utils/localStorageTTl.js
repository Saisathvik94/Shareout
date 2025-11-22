export function setWithTTL(key, value, ttlSeconds) {
    const now = Date.now();
    const item = {
        value: value,
        expiry: now + ttlSeconds * 1000
    };
    localStorage.setItem(key, JSON.stringify(item));
}

export function getWithTTL(key) {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return null;

    const item = JSON.parse(itemStr);
    const now = Date.now();

    if (now > item.expiry) {
        localStorage.removeItem(key);
        return null;
    }
    return item.value;
}
