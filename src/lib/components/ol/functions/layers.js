import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { lineString } from "./style";
import { fromLonLat } from "ol/proj";
import { convertPointsToEPSG3857, swap } from "./coordinates";
import LineString from "ol/geom/LineString";
import Vector from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import XYZ from "ol/source/XYZ";
import { circular as circularPolygon } from "ol/geom/Polygon";

export function pointFeature(p, iconStyle = null) {
    const geometry = new Point(fromLonLat(swap(p)));
    const feature = new Feature({ geometry });
    if (iconStyle) feature.setStyle(iconStyle);
    return feature;
}

export function vectorSource(opts) {
    return new VectorSource(opts);
}

export function vector(opts, custom_opts = {}) {
    const v = new Vector(opts);
    if (custom_opts.layerName) v.set("name", custom_opts.layerName);
    return v;
}

export function markersLayer(opts, layerName) {
    const { coordinates, iconStyle } = opts;
    const features = coordinates.map(p => pointFeature(p, iconStyle));
    const source = vectorSource({ features });
    return vector({ source }, { layerName });
}

export function linesLayer(points, layerName) {
    const geometry = new LineString(convertPointsToEPSG3857(points));
    const featureLine = new Feature({ geometry });
    const style = lineString();
    const source = vectorSource({ features: [featureLine] });
    return vector({ source, style }, { layerName });
}

export function circlesLayer(coordinates, layerName) {
    const features = coordinates.map(
        ({ radius, coords }) =>
            new Feature(circularPolygon(swap(coords), radius, 10000).transform("EPSG:4326", "EPSG:3857"))
    );
    const source = vectorSource({ features });
    return vector({ source }, { layerName });
}

export function XYZLayer(url, custom_opts = {}) {
    const source = new XYZ({ url });
    const tileLayer = new TileLayer({ source });
    if (custom_opts.layerName) tileLayer.set("name", custom_opts.layerName);
    return tileLayer;
}

export function OSMLayer(custom_opts = {}) {
    const source = new OSM();
    const layer = new TileLayer({ source });
    if (custom_opts.layerName) layer.set("name", custom_opts.layerName);
    return layer;
}

export function tileLayer(layerName = "", strategy = "osm", source = "") {
    let layer;
    if (strategy === "xyz" && !source) throw new Error("xyzsource not provived while creating the tile layer");
    if (strategy === "osm") layer = OSMLayer({ layerName });
    else if (strategy === "xyz") layer = XYZLayer(source, { layerName });
    return layer;
}
