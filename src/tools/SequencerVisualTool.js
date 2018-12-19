const height = 40;
const beatWidth = 20;

/**Visualizes a FFT with samples amount of samples
 * @prop {DivElement} dom The dom node to add to visualize
 */
export class SequencerVisualTool {
  constructor(sequencer){
    this._sequencer = sequencer;

    this.dom = document.createElement("div");
    this.dom.style.width = `${beatWidth*this._sequencer.lengthInBeats}px`;
    this.dom.style.height = `${height}px`;
    this.dom.style.display = "flex";
    this.dom.style.alignItems = "flex-end";
    this.dom.style.padding = "5px";
    for(var i=0; i<this._sequencer.lengthInTriggers; i++) {
      let el = document.createElement("div");
      el.style.width = Math.max(beatWidth / this._sequencer.triggersPerBeat, 1) + "px";
      el.style.height = height+"px";
      el.style.backgroundColor = "#444488";
      this.dom.appendChild(el);
    }
  }

  update() {
    for(var i=0; i<this._sequencer.lengthInTriggers; i++) {
      let node = this.dom.childNodes[i];
      if(i === this._sequencer.currentTriggerIndex) {
        node.style.backgroundColor = `#FF4488`;
      }
      else {
        node.style.backgroundColor = "#444488";
      }
    }
  }
}