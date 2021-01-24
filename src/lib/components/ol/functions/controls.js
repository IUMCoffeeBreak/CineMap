import Control from "ol/control/Control";
import { getDefault } from "../../../utils/functions";

function defaultClickFn(v) {
    return () => console.log(`[${v}]: default control click function`);
}

export function clickableControl(opts = {}) {
    const innerHTML = getDefault(opts.innerHTML, "Custom");
    const clickFn = getDefault(opts.clickFn, defaultClickFn(innerHTML));
    const button = document.createElement("button");
    button.innerHTML = innerHTML;
    button.style.width = getDefault(opts.width, "80px");
    button.style.height = getDefault(opts.height, "30px");
    const div = document.createElement("div");
    div.style.left = opts.left;
    div.style.right = opts.right;
    div.style.top = opts.top;
    div.style.bottom = opts.bottom;
    div.className = "ol-control" + getDefault(opts.className, "");
    div.appendChild(button);
    div.addEventListener("click", clickFn);
    return new Control({ element: div });
}
