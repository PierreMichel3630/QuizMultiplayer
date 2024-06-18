import {
  getRandomDifficulties,
  getRandomElement,
  randomIntFromInterval,
} from "./random.ts";

export const generateQuestion = (
  theme: number,
  points?: number,
  difficulty?: string
) => {
  let question: any = undefined;
  switch (theme) {
    case 37:
      question = generateQuestionMath(theme, points, difficulty);
      break;
    case 41:
      question = generateQuestionMath(theme, points, difficulty);
      break;
    case 53:
      question = generateQuestionMath(theme, points, difficulty, true);
      break;
    case 78:
      question = generateQuestionMultiplication(theme, points, difficulty);
      break;
    case 79:
      question = generateQuestionMultiplication(
        theme,
        points,
        difficulty,
        true
      );
      break;
    case 270:
      question = generateQuestionChance(theme);
      break;
    default:
      question = generateQuestionMath(theme, points, difficulty);
      break;
  }
  return question;
};

// CHANCE

const generateQuestionChance = (theme: number) => {
  const qcm = true;
  const difficultyQuestion = getRandomDifficulties();
  const response = randomIntFromInterval(0, 3);

  return {
    question: {
      "de-DE": "Eine Antwort zufällig auswählen?",
      "en-US": "Choose an answer at random ?",
      "es-ES": "¿Elige una respuesta al azar?",
      "fr-FR": "Choisissez une réponse au hasard ?",
    },
    difficulty: difficultyQuestion,
    image: null,
    theme: theme,
    isqcm: qcm,
    responses: [
      {
        label: {
          "de-DE": "A",
          "en-US": "A",
          "es-ES": "A",
          "fr-FR": "A",
        },
      },
      {
        label: {
          "de-DE": "B",
          "en-US": "B",
          "es-ES": "B",
          "fr-FR": "B",
        },
      },
      {
        label: {
          "de-DE": "C",
          "en-US": "C",
          "es-ES": "C",
          "fr-FR": "C",
        },
      },
      {
        label: {
          "de-DE": "D",
          "en-US": "D",
          "es-ES": "D",
          "fr-FR": "D",
        },
      },
    ],
    response: response,
    time: 10,
  };
};

// MATHS

enum Operator {
  MULTIPLY = "*",
  ADDITION = "+",
  SUBSTRACTION = "-",
}
interface Operation {
  value: string;
  result: number;
  operator: Operator;
  number1: number;
  number2: number;
}

const generateQuestionMath = (
  theme: number,
  points?: number,
  difficulty?: string,
  simple = false
) => {
  const qcm = points ? points < 10 : true;
  const difficultyQuestion = difficulty ? difficulty : getRandomDifficulties();
  const operation = simple
    ? generateOperationSimple()
    : generateOperation(difficultyQuestion);
  const timeSimple = 15 - 0.5 * (points ?? 0);
  const time = simple ? (timeSimple >= 4 ? timeSimple : 4) : 15;
  const response = {
    "de-DE": operation.result,
    "en-US": operation.result,
    "es-ES": operation.result,
    "fr-FR": operation.result,
  };
  const responses = qcm
    ? [...getResponseMathQCM(operation), response]
        .map((el) => ({ label: el }))
        .sort(() => Math.random() - 0.5)
    : [];

  const responseQcm = [...responses].findIndex((el) => el.label === response);

  return {
    question: {
      "de-DE": operation.value,
      "en-US": operation.value,
      "es-ES": operation.value,
      "fr-FR": operation.value,
    },
    difficulty: difficultyQuestion,
    image: null,
    theme: theme,
    isqcm: qcm,
    responses: responses,
    response: qcm ? responseQcm : response,
    time: time,
  };
};

