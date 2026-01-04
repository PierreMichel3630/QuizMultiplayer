interface Point {
  top: Array<string>;
  right: Array<string>;
  bottom: Array<string>;
  left: Array<string>;
}

enum Direction {
  top = "top",
  right = "right",
  bottom = "bottom",
  left = "left",
}

interface Props {
  w?: number;
  h?: number;
  direction?: Direction;
  color?: string;
  border?: string;
}

export const Triangle = ({
  w = 20,
  h = 20,
  direction = Direction.bottom,
  color = "#44a6e8",
  border = "#44a6e8",
}: Props) => {
  const points: Point = {
    top: [`${w / 2},0`, `0,${h}`, `${w},${h}`],
    right: [`0,0`, `0,${h}`, `${w},${h / 2}`],
    bottom: [`0,0`, `${w},0`, `${w / 2},${h}`],
    left: [`${w},0`, `${w},${h}`, `0,${h / 2}`],
  };

  return (
    <svg width={w} height={h} stroke={border} strokeWidth={3}>
      <polygon points={points[direction].join(" ")} fill={color} />
    </svg>
  );
};
