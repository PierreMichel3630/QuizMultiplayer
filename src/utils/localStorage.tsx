const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const removeHistoryLocalStorage = () => {
  Object.keys(localStorage).forEach((key) => {
    const isGameKey =
      key.startsWith("game-training-") || key.startsWith("game-solo-");

    const isUUID = uuidRegex.test(key);

    if (isGameKey || isUUID) {
      localStorage.removeItem(key);
    }
  });
};
