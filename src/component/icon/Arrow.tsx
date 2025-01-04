interface PropsDirection {
  size?: number;
  color?: string;
}

export const ArrowRight = ({
  size = 20,
  color = "currentColor",
}: PropsDirection) => <ArrowIcon size={size} color={color} isRight />;

export const ArrowLeft = ({
  size = 20,
  color = "currentColor",
}: PropsDirection) => <ArrowIcon size={size} color={color} />;

interface Props {
  size?: number;
  isRight?: boolean;
  color?: string;
}

export const ArrowIcon = ({
  size = 20,
  color = "currentColor",
  isRight = false,
}: Props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    fill={color}
    viewBox="0 0 16 16"
    transform={isRight ? "rotate(90)" : "rotate(-90)"}
  >
    <path
      fillRule="evenodd"
      d="M7.022 1.566a1.13 1.13 0 0 1 1.96 0l6.857 11.667c.457.778-.092 1.767-.98 1.767H1.144c-.889 0-1.437-.99-.98-1.767z"
    />
  </svg>
);
