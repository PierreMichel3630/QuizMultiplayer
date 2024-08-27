import { QuestionImage } from "src/pages/admin/AdminImagesPage";

interface ResultImage {
  question: QuestionImage;
  result: boolean;
}

export const testImages = (questions: Array<QuestionImage>) => {
  return new Promise((resolve) => {
    const promises = questions.map((el) => testImage(el));
    Promise.all(promises).then((res) => {
      const list = res as Array<ResultImage>;
      const result = list.reduce(
        (acc, value) => (!value.result ? [...acc, value] : acc),
        [] as Array<ResultImage>
      );
      resolve(result);
    });
  });
};

const testImage = (question: QuestionImage) => {
  return new Promise(function imgPromise(resolve, reject) {
    const imgElement = new Image();
    imgElement.addEventListener("load", function imgOnLoad() {
      resolve({
        question,
        result: true,
      });
    });
    imgElement.addEventListener("error", function imgOnError() {
      resolve({
        question,
        result: false,
      });
    });
    imgElement.src = question.image;
  });
};
