const FAVORITES_KEY = 'favourite_events';
const LEGACY_FAVORITES_KEY = 'eventhub-favorites';

const normalizeFavoriteIds = (value) => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item) => {
    if (typeof item === 'string' || typeof item === 'number') {
      return item === '' ? [] : [String(item)];
    }

    if (item && typeof item === 'object') {
      const id = item.uid ?? item.id ?? item._id;
      return id ? [String(id)] : [];
    }

    return [];
  });
};

export const readFavoriteIds = () => {
  if (typeof window === 'undefined') {
    return [];
  }

  const candidateKeys = [FAVORITES_KEY, LEGACY_FAVORITES_KEY];

  for (const key of candidateKeys) {
    const saved = localStorage.getItem(key);

    if (!saved) {
      continue;
    }

    try {
      const parsed = JSON.parse(saved);
      const ids = normalizeFavoriteIds(parsed);

      if (ids.length) {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));

        if (key !== FAVORITES_KEY) {
          localStorage.removeItem(key);
        }

        return ids;
      }

      if (key === FAVORITES_KEY) {
        return [];
      }
    } catch {
      if (key === FAVORITES_KEY) {
        return [];
      }
    }
  }

  return [];
};

export const isFavoriteEvent = (eventId) => {
  if (!eventId) {
    return false;
  }

  return readFavoriteIds().includes(String(eventId));
};

export const toggleFavoriteEvent = (eventId) => {
  if (!eventId) {
    return readFavoriteIds();
  }

  const normalizedId = String(eventId);
  const current = readFavoriteIds();
  const next = current.includes(normalizedId)
    ? current.filter((id) => id !== normalizedId)
    : [...current, normalizedId];

  if (typeof window !== 'undefined') {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
  }

  return next;
};
