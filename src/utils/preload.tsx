//import { preload } from "react-dom";

import { Helmet } from "react-helmet-async";

/*export const preloadImage = (url: string) => {
  preload(url, { as: "image" });
};*/

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
