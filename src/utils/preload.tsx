import { Helmet } from "react-helmet-async";

interface Props {
  urls: Array<string>;
}

export const PreloadImages = ({ urls }: Props) => (
  <Helmet>
    {urls.map((url, i) => (
      <link key={i} rel="preload" as="image" href={url} />
    ))}
  </Helmet>
);

export const preloadAllImages = (srcList: string[]): Promise<void> => {
  return new Promise((resolve) => {
    let loaded = 0;

    const checkDone = () => {
      loaded++;
      if (loaded === srcList.length) {
        resolve();
      }
    };

    srcList.forEach((src) => {
      const img = new Image();
      img.onload = checkDone;
      img.onerror = checkDone; // même si erreur, on considère comme "chargée"
      img.src = src;
    });

    // si la liste est vide
    if (srcList.length === 0) {
      resolve();
    }
  });
};
