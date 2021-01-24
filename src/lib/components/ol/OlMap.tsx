import * as olControls from "ol/control";
import Map from "ol/Map";
// import "ol/ol.css";
import { fromLonLat } from "ol/proj";
import { View as ReactView } from "react-native";
import React, { Component, CSSProperties } from "react";
import { clickableControl } from "./functions/controls";
import { circlesLayer, linesLayer, markersLayer, tileLayer } from "./functions/layers";
import { first, getDefault } from "../../utils/functions";

const fakeHash = () => Date.now().toString(16);
const debugLogEnabled = true;

export interface OlMapProps {
    zoom: number;
    // TODO: provide custom controls in addition to ol names and predefined
    controls: string[];
    centerButton: boolean;
    pin: string;
    target: string;
    center: any[];
    // layers
    dynamicLayers: any;
    extras: any;
    xyzsource: string;
    style?: CSSProperties;
}
//
// export class OlMap extends Component<OlMapProps> {
//     _defaultCtrls = ["ScaleLine", "FullScreen", "ZoomSlider"];
//     _defaultStyle = { height: "500px" };
//     _updMapInterval: any;
//
//     map: any;
//     mapDivTargetId: string;
//     staticLayers: any;
//     autoFitLayerName = "";
//
//     constructor(props) {
//         super(props);
//         this._updMapInterval = setInterval(this.updateMapSize, 1000);
//         this.mapDivTargetId = this.getTarget();
//
//         const strategy = props.xyzsource ? "xyz" : "osm";
//         const tiles = tileLayer("tileLayer", strategy, props.xyzsource);
//         this.staticLayers = { tileLayer: tiles, ...props.staticLayers };
//     }
//
//     click = e => console.log("Click on coordinates:", e.coordinate);
//
//     componentWillUnmount = () => {
//         clearInterval(this._updMapInterval);
//         this.resetMap();
//     };
//
//     componentDidMount() {
//         if (debugLogEnabled) console.log("[OlMap]: component mounting");
//         this.resetMap();
//         this.generateMap();
//         // push new layers
//         this.addLayers(this.staticLayers);
//         this.addLayers(this.buildDynamicLayers());
//         this.addControlsByOlName(this.getControls());
//         this.addPreDefinedControls();
//     }
//
//     buildDynamicLayers = () => {
//         if (debugLogEnabled) console.log("[OlMap]: building dynamic layers");
//         const layers = {};
//         const givenLayers = this.props.dynamicLayers;
//         for (const layerName in givenLayers) {
//             if (givenLayers.hasOwnProperty(layerName)) {
//                 const { autoFitLayerName } = this;
//                 const currentLayer = givenLayers[layerName];
//                 // TODO: tooltip properties to show
//                 const { iconStyle, drawLines, circles, autoFit, showMarkers } = currentLayer;
//                 const coordinates = currentLayer.coordinates ? currentLayer.coordinates.map(v => v.coords) : [];
//                 if (autoFit) {
//                     if (autoFitLayerName && autoFitLayerName !== layerName) {
//                         if (debugLogEnabled)
//                             console.warn(
//                                 `[OlMap]: WARNING, multiple layers have autoFit enabled. Only one layer can set autoFit.`
//                             );
//                     } else this.autoFitLayerName = layerName;
//                 }
//
//                 const markerLayerName = `${layerName}-markerLayer`;
//                 const lineLayerName = `${layerName}-lineLayer`;
//                 const circleLayerName = `${layerName}-circleLayer`;
//
//                 // TODO: linesLayer with line color
//                 if (showMarkers) layers[markerLayerName] = markersLayer({ coordinates, iconStyle }, markerLayerName);
//                 if (drawLines) layers[lineLayerName] = linesLayer(coordinates, lineLayerName);
//                 if (circles) layers[circleLayerName] = circlesLayer(currentLayer.coordinates, circleLayerName);
//             }
//         }
//         return layers;
//     };
//
//     addLayers = (layers = {}) => {
//         if (!this.map) return;
//         const truthyFilter = v => v;
//         const getNameMap = v => v.get("name");
//         const currentLayers = this.map.getLayers().getArray().map(getNameMap).filter(truthyFilter);
//         for (const layerName in layers) {
//             if (layers.hasOwnProperty(layerName)) {
//                 if (currentLayers.includes(layerName)) this.removeLayersByNames([layerName]);
//                 this.map.addLayer(layers[layerName]);
//             }
//         }
//     };
//
//     removeLayersByNames = (list: string[] = []) => {
//         for (const layer of this.map.getLayers().getArray()) {
//             for (const name of list) {
//                 if (name === layer.get("name")) this.map.removeLayer(layer);
//             }
//         }
//     };
//
//     getPin = () => getDefault(this.props.pin, "Pin 3");
//     getCenter = () => fromLonLat(getDefault(this.props.center, [0, 0]));
//     getZoom = () => getDefault(this.props.zoom, 5);
//     getTarget = () => getDefault(this.props.target, "_olMapDiv_" + fakeHash());
//     getControls = () => {
//         const controls = getDefault(this.props.controls, this._defaultCtrls);
//         return controls.filter((v, i) => controls.indexOf(v) === i);
//     };
//
//     removeDynamicLayers = () => {
//         const installedLayers = this.map
//             .getLayers()
//             .getArray()
//             .map(layer => layer.get("name"))
//             .filter(layername => !this.staticLayers.hasOwnProperty(layername));
//         this.removeLayersByNames(installedLayers);
//     };
//
//     resetMap = () => {
//         if (this.map) this.map.setTarget(null);
//     };
//
//     generateMap = () => {
//         if (debugLogEnabled) console.log("[OlMap]: generating map...");
//         const center = this.getCenter();
//         const zoom = this.getZoom();
//         const target = this.mapDivTargetId;
//         const view = new View({ center, zoom } as any);
//         this.map = new Map({ target, view });
//         this.map.on("click", this.click);
//     };
//
//     addControlsByOlName = (ctrls = []) => {
//         if (debugLogEnabled) console.log("[OlMap]: adding controls by name");
//         for (const C of ctrls) {
//             try {
//                 this.map.addControl(new olControls[C]());
//             } catch (e) {
//                 // TODO: refactor logging
//                 if (debugLogEnabled) console.log(`[OlMap]: skipping invalid control name "${C}"`);
//             }
//         }
//     };
//
//     addPreDefinedControls = () => {
//         const { centerButton } = this.props;
//         const { autoFitLayerName, map } = this;
//         if (!map) return;
//         if (centerButton) {
//             const left = "3em";
//             const top = "0.5em";
//             const innerHTML = "Center";
//             const clickFn = this.reCenterMap;
//             this.map.addControl(clickableControl({ left, top, innerHTML, clickFn }));
//         }
//         if (autoFitLayerName) {
//             const left = "10em";
//             const top = "0.5em";
//             const innerHTML = "Auto Fit";
//             const clickFn = this.autoFit;
//             this.map.addControl(clickableControl({ left, top, innerHTML, clickFn }));
//         }
//     };
//
//     getFocusLayer = () => {
//         const lname = this.autoFitLayerName;
//         const filterFn = l => l.get("name").includes(`${lname}-`);
//         const filteredLayers = this.map.getLayers().getArray().filter(filterFn);
//         return first(filteredLayers);
//     };
//
//     autoFit = () => {
//         const layer = this.getFocusLayer();
//         if (!layer) return console.log("[OlMap]: autoFit layer not found");
//         console.log(`[OlMap]: Using "${layer.get("name")}" points for auto fit`);
//         const { coordinates } = this.props.dynamicLayers[this.autoFitLayerName];
//         if (coordinates.length > 1) this.fit(layer);
//         else if (debugLogEnabled) console.log("[OlMap]: Zooming on zero/one coordinate(s) has no point");
//     };
//
//     fit = layer => this.map && this.map.getView().fit(layer.getSource().getExtent());
//
//     componentDidUpdate = () => {
//         if (debugLogEnabled) console.log("[OlMap]: component doing update");
//         this.removeDynamicLayers();
//         this.addLayers(this.buildDynamicLayers());
//     };
//
//     updateMapSize = () => this.map && this.map.updateSize();
//     reCenterMap = () => this.map && this.map.getView().setCenter(this.getCenter());
//
//     render() {
//         if (debugLogEnabled) console.log("[OlMap]: component rendering");
//         const divStyle = { ...this._defaultStyle, ...this.props.style };
//         return <ReactView id={this.mapDivTargetId} style={divStyle} {...this.props.extras} />;
//     }
// }

export class OlMap extends Component<OlMapProps> {}

export default OlMap;
