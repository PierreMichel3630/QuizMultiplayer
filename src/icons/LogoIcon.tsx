import { Box, createSvgIcon } from "@mui/material";
import { px } from "csx";
import { Colors } from "src/style/Colors";

export const LogoIcon = createSvgIcon(
  <svg
    width="86"
    height="128"
    viewBox="0 0 86 128"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4.01863 126L27.2666 73.891C27.5462 73.2622 27.6593 72.5766 27.5957 71.8955C27.5322 71.2144 27.294 70.559 26.9025 69.988C26.5109 69.4169 25.9782 68.9479 25.3519 68.623C24.7256 68.298 24.0253 68.1271 23.3135 68.1256H6.31359C5.59952 68.1282 4.89604 67.9598 4.26671 67.6357C3.63739 67.3115 3.10207 66.8418 2.70913 66.269C2.3162 65.6962 2.07803 65.0384 2.01616 64.355C1.95429 63.6715 2.07067 62.9841 2.35478 62.3547L28.6895 4.48033C29.0242 3.74346 29.5754 3.11635 30.2755 2.67581C30.9756 2.23527 31.7942 2.00041 32.6311 2H76.8091C77.6198 2.00028 78.4139 2.22058 79.1 2.63551C79.7861 3.05045 80.3362 3.64315 80.687 4.34532C81.0377 5.0475 81.1749 5.83058 81.0826 6.60437C80.9904 7.37816 80.6724 8.11116 80.1655 8.71894L56.929 36.6254C56.4234 37.2336 56.1069 37.9666 56.0157 38.74C55.9246 39.5134 56.0626 40.2958 56.4139 40.9972C56.7651 41.6986 57.3154 42.2905 58.0013 42.7047C58.6872 43.119 59.4809 43.3388 60.2911 43.3388H79.695C80.5467 43.3385 81.3793 43.5809 82.0875 44.0355C82.7957 44.49 83.3475 45.1363 83.6731 45.8923C83.9987 46.6484 84.0835 47.4802 83.9166 48.2826C83.7498 49.0849 83.3388 49.8217 82.7358 50.3995L4.01863 126Z"
      fill="white"
      stroke="white"
      strokeWidth="2.75"
      strokeLinejoin="round"
    />
  </svg>,
  "Logo"
);

export const LogoIconRound = () => {
  return (
    <Box
      sx={{
        backgroundColor: Colors.colorApp,
        width: px(60),
        height: px(60),
        borderRadius: "50%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <LogoIcon
        sx={{ color: Colors.white, ml: "2px", mt: "3px", fontSize: 40 }}
      />
    </Box>
  );
};

export const LogoIconSquare = () => {
  return (
    <Box
      sx={{
        backgroundColor: Colors.colorApp,
        width: px(30),
        height: px(25),
        borderRadius: px(5),
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <LogoIcon
        sx={{ color: Colors.white, ml: "2px", mt: "3px", fontSize: 20 }}
      />
    </Box>
  );
};
