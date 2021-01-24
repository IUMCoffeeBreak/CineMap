import { Icon, Style } from "ol/style";
import Stroke from "ol/style/Stroke";
import { getDefault } from "../../../utils/functions";

export function lineString(hexColor = "#000000", width = 2) {
    const stroke = new Stroke({ color: hexColor, width });
    return new Style({ stroke });
}

export function pinIcon(pin) {
    const sourceOptions = sourceOption(pin);
    const scale = getDefault(pin.scalePin, 0.07);
    const anchor = getDefault(pin.anchor, [0.5, 1]);
    const options = { anchor, scale, ...sourceOptions };
    return new Style({ image: new Icon(options) });
}

function sourceOption(pin) {
    if (pin.format === "svg") {
        const imgSize = getDefault(pin.imgSize, [40, 40]);
        const img = document.createElement("img");
        const [a, b] = imgSize;
        img.src = pin.pin;
        img.width = a;
        img.height = b;
        return { img, imgSize };
    }
    // sopport for PNGs
    return { src: pin.pin };
}
