import { _assert } from "../utils";

const height = 60;
const width = 400;

/**Visualizes a FFT with samples amount of samples
 * @prop {DivElement} dom The dom node to add to visualize
 */
export class FFTVisualTool {
  constructor(samples){
    this._samples = samples;

    this.dom = document.createElement("div");
    this.dom.style.width = `${width}px`;
    this.dom.style.height = `${height}px`;
    this.dom.style.display = "flex";
    this.dom.style.alignItems = "flex-end";
    this.dom.style.padding = "5px";
    for(var i=0; i<samples; i++) {
      let el = document.createElement("div");
      el.style.width = Math.max(width / samples, 1) + "px";
      el.style.height = "2px";
      el.style.backgroundColor = "#444488";
      this.dom.appendChild(el);
    }
  }

  update(arr) {
    _assert(arr.length === this._samples, "Mismatch in passed data array length and samples size");

    for(var i=0; i<this._samples; i++) {
      let node = this.dom.childNodes[i];
      node.style.height = (arr[i]/256 * (height-2) + 2) + "px";
      let hex = arr[i].toString(16).padStart(2, "0");
      node.style.backgroundColor = `#${hex}4488`;
    }
  }
}