const generateOperation = (difficulty: string): Operation => {
  let operators = [Operator.ADDITION];
  let operator = Operator.ADDITION;
  let operation = "1+1";
  let number1 = 0;
  let number2 = 0;
  switch (difficulty) {
    case "FACILE":
      operators = [Operator.ADDITION, Operator.SUBSTRACTION];
      operator = getRandomElement(operators) as Operator;
      if (operator === Operator.ADDITION) {
        number1 = randomIntFromInterval(2, 50);
        number2 = randomIntFromInterval(2, 50);
        operation = `${number1} ${operator} ${number2}`;
      } else {
        number1 = randomIntFromInterval(3, 50);
        number2 = randomIntFromInterval(2, number1);
        operation = `${number1} ${operator} ${number2}`;
      }
      break;
    case "MOYEN":
      operators = [Operator.ADDITION, Operator.SUBSTRACTION, Operator.MULTIPLY];
      operator = getRandomElement(operators) as Operator;
      if (operator === Operator.ADDITION) {
        number1 = randomIntFromInterval(100, 500);
        number2 = randomIntFromInterval(100, 500);
        operation = `${number1} ${operator} ${number2}`;
      } else if (operator === Operator.SUBSTRACTION) {
        number1 = randomIntFromInterval(101, 500);
        number2 = randomIntFromInterval(100, number1);
        operation = `${number1} ${operator} ${number2}`;
      } else {
        number1 = randomIntFromInterval(2, 10);
        number2 = randomIntFromInterval(2, 10);
        operation = `${number1} ${operator} ${number2}`;
      }
      break;
    case "DIFFICILE":
      operators = [Operator.MULTIPLY];
      operator = getRandomElement(operators) as Operator;
      if (operator === Operator.ADDITION) {
        number1 = randomIntFromInterval(50, 200);
        number2 = randomIntFromInterval(50, 200);
        operation = `${number1} ${operator} ${number2}`;
      } else if (operator === Operator.SUBSTRACTION) {
        number1 = randomIntFromInterval(50, 200);
        number2 = randomIntFromInterval(50, number1);
        operation = `${number1} ${operator} ${number2}`;
      } else {
        number1 = randomIntFromInterval(10, 50);
        number2 = randomIntFromInterval(10, 50);
        operation = `${number1} ${operator} ${number2}`;
      }
      break;
    case "IMPOSSIBLE":
    default:
      operators = [Operator.MULTIPLY];
      operator = getRandomElement(operators) as Operator;
      if (operator === Operator.ADDITION) {
        number1 = randomIntFromInterval(50, 500);
        number2 = randomIntFromInterval(50, 500);
        operation = `${number1} ${operator} ${number2}`;
      } else if (operator === Operator.SUBSTRACTION) {
        number1 = randomIntFromInterval(50, 500);
        number2 = randomIntFromInterval(50, number1);
        operation = `${number1} ${operator} ${number2}`;
      } else {
        number1 = randomIntFromInterval(100, 1000);
        number2 = randomIntFromInterval(100, 1000);
        operation = `${number1} ${operator} ${number2}`;
      }
      break;
  }

  return {
    value: convertToString(operation),
    result: eval(operation),
    operator,
    number1,
    number2,
  };
};

const generateOperationSimple = (): Operation => {
  let operation = "";
  const operators = [
    Operator.ADDITION,
    Operator.SUBSTRACTION,
    Operator.MULTIPLY,
  ];
  let number1 = 0;
  let number2 = 0;
  const operator = getRandomElement(operators) as Operator;
  if (operator === Operator.ADDITION) {
    number1 = randomIntFromInterval(2, 100);
    number2 = randomIntFromInterval(2, 100);
    operation = `${number1} ${operator} ${number2}`;
  } else if (operator === Operator.SUBSTRACTION) {
    number1 = randomIntFromInterval(3, 100);
    number2 = randomIntFromInterval(2, number1);
    operation = `${number1} ${operator} ${number2}`;
  } else {
    number1 = randomIntFromInterval(2, 10);
    number2 = randomIntFromInterval(2, 10);
    operation = `${number1} ${operator} ${number2}`;
  }

  return {
    value: convertToString(operation),
    result: eval(operation),
    operator,
    number1,
    number2,
  };
};

