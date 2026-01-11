export const isVersionGreaterOrEqual = (v1: string, v2: string) => {
  return compareVersion(v1, v2) >= 0;
};

export const isVersionGreater = (v1: string, v2: string): boolean => {
  return compareVersion(v1, v2) > 0;
};

const compareVersion = (v1: string, v2: string) => {
  const parts1 = v1.split(".").map(Number);
  const parts2 = v2.split(".").map(Number);

  const maxLength = Math.max(parts1.length, parts2.length);

  for (let i = 0; i < maxLength; i++) {
    const num1 = parts1[i] ?? 0;
    const num2 = parts2[i] ?? 0;

    if (num1 > num2) return 1;
    if (num1 < num2) return -1;
  }

  return 0;
};
