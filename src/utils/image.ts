export const testImages = (urls: Array<string>) => {
  return new Promise((resolve) => {
    const promises = urls.map((el) => testImage(el));
    Promise.all(promises).then((res) => {
      const list = res as Array<ResultImage>;
      const result = list.reduce(
        (acc, value) => (!value.result ? [...acc, value.url] : acc),
        [] as Array<ResultImage>
      );
      resolve(result);
    });
  });
};

interface ResultImage {
  url: string;
  result: boolean;
}
const testImage = (url: string) => {
  return new Promise(function imgPromise(resolve, reject) {
    const imgElement = new Image();
    imgElement.addEventListener("load", function imgOnLoad() {
      resolve({
        url,
        result: true,
      });
    });
    imgElement.addEventListener("error", function imgOnError() {
      resolve({
        url,
        result: false,
      });
    });
    imgElement.src = url;
  });
};
