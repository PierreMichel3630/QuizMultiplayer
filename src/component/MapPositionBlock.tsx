import { Box, Divider } from "@mui/material";
import { percent, px } from "csx";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Point,
  ZoomableGroup,
} from "react-simple-maps";
import mapWorld from "src/assets/map/countries-50m.json";
import { Colors } from "src/style/Colors";

import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap";

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
  height?: number;
}

export const MapPositionBlock = ({ data, height }: Props) => {
  const ZOOM_MAX = 400;
  const ZOOM_MIN = 1;
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

  const zoomOut = useCallback(() => {
    const newZoom = position.zoom - position.zoom * 0.3;
    setPosition((prev) => ({
      ...prev,
      zoom: newZoom > ZOOM_MIN ? newZoom : ZOOM_MIN,
    }));
  }, [position]);

  const zoomIn = useCallback(() => {
    const newZoom = position.zoom + position.zoom * 0.3;
    setPosition((prev) => ({
      ...prev,
      zoom: newZoom > ZOOM_MAX ? ZOOM_MAX : newZoom,
    }));
  }, [position]);

  const center = useCallback(() => {
    setPosition({
      coordinates: data.coordinates,
      zoom: data.zoom,
    });
  }, [data]);

  return (
    <Box
      sx={{
        flexGrow: 1,
        flex: "1 1 0",
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        width: percent(100),
        position: "relative",
      }}
    >
      {height !== undefined ? (
        <Box
          sx={{
            display: "flex",
            height: height,
            cursor: "pointer",
            pointerEvents: "none",
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
              maxZoom={ZOOM_MAX}
              zoom={position.zoom}
              center={position.coordinates}
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
          {heightCalculate !== undefined && (
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
                maxZoom={ZOOM_MAX}
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
      )}
      <Box
        sx={{
          position: "absolute",
          display: "flex",
          flexDirection: "column",
          gap: px(5),
          bottom: 5,
          right: 5,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            borderRadius: px(5),
            p: px(2),
            backgroundColor: Colors.white,
          }}
        >
          <ZoomOutIcon
            sx={{ color: Colors.black, cursor: "pointer", fontSize: 30 }}
            onClick={() => zoomOut()}
          />
          <Divider
            sx={{ borderBottomWidth: 3, borderColor: Colors.lightgrey }}
          />
          <ZoomInIcon
            sx={{ color: Colors.black, cursor: "pointer", fontSize: 30 }}
            onClick={() => zoomIn()}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            borderRadius: px(5),
            p: px(2),
            backgroundColor: Colors.white,
          }}
        >
          <ZoomOutMapIcon
            sx={{
              color: Colors.black,
              cursor: "pointer",
              fontSize: 30,
            }}
            onClick={() => center()}
          />
        </Box>
      </Box>
    </Box>
  );
};
