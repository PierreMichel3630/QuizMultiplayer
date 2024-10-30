import { Box } from "@mui/material";
import { percent } from "csx";
import { useEffect, useRef, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Point,
  ZoomableGroup,
} from "react-simple-maps";
import { Colors } from "src/style/Colors";
import mapWorld from "src/assets/map/countries-50m.json";

interface Position {
  coordinates: Point;
  zoom: number;
}

interface Props {
  data: {
    code: string;
    property: string;
    zoom: number;
    coordinates: Point;
  };
  width?: number;
  height?: number;
}

export const MapPositionBlock = ({ data, width, height }: Props) => {
  const refMap = useRef<HTMLDivElement | null>(null);
  const [heightCalculate, setHeightCalculate] = useState<number | undefined>(
    undefined
  );
  const [strokeWidth, setStrokeWidth] = useState(10000);

  useEffect(() => {
    if (refMap.current) setHeightCalculate(refMap.current.clientHeight);
  }, [refMap]);
  const [position, setPosition] = useState<Position>({
    coordinates: data.coordinates,
    zoom: data.zoom,
  });

  useEffect(() => {
    let newStroke = 50;
    if (position.zoom >= 3 && position.zoom < 5) {
      newStroke = 40;
    } else if (position.zoom >= 5 && position.zoom < 10) {
      newStroke = 30;
    } else if (position.zoom >= 10 && position.zoom < 20) {
      newStroke = 20;
    } else if (position.zoom >= 20 && position.zoom < 40) {
      newStroke = 10;
    } else if (position.zoom >= 40 && position.zoom < 80) {
      newStroke = 5;
    } else if (position.zoom >= 80) {
      newStroke = 1;
    }
    setStrokeWidth(newStroke);
  }, [position.zoom]);

  useEffect(() => {
    setPosition({
      coordinates: data.coordinates,
      zoom: data.zoom,
    });
  }, [data]);

  const handleMoveEnd = (position: Position) => {
    setPosition(position);
  };

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
        projection="geoMercator"
        projectionConfig={{
          scale: 15000,
        }}
        style={{
          backgroundColor: Colors.lightgrey,
          height: percent(100),
          width: percent(100),
        }}
        width={80000}
        height={60000}
        fill="transparent"
        stroke="white"
        strokeWidth={strokeWidth}
      >
        <ZoomableGroup
          maxZoom={200}
          zoom={position.zoom}
          center={position.coordinates}
          onMoveEnd={handleMoveEnd}
        >
          <Geographies geography={mapWorld}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const isCountry = geo.properties["alpha3"] === data.code;
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={isCountry ? Colors.red3 : Colors.grey6}
                    stroke="#FFF"
                    strokeWidth={strokeWidth}
                    style={{
                      default: {
                        outline: "none",
                      },
                      hover: {
                        outline: "none",
                      },
                      pressed: {
                        outline: "none",
                      },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
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
          projection="geoMercator"
          projectionConfig={{
            scale: 15000,
          }}
          style={{
            backgroundColor: Colors.lightBlue,
            height: percent(100),
            width: percent(100),
          }}
          width={80000}
          height={60000}
          fill="transparent"
          stroke="white"
          strokeWidth={strokeWidth}
        >
          <ZoomableGroup
            maxZoom={200}
            zoom={position.zoom}
            center={position.coordinates}
            onMoveEnd={handleMoveEnd}
          >
            <Geographies geography={mapWorld}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const isCountry = geo.properties["alpha3"] === data.code;
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={isCountry ? Colors.red3 : Colors.grey6}
                      stroke="#FFF"
                      strokeWidth={strokeWidth}
                      style={{
                        default: {
                          outline: "none",
                        },
                        hover: {
                          outline: "none",
                        },
                        pressed: {
                          outline: "none",
                        },
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
      )}
    </Box>
  );
};
