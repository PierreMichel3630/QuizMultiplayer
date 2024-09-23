import { Box } from "@mui/material";
import { percent, px } from "csx";

interface Props {
  src: string;
  border?: boolean;
}

export const ImageQuestionBlock = ({ src, border = false }: Props) => {
  return (
    <Box
      sx={{
        width: percent(100),
        height: percent(100),
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexGrow: 1,
        flex: "1 1 0",
      }}
    >
      {border ? (
        <img
          src={src}
          loading="lazy"
          style={{
            maxHeight: percent(90),
            maxWidth: percent(90),
            objectFit: "contain",
            border: "1px solid white",
          }}
        />
      ) : (
        <img
          src={src}
          loading="lazy"
          style={{
            height: percent(80),
            width: percent(80),
            objectFit: "contain",
          }}
        />
      )}
    </Box>
  );
};

interface PropsImageQCMBlock {
  src: string;
  width?: number;
  border?: boolean;
}

export const ImageQCMBlock = ({
  src,
  width = 200,
  border = false,
}: PropsImageQCMBlock) => {
  return (
    <Box
      sx={{
        width: percent(100),
        height: percent(100),
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexGrow: 1,
        flex: "1 1 0",
        maxHeight: px(width),
      }}
    >
      {border ? (
        <img
          src={src}
          style={{
            maxHeight: percent(95),
            maxWidth: percent(95),
            objectFit: "contain",
            border: "1px solid white",
          }}
        />
      ) : (
        <img
          src={src}
          style={{
            height: percent(95),
            width: percent(95),
            objectFit: "contain",
          }}
        />
      )}
    </Box>
  );
};
