import { QuestionDuel } from "src/models/Question";
import { randomFromArray, randomIntFromInterval } from "./random";
import { decrypt } from "./crypt";

export interface Bot {
  uuid: string;
  percent: number;
  delaiMin: number;
  delaiMax: number;
}
const BOTS: Array<Bot> = [
  {
    uuid: "571b2a1c-e2ca-4e95-9d99-80a17b5796a4",
    percent: 1,
    delaiMin: 2,
    delaiMax: 3,
  },
  {
    uuid: "204f3ba7-231d-43d1-bef8-a533edf0472c",
    percent: 0.9,
    delaiMin: 2,
    delaiMax: 5,
  },
  {
    uuid: "68571fa7-1620-47d6-81d1-00e5b5a7ff60",
    percent: 0.85,
    delaiMin: 2,
    delaiMax: 6,
  },
  {
    uuid: "006c5385-8e71-41f7-801f-b6ee56f9996c",
    percent: 0.8,
    delaiMin: 2,
    delaiMax: 6,
  },
  {
    uuid: "34fc3125-b246-4cd5-807c-e01b3500d0fc",
    percent: 0.7,
    delaiMin: 3,
    delaiMax: 5,
  },
  {
    uuid: "464bdedb-d850-49b9-bace-54787165306c",
    percent: 0.6,
    delaiMin: 3,
    delaiMax: 6,
  },
  {
    uuid: "90cb6f61-c008-4989-974c-c2943758c323",
    percent: 0.5,
    delaiMin: 3,
    delaiMax: 7,
  },
  {
    uuid: "931b2102-9550-4c8e-a629-fcd858293b18",
    percent: 0.5,
    delaiMin: 4,
    delaiMax: 6,
  },
  {
    uuid: "8ee8c149-ab03-49ef-9605-c53471b6c139",
    percent: 0.5,
    delaiMin: 5,
    delaiMax: 6,
  },
  {
    uuid: "3e449f41-ae9d-4bb3-89da-d85708bb4957",
    percent: 0.5,
    delaiMin: 6,
    delaiMax: 8,
  },
  {
    uuid: "cc373b55-e48d-4099-9e69-31dfdadcb2e0",
    percent: 0.4,
    delaiMin: 4,
    delaiMax: 8,
  },
  {
    uuid: "4da66ce4-e3ef-4201-b26d-07e71407cd6d",
    percent: 0.3,
    delaiMin: 4,
    delaiMax: 7,
  },
  {
    uuid: "eed610db-4b85-4e0e-aa11-7497d5159393",
    percent: 0.2,
    delaiMin: 4,
    delaiMax: 7,
  },
  {
    uuid: "e6391030-89c4-4966-84be-a05f859860eb",
    percent: 0.1,
    delaiMin: 6,
    delaiMax: 8,
  },
  {
    uuid: "9e5543c3-ec9d-4a9c-8f0c-6e634759eb45",
    percent: 0.05,
    delaiMin: 5,
    delaiMax: 8,
  },
];

export const getBotByUuid = (uuid: string) => {
  return BOTS.find((el) => el.uuid === uuid);
};

export const getResponseBot = (bot: Bot, question: QuestionDuel) => {
  const isCorrect = Math.random() <= bot.percent;
  const delai = randomIntFromInterval(bot.delaiMin * 1000, bot.delaiMax * 1000);
  let response = undefined;
  if (isCorrect) {
    response = decrypt(question.answer) as string;
  } else {
    if (question.isqcm) {
      const correctAnswer = decrypt(question.answer);
      const idsAnswer = [...question.answers].map((el) => el.id);
      const filtered = idsAnswer.filter((n) => n !== Number(correctAnswer));
      response = randomFromArray(filtered);
    } else {
      response = "";
    }
  }

  return {
    uuid: bot.uuid,
    result: isCorrect,
    response: response,
    time: delai,
  };
};
