import {
  getRandomDifficulties,
  getRandomElement,
  multiplyOf,
  randomIntFromInterval,
} from "./random.ts";

enum Operator {
  MULTIPLY = "*",
  ADDITION = "+",
  SUBSTRACTION = "-",
  DIVISION = "/",
}
interface Operation {
  value: string;
  result: number;
  operator: Operator;
  number1: number;
  number2: number;
}

export const generateQuestion = (
  theme: number,
  qcm?: boolean,
  points?: number,
  difficulty?: string
) => {
  let question: any = undefined;
  switch (theme) {
    case 37:
      question = generateQuestionMath(theme, qcm, points, difficulty);
      break;
    case 41:
      question = generateQuestionMath(theme, qcm, points, difficulty);
      break;
    case 53:
      question = generateQuestionMathSimple(theme, qcm, points);
      break;
    /* OPERATION MATH */
    case 78:
      question = generateQuestionOperation(
        theme,
        Operator.MULTIPLY,
        qcm,
        points,
        difficulty
      );
      break;
    case 553:
      question = generateQuestionOperation(
        theme,
        Operator.ADDITION,
        qcm,
        points,
        difficulty
      );
      break;
    case 554:
      question = generateQuestionOperation(
        theme,
        Operator.SUBSTRACTION,
        qcm,
        points,
        difficulty
      );
      break;
    case 555:
      question = generateQuestionOperation(
        theme,
        Operator.DIVISION,
        qcm,
        points,
        difficulty
      );
      break;
    /* OPERATION SIMPLE MATH */
    case 79:
      question = generateQuestionOperationSimple(
        theme,
        Operator.MULTIPLY,
        qcm,
        points
      );
      break;
    case 552:
      question = generateQuestionOperationSimple(
        theme,
        Operator.DIVISION,
        qcm,
        points
      );
      break;
    case 550:
      question = generateQuestionOperationSimple(
        theme,
        Operator.ADDITION,
        qcm,
        points
      );
      break;
    case 551:
      question = generateQuestionOperationSimple(
        theme,
        Operator.SUBSTRACTION,
        qcm,
        points
      );
      break;
    case 270:
      question = generateQuestionChance(theme);
      break;
    case 556:
      question = generateQuestionEquationSimple(theme, qcm, points, difficulty);
      break;
    default:
      question = generateQuestionMath(theme, qcm, points, difficulty);
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

// EQUATION SIMPLE

const generateQuestionEquationSimple = (
  theme: number,
  qcm?: boolean,
  points?: number,
  difficulty?: string
) => {
  const isqcm = points
    ? points < 10
    : qcm === undefined
    ? Math.random() < 0.5
    : qcm;
  const difficultyQuestion = difficulty ?? getRandomDifficulties();

  const operators = [Operator.ADDITION, Operator.SUBSTRACTION];
  const operator = getRandomElement(operators) as Operator;
  const multiples = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const c = randomIntFromInterval(2, 50);
  const b = randomIntFromInterval(1, c);
  const res = operator === Operator.ADDITION ? c - b : c + b;

  const valuesOfA = multiplyOf(multiples, res);

  const a = getRandomElement(valuesOfA);
  const x = res / a;
  const response = { 
    "de-DE": x,
    "en-US": x,
    "es-ES": x,
    "fr-FR": x,
  };
  const operation = `${a}𝑥 ${operator} ${b} = ${c}`;

  const responses = isqcm
    ? [...getRandomResponse(x), response]
        .map((el) => ({ label: el }))
        .sort(() => Math.random() - 0.5)
    : [];

  const responseQcm = [...responses].findIndex((el) => el.label === response);

  return {
    question: {
      "de-DE": `${operation} , Wie viel ist 𝑥 wert ?`,
      "en-US": `${operation} , How much is 𝑥 worth ?`,
      "es-ES": `${operation} , ¿Cuánto vale 𝑥?`,
      "fr-FR": `${operation} , Combien vaut 𝑥 ?`,
    },
    difficulty: difficultyQuestion,
    image: null,
    theme: theme,
    isqcm: isqcm,
    responses: responses,
    response: isqcm ? responseQcm : response,
    time: 15,
  };
};

// OPERATION

const generateQuestionOperation = (
  theme: number,
  operator: Operator,
  qcm?: boolean,
  points?: number,
  difficulty?: string
) => {
  const isqcm = points
    ? points < 10
    : qcm === undefined
    ? Math.random() < 0.5
    : qcm;
  const difficultyQuestion = difficulty ?? getRandomDifficulties();

  let operation = generateMultiplication(difficultyQuestion);
  switch (operator) {
    case Operator.MULTIPLY:
      operation = generateMultiplication(difficultyQuestion);
      break;
    case Operator.ADDITION:
      operation = generateAddition(difficultyQuestion);
      break;
    case Operator.DIVISION:
      operation = generateDivision(difficultyQuestion);
      break;
    case Operator.SUBSTRACTION:
      operation = generateSubstraction(difficultyQuestion);
      break;
  }
  const time = 15;

  const response = {
    "de-DE": operation.result,
    "en-US": operation.result,
    "es-ES": operation.result,
    "fr-FR": operation.result,
  };
  const responses = isqcm
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
    isqcm: isqcm,
    responses: responses,
    response: isqcm ? responseQcm : response,
    time: time,
  };
};

// OPERATION SIMPLE
const generateQuestionOperationSimple = (
  theme: number,
  operator: Operator,
  qcm?: boolean,
  points?: number
) => {
  const isqcm = points
    ? points < 10
    : qcm === undefined
    ? Math.random() < 0.5
    : qcm;

  let operation = generateMultiplication("FACILE");
  switch (operator) {
    case Operator.MULTIPLY:
      operation = generateMultiplication("FACILE");
      break;
    case Operator.ADDITION:
      operation = generateAddition("FACILE");
      break;
    case Operator.DIVISION:
      operation = generateDivision("FACILE");
      break;
    case Operator.SUBSTRACTION:
      operation = generateSubstraction("FACILE");
      break;
  }
  console.log(operation)

  const timeSimple = 15 - 0.2 * (points ?? 0);
  const time = timeSimple >= 1 ? timeSimple : 1;

  const response = {
    "de-DE": operation.result,
    "en-US": operation.result,
    "es-ES": operation.result,
    "fr-FR": operation.result,
  };
  const responses = isqcm
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
    difficulty: "FACILE",
    image: null,
    theme: theme,
    isqcm: isqcm,
    responses: responses,
    response: isqcm ? responseQcm : response,
    time: time,
  };
};

