import { transform } from "ol/proj";

export const swap = ([a, b]) => [b, a];

export const convertPointsToEPSG3857 = points => points.map(convertPointToEPSG3857);

export const convertPointToEPSG3857 = point => transform(swap(point), "EPSG:4326", "EPSG:3857");