const generateQuestionMultiplication = (
  theme: number,
  points?: number,
  difficulty?: string,
  simple = false
) => {
  const qcm = points ? points < 10 : true;
  const difficultyQuestion = difficulty ? difficulty : getRandomDifficulties();
  const operation = simple
    ? generateMultiplicationSimple()
    : generateMultiplication(difficultyQuestion);
  const timeSimple = 15 - 0.5 * (points ?? 0);
  const time = simple ? (timeSimple >= 4 ? timeSimple : 4) : 15;

  const response = {
    "de-DE": operation.result,
    "en-US": operation.result,
    "es-ES": operation.result,
    "fr-FR": operation.result,
  };
  const responses = qcm
    ? [...getResponseMathQCM(operation), response]
        .map((el) => ({ label: el }))
        .sort(() => Math.random() - 0.5)
    : [];

  const responseQcm = [...responses].findIndex((el) => el.label === response);

  return {
    question: {
      "de-DE": operation.value,
      "en-US": operation.value,
      "es-ES": operation.value,
      "fr-FR": operation.value,
    },
    difficulty: difficultyQuestion,
    image: null,
    theme: theme,
    isqcm: qcm,
    responses: responses,
    response: qcm ? responseQcm : response,
    time: time,
  };
};

const generateMultiplicationSimple = (): Operation => {
  const operator = Operator.MULTIPLY;
  const number1 = randomIntFromInterval(2, 10);
  const number2 = randomIntFromInterval(2, 10);
  const operation = `${number1} ${operator} ${number2}`;

  return {
    value: convertToString(operation),
    result: eval(operation),
    operator,
    number1,
    number2,
  };
};

const generateMultiplication = (difficulty: string): Operation => {
  const operator = Operator.MULTIPLY;
  let operation = "";
  let number1 = 0;
  let number2 = 0;
  switch (difficulty) {
    case "FACILE":
      number1 = randomIntFromInterval(1, 10);
      number2 = randomIntFromInterval(1, 10);
      operation = `${number1} ${operator} ${number2}`;
      break;
    case "MOYEN":
      number1 = randomIntFromInterval(10, 20);
      number2 = randomIntFromInterval(10, 20);
      operation = `${number1} ${operator} ${number2}`;
      break;
    case "DIFFICILE":
      number1 = randomIntFromInterval(20, 100);
      number2 = randomIntFromInterval(20, 100);
      operation = `${number1} ${operator} ${number2}`;
      break;
    case "IMPOSSIBLE":
    default:
      number1 = randomIntFromInterval(100, 1000);
      number2 = randomIntFromInterval(100, 1000);
      operation = `${number1} ${operator} ${number2}`;
      break;
  }

  return {
    value: convertToString(operation),
    result: eval(operation),
    operator,
    number1,
    number2,
  };
};

const getResponseMathQCM = (operation: Operation) => {
  const operator = operation.operator;
  const number1 = operation.number1;
  const number2 = operation.number2;
  const correctResult = eval(`${number1} ${operator} ${number2}`);
  const results: Array<number> = [];
  if (operator === Operator.MULTIPLY) {
    const randomChiffre = [1, 2, -1, -2];
    const randomSomme = [-10, -2, 2, 10];
    randomChiffre.forEach((value) => {
      const operation1 = `${number1 + value} ${operator} ${number2}`;
      results.push(eval(operation1));
      const operation2 = `${number1} ${operator} ${number2 + value}`;
      results.push(eval(operation2));
    });
    randomSomme.forEach((value) => {
      results.push(correctResult + value);
    });
  } else if (operator === Operator.SUBSTRACTION) {
    const randomSomme = [-10, -5, -2, -1, 1, 2, 5, 10];
    randomSomme.forEach((value) => {
      results.push(correctResult + value);
    });
  } else if (operator === Operator.ADDITION) {
    const randomSomme = [-10, -5, -2, -1, 1, 2, 5, 10];
    randomSomme.forEach((value) => {
      results.push(correctResult + value);
    });
  } else {
    results.push(randomIntFromInterval(1, 1000));
    results.push(randomIntFromInterval(1, 1000));
    results.push(randomIntFromInterval(1, 1000));
  }
  const suffleResult = [...results].sort(() => Math.random() - 0.5);
  const response1 = suffleResult[0];
  const response2 = suffleResult[1];
  const response3 = suffleResult[2];
  const responses = [
    {
      "de-DE": response1,
      "en-US": response1,
      "es-ES": response1,
      "fr-FR": response1,
    },
    {
      "de-DE": response2,
      "en-US": response2,
      "es-ES": response2,
      "fr-FR": response2,
    },
    {
      "de-DE": response3,
      "en-US": response3,
      "es-ES": response3,
      "fr-FR": response3,
    },
  ];

  return responses;
};

const convertToString = (operationMaths: string) =>
  operationMaths.replace("*", "x");
