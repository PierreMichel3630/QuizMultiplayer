import CryptoJS from "crypto-js";

const key = import.meta.env.VITE_CRYPT_SECRET;

export const encrypt = (text: string) => {
  return CryptoJS.AES.encrypt(text, key).toString();
};

export const decrypt = (encryptedBase64: string) => {
  const decrypted = CryptoJS.AES.decrypt(encryptedBase64, key);
  if (decrypted) {
    try {
      const str = decrypted.toString(CryptoJS.enc.Utf8);
      if (str.length > 0) {
        return str;
      } else {
        return undefined;
      }
    } catch (e) {
      return undefined;
    }
  }
  return undefined;
};

export const decryptToNumber = (encryptedBase64: string) => {
  return Number(decrypt(encryptedBase64));
};
