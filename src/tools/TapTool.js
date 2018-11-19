export class TapTool {
  constructor(bpm, key){
    this._bpm = bpm;
    this._beatEpoch = 0;
    window.addEventListener("keyup", (e)=>{
      if(e.key === key) {
        this._beatEpoch = Date.now();
      }
    });
  }

  get bpm() {
    return this._bpm;
  }

  //Beats per milli
  get bpms() {
    return this._bpm / (60 * 1000);
  }

  get mspb() {
    return 1 / this.bpms;
  }

  /**Returns the current beat
   * @returns {Number} A float the current beat we're on, the integer
   * part is the current measure while the fraction part is the beat
   */
  get beat() {
    let now = Date.now();
    let delta = now - this._beatEpoch;
    let beats = delta * this.bpms;
    return beats;
  }

  /**Returns the time of the last fractional beat
   * @param {Number} [frac=1] The last fractional beat to return (1 is the last measure, 0.5 is last half note, etc)
   * @param {Number} [offset=0] Offset from that beat by another fraction beat
   * @returns {Number} The last time in ms of the last beat
   */
  getLastBeatTime(frac=1, offset=0) {
    return this._beatEpoch + (Math.floor((this.beat + offset) / frac) * frac * this.mspb);
  }

  getNextBeatTime(frac=1, offset=0) {
    return this.getLastBeatTime(frac) + (this.mspb * frac);
  }

  /**For a given fractional beat, and then an offset from that fraction,
   * return a function that will run the passed function only at that time
   */
  onceEvery(frac, offset, func) {
    let lastTime = 0, lbt;
    return ()=>{
      lbt = this.getLastBeatTime(frac, offset);
      if(lbt > lastTime) {
        lastTime = lbt;
        func();
      }
    };
  }
}