// MATHS SIMPLE

const generateQuestionMath = (
  theme: number,
  qcm?: boolean,
  points?: number,
  difficulty?: string
) => {
  const operators = [
    Operator.ADDITION,
    Operator.SUBSTRACTION,
    Operator.DIVISION,
    Operator.MULTIPLY,
  ];
  const operator = getRandomElement(operators) as Operator;
  return generateQuestionOperation(theme, operator, qcm, points, difficulty);
};

const generateQuestionMathSimple = (
  theme: number,
  qcm?: boolean,
  points?: number
) => {
  const operators = [
    Operator.ADDITION,
    Operator.SUBSTRACTION,
    Operator.DIVISION,
    Operator.MULTIPLY,
  ];
  const operator = getRandomElement(operators) as Operator;
  return generateQuestionOperation(theme, operator, qcm, points);
};

// Generation Maths

const generateDivision = (difficulty: string): Operation => {
  const operator = Operator.DIVISION;
  let number1 = 0;
  let number2 = 0;
  switch (difficulty) {
    case "FACILE":
      number1 = randomIntFromInterval(1, 10);
      number2 = randomIntFromInterval(1, 10);
      break;
    case "MOYEN":
      number1 = randomIntFromInterval(10, 50);
      number2 = randomIntFromInterval(10, 50);
      break;
    case "DIFFICILE":
      number1 = randomIntFromInterval(50, 100);
      number2 = randomIntFromInterval(50, 100);
      break;
    case "IMPOSSIBLE":
    default:
      number1 = randomIntFromInterval(100, 1000);
      number2 = randomIntFromInterval(100, 1000);
      break;
  }
  const x = number1 * number2
  const operation = `${x} ${operator} ${number2}`;
  const res = x / number2

  return {
    value: convertToString(operation),
    result: res,
    operator,
    number1: x,
    number2,
  };
};

const generateSubstraction = (difficulty: string): Operation => {
  const operator = Operator.SUBSTRACTION;
  let operation = "";
  let number1 = 0;
  let number2 = 0;
  switch (difficulty) {
    case "FACILE":
      number1 = randomIntFromInterval(2, 50);
      number2 = randomIntFromInterval(1, number1);
      operation = `${number1} ${operator} ${number2}`;
      break;
    case "MOYEN":
      number1 = randomIntFromInterval(50, 500);
      number2 = randomIntFromInterval(100, number1);
      operation = `${number1} ${operator} ${number2}`;
      break;
    case "DIFFICILE":
      number1 = randomIntFromInterval(500, 1000);
      number2 = randomIntFromInterval(500, number1);
      operation = `${number1} ${operator} ${number2}`;
      break;
    case "IMPOSSIBLE":
    default:
      number1 = randomIntFromInterval(1000, 10000);
      number2 = randomIntFromInterval(1000, number1);
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

const generateAddition = (difficulty: string): Operation => {
  const operator = Operator.ADDITION;
  let operation = "";
  let number1 = 0;
  let number2 = 0;
  switch (difficulty) {
    case "FACILE":
      number1 = randomIntFromInterval(1, 100);
      number2 = randomIntFromInterval(1, 100);
      operation = `${number1} ${operator} ${number2}`;
      break;
    case "MOYEN":
      number1 = randomIntFromInterval(100, 500);
      number2 = randomIntFromInterval(100, 500);
      operation = `${number1} ${operator} ${number2}`;
      break;
    case "DIFFICILE":
      number1 = randomIntFromInterval(500, 1000);
      number2 = randomIntFromInterval(500, 1000);
      operation = `${number1} ${operator} ${number2}`;
      break;
    case "IMPOSSIBLE":
    default:
      number1 = randomIntFromInterval(1000, 10000);
      number2 = randomIntFromInterval(1000, 10000);
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
  } else if (operator === Operator.DIVISION) {
    const randomSomme = [-10,-9,-8,-7,-6,-5,-4,-3,-2,-1,1,2,3,4,5,6,7,8,9,10];
    randomSomme.forEach((value) => {
      const res = correctResult + value
      if(res > 0) {
        results.push(correctResult + value);
      }
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

const getRandomResponse = (result: number) => {
  const results : Array<number> = [];
  const randomChiffre : Array<number> = [1, 2, 3, 4, 5, -1, -2, -3, -4, -5];
  randomChiffre.forEach((value) => {
    results.push(result + value);
  });
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
  operationMaths.replace("*", "x").replace("/", "÷");
