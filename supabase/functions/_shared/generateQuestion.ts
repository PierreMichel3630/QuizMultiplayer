import {
  getRandomDifficulties,
  getRandomElement,
  randomIntFromInterval,
} from "./random.ts";

export const generateQuestion = (theme: number, difficulty?: string) => {
  let question: any = undefined;
  switch (theme) {
    case 37:
      question = generateQuestionMath(theme, difficulty);
      break;
    case 41:
      question = generateQuestionMath(theme, difficulty);
      break;
    default:
      question = generateQuestionMath(theme, difficulty);
      break;
  }
  return question;
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
}

const generateQuestionMath = (theme: number, difficulty?: string) => {
  const difficultyQuestion = difficulty ? difficulty : getRandomDifficulties();
  const operation = generateOperation(difficultyQuestion);
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
    isqcm: false,
    responses: [],
    response: {
      "de-DE": operation.result,
      "en-US": operation.result,
      "es-ES": operation.result,
      "fr-FR": operation.result,
    },
  };
};

const generateOperation = (difficulty: string): Operation => {
  let operators = [Operator.ADDITION];
  let operator = Operator.ADDITION;
  let operation = "1+1";
  switch (difficulty) {
    case "FACILE":
      operators = [Operator.ADDITION, Operator.SUBSTRACTION];
      operator = getRandomElement(operators) as Operator;
      if (operator === Operator.ADDITION) {
        const number1 = randomIntFromInterval(2, 50);
        const number2 = randomIntFromInterval(2, 50);
        operation = `${number1} ${operator} ${number2}`;
      } else {
        const number1 = randomIntFromInterval(3, 50);
        const number2 = randomIntFromInterval(2, number1);
        operation = `${number1} ${operator} ${number2}`;
      }
      break;
    case "MOYEN":
      operators = [Operator.ADDITION, Operator.SUBSTRACTION, Operator.MULTIPLY];
      operator = getRandomElement(operators) as Operator;
      if (operator === Operator.ADDITION) {
        const number1 = randomIntFromInterval(100, 500);
        const number2 = randomIntFromInterval(100, 500);
        operation = `${number1} ${operator} ${number2}`;
      } else if (operator === Operator.SUBSTRACTION) {
        const number1 = randomIntFromInterval(101, 500);
        const number2 = randomIntFromInterval(100, number1);
        operation = `${number1} ${operator} ${number2}`;
      } else {
        const number1 = randomIntFromInterval(1, 10);
        const number2 = randomIntFromInterval(1, 10);
        operation = `${number1} ${operator} ${number2}`;
      }
      break;
    case "DIFFICILE":
      operators = [Operator.MULTIPLY];
      operator = getRandomElement(operators) as Operator;
      if (operator === Operator.ADDITION) {
        const number1 = randomIntFromInterval(50, 200);
        const number2 = randomIntFromInterval(50, 200);
        operation = `${number1} ${operator} ${number2}`;
      } else if (operator === Operator.SUBSTRACTION) {
        const number1 = randomIntFromInterval(50, 200);
        const number2 = randomIntFromInterval(50, number1);
        operation = `${number1} ${operator} ${number2}`;
      } else {
        const number1 = randomIntFromInterval(10, 50);
        const number2 = randomIntFromInterval(10, 50);
        operation = `${number1} ${operator} ${number2}`;
      }
      break;
    case "IMPOSSIBLE":
    default:
      operators = [Operator.MULTIPLY];
      operator = getRandomElement(operators) as Operator;
      if (operator === Operator.ADDITION) {
        const number1 = randomIntFromInterval(50, 500);
        const number2 = randomIntFromInterval(50, 500);
        operation = `${number1} ${operator} ${number2}`;
      } else if (operator === Operator.SUBSTRACTION) {
        const number1 = randomIntFromInterval(50, 500);
        const number2 = randomIntFromInterval(50, number1);
        operation = `${number1} ${operator} ${number2}`;
      } else {
        const number1 = randomIntFromInterval(100, 1000);
        const number2 = randomIntFromInterval(100, 1000);
        operation = `${number1} ${operator} ${number2}`;
      }
      break;
  }

  return {
    value: convertToString(operation),
    result: eval(operation),
  };
};

const convertToString = (operationMaths: string) =>
  operationMaths.replace("*", "x");
