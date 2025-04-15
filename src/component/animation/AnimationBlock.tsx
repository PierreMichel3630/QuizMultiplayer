import Lottie from "react-lottie";

interface Props {
  data: any;
  width?: number;
  height?: number;
  isStopped?: boolean;
  isPaused?: boolean;
}

export const AnimationBlock = ({
  data,
  width = 100,
  height = 100,
  isStopped = false,
  isPaused = false,
}: Props) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: data,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <Lottie
      options={defaultOptions}
      height={width}
      width={height}
      isStopped={isStopped}
      isPaused={isPaused}
      style={{ margin: 0 }}
    />
  );
};
