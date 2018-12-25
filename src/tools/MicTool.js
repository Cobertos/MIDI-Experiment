import { PromiseProxy } from "../utils";

/**Tool to get a FFT of an audio source
 */
export class MicTool {
  constructor(samples){
    this._isResolved = false;
    this._promise = new PromiseProxy();

    this._asyncConstructor(samples);
  }

  async requireUserInteraction() {
    let btn = document.createElement("button");
    btn.innerHTML = "Chrome requires user interaction to use audio for FFT. Click this or disable in chrome:// flags";
    btn.style.width = "20%";
    btn.style.height = "20%";
    btn.style.position = "absolute";
    btn.style.top = 0;
    btn.style.left = 0;
    document.body.appendChild(btn);

    return new Promise((resolve, reject)=>{
      btn.addEventListener("click", ()=>{
        document.body.removeChild(btn);
        resolve();
      });
    });
  }

  async _asyncConstructor(samples){
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    //Chrome's new policy to require user interaction before doing anything
    //WebAudio is kind of lame. At least it can be disabled (in chrome://flags)
    //https://goo.gl/7K7WLu
    if(audioCtx.state === "suspended") {
      console.warn("Requires user ineraction! Disable it in chrome://flags");
      this.requireUserInteraction()
        .then(()=>{
          console.log("Got user interaction");
          return audioCtx.resume();
        });
    }
    const analyzer = this.analyzer = audioCtx.createAnalyser();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true
      });
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyzer);
      //analyzer.connect(audioCtx.destination);
      analyzer.fftSize = samples;
      const bufferLength = analyzer.frequencyBinCount;
      const dataArray = this.dataArray = new Uint8Array(bufferLength);
      this._promise.resolve(this);
      this._isResolved = true;
    }
    catch(e){
      this._promise.reject(e);
    }
  }

  /**Returns a boolean whether finished construction or not
   */
  get isConstructed(){
    return this._isResolved;
  }

  /**Returns a promise for when the MicTool has finished constructing
   */
  get construction(){
    return this._promise;
  }

  /**Gets the real amount of bins that we're gonna get from the
   * analizer node for the ADC.
   * Available before async construction finishes
   * @returns {Number} The number of bins
   */
  get bins(){
    return this.analyzer.frequencyBinCount;
  }

  /**Returns the data for this audio source
   * @returns {Uint8Array} The data with samples amount of samples
   * from low to high, 0-256 (or this might be browser dependant? idk)
   */
  get data(){
    //this.analyzer.getByteTimeDomainData(this.dataArray);
    this.analyzer.getByteFrequencyData(this.dataArray);
    return this.dataArray;
  }
}