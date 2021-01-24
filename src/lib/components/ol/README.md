# OlMap

## Props
The component accepts the following properties:
```yaml
{
  zoom: 10,                                              // set default zoom
  center: [x, y],                                        // default center coordinates
  target: "map-id",                                      // id of container div hosting the map
  centerButton: true,                                    // enable centering button
  dynamicLayers: object,                                 // collection of layers
  controls: ["ScaleLine", "ZoomSlider", "FullScreen"],   // provide ol native controls by name, these are the defaults
  xyzsource: "proto://domain/maps/tile/{z}/{x}/{y}.png"  // provide xyz source template for tiles
};
```

## Dynamic layers
These layers are rebuilt every time the parent component re-renders, since `OlMap` is mostly props-based
<br/>
Every key of the `dynamicLayers` object will be used to name the layer in the creation phase.
<br/>
For each layer you can provide this structured object: 
```yaml
<layerName>: {
  showMarkers: true,                                      // enable/disable marker pins visualization for every coordinate 
  iconStyle: pinIcon(pins["Pin 1"]),                      // ol style used for rendering the pin
  coordinates: [{coords: [x, y], radius: number}, ...]    // provide coordinates for this layer   
  drawLines: false,                                       // draw lines between points
  circles: false,                                         // draw a circle around each point
  autoFit: false                                          // enable autoFit feature for this layer
},
```
#### Icon Style
Both `pinIcon` and `pins` are provided in the `lib` folder of the component.
<br/> 
The first is a helper to create an iconStyle compliant with the ol library.
<br/>
The second is an object collecting basic pin icons. You can provide a custom data structure, that must be compliant with the data structure provided below.
Every key of this object is the name of the pin.
```javascript
import png_pin from "./png/pin.png"
import svg_pin from "./svg/pin.svg"
export default {
  "PNG pin": {
    pin: png_pin,
    format: "png"
  },
  "SVG pin": {
    pin: svg_pin,
    anchor: [0.085, 0.17], 
    scalePin: 0.07,
    format: "svg",
    imgSize: [3000, 3000]
  }
}
```
The `format` property must be "`png`" or "`svg`"
<br/>
Svg may not be compatible with all browsers, and also, svg files must have specific width and height to work properly, so it may not work out of the box with generated SVGs.
