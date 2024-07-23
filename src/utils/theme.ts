export const hasBorderImage = (id: number) => {
  const themes = [10, 27, 29, 28, 26, 30];
  return themes.includes(id);
};
