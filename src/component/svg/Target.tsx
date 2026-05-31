
interface Props {
  onPointerDown?: (event: React.MouseEvent<SVGSVGElement>) => void;
  size?: number
}

export const Target = ({ size = 100 , onPointerDown }: Props) => {
  return (
    <svg
      width={size}
      height={size}
      onPointerDown={onPointerDown}
      style={{ cursor: "pointer" }}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="100" cy="100" r="100" fill="#ff0000" />
      <circle cx="100" cy="100" r="95" fill="currentColor"/>
      <circle cx="100" cy="100" r="60" fill="#ff0000" />
      <circle cx="100" cy="100" r="55" fill="currentColor"/>
      <circle cx="100" cy="100" r="20" fill="#ff0000" />
      <circle cx="100" cy="100" r="15" fill="currentColor"/>

      <line
        x1="100"
        y1="0"
        x2="100"
        y2="200"
        stroke="#ff0000"
        strokeWidth="5"
      />
      <line
        x1="0"
        y1="100"
        x2="200"
        y2="100"
        stroke="#ff0000"
        strokeWidth="5"
      />
    </svg>
  );
};
