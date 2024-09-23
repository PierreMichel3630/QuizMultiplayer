import { Box } from "@mui/material";
import { percent } from "csx";
import { useEffect, useRef, useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

interface Props {
  code: string;
  url: string;
  width?: number;
  height?: number;
}

export const MapPositionBlock = ({ url, code, width, height }: Props) => {
  const refMap = useRef<HTMLDivElement | null>(null);
  const [heightCalculate, setHeightCalculate] = useState<number | undefined>(
    undefined
  );

  useEffect(() => {
    if (refMap.current) setHeightCalculate(refMap.current.clientHeight);
  }, [refMap]);

  return height !== undefined ? (
    <Box
      sx={{
        display: "flex",
        width: width
          ? width
          : window.innerWidth > 884
          ? 884
          : window.innerWidth,
        height: height,
      }}
      ref={refMap}
    >
      <ComposableMap
        projection="geoAzimuthalEqualArea"
        projectionConfig={{
          rotate: [-10.0, -53.0, 0],
          scale: height + 100,
        }}
        width={
          width ? width : window.innerWidth > 884 ? 884 : window.innerWidth
        }
        height={height}
      >
        <Geographies geography={url}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const isCountry = geo.properties.ISO_A3 === code;
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={isCountry ? "#ff1744" : "#FFF"}
                  stroke="#616161"
                  strokeWidth={1}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
    </Box>
  ) : (
    <Box
      sx={{
        flexGrow: 1,
        flex: "1 1 0",
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        width: percent(100),
      }}
      ref={refMap}
    >
      {heightCalculate && (
        <ComposableMap
          projection="geoAzimuthalEqualArea"
          projectionConfig={{
            rotate: [-10.0, -53.0, 0],
            scale: heightCalculate + 100,
          }}
          width={
            width ? width : window.innerWidth > 884 ? 884 : window.innerWidth
          }
          height={height ? height : heightCalculate}
        >
          <Geographies geography={url}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const isCountry = geo.properties.ISO_A3 === code;
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={isCountry ? "#ff1744" : "#FFF"}
                    stroke="#616161"
                    strokeWidth={2}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>
      )}
    </Box>
  );
};
