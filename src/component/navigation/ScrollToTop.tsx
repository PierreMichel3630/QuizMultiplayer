import { Box, Fade, useScrollTrigger } from "@mui/material";

interface Props {
  children?: React.ReactElement<unknown>;
  window?: () => HTMLElement | null;
  anchorRef: React.RefObject<HTMLDivElement | null>;
}

export default function ScrollTop(props: Readonly<Props>) {
  const { children, window, anchorRef } = props;

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
    target: window ? (window() ?? undefined) : undefined,
  });

  const handleClick = () => {
    if (anchorRef.current) {
      anchorRef.current.scrollIntoView({
        block: "center",
        behavior: "smooth", // Ajout d'un effet fluide plus agréable !
      });
    }
  };

  return (
    <Fade in={trigger}>
      <Box
        onClick={handleClick}
        sx={{ position: "fixed", bottom: 16, right: 16 }}
      >
        {children}
      </Box>
    </Fade>
  );
}
