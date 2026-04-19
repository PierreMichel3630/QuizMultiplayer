type Size = {
  width: number;
  height: number;
};

export const scaleToMax = (size: Size, max = 80) => {
  const { width, height } = size;

  const scale = Math.min(max / width, max / height);

  return {
    width: Math.round(width * scale),
    height: Math.round(height * scale),
    scale: scale
  };
}