//Keeps track of a "beat epoch" and a BPM, and calculates
//beat times and other useful metrics for effects. Also
//has the ability to create a function that will run
//at musical intervals
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

  /**Returns integer for a given fractional beat
   * e.g., if you give a fraction of 0.25, it will return 4*this.beat
   * (the integer of the current 16th note)
   */
  getFractionalBeat(frac=1) {
    return this.beat * 1/frac;
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

  /**Same as onceEvery but more readable
   */
  every(opts, func) {
    this.onceEvery(opts.beat, opts.measure, func);
  }
}