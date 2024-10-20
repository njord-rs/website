export function createLocalStorageCache() {
  const get = (key) => {
    const item = localStorage.getItem(key);

    if (!item) return null;

    const parsedItem = JSON.parse(item);

    if (parsedItem.expiry && Date.now() > parsedItem.expiry) {
      localStorage.removeItem(key);

      return null;
    }

    return parsedItem.value;
  };

  const set = (key, value, ttl) => {
    const item = {
      value: value,
      expiry: ttl ? Date.now() + ttl : null,
    };

    localStorage.setItem(key, JSON.stringify(item));
  };

  const has = (key) => get(key) !== null;

  return {
    get,
    set,
    has,
  };
}
