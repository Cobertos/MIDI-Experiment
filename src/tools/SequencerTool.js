//TODO: Use TapTool and an array of functions
//to put together a sequence of code that will get
//run based on a TapTool in sequence instead of having to hand
//code that shit

export class SequencerTool {
  constructor(tapTool, triggerFraction, sequence){
    this._lastBeat = tapTool.getFractionalBeat(triggerFraction)-1;
    this._tapTool = tapTool;
    this._sequence = sequence;
    //The fractional beat upon which the trigger first. 0.25
    //would mean every 16th note, 1 would be every quarter
    this.triggerFraction = triggerFraction; 
  }

  //Length of the sequence in this sequencer in unit beats
  get lengthInBeats() {
    return this._sequence.length * this.triggerFraction;
  }

  //Length of the sequence in this sequencer in terms of how
  //many time slice triggers the array contains
  get lengthInTriggers() {
    return this._sequence.length;
  }

  //Amount of triggers that happen in one beat
  get triggersPerBeat() {
    return 1/this.triggerFraction;
  }

  get currentTriggerIndex() {
    let currTrigger = this._tapTool.getFractionalBeat(this.triggerFraction); //Current resolution beat int
    currTrigger = Math.floor(currTrigger % this.lengthInTriggers);
    return currTrigger;
  }

  update() {
    let currBeat = this._tapTool.getFractionalBeat(this.triggerFraction); //Current resolution beat int
    let currSeq = this._tapTool.getFractionalBeat(this.lengthInBeats);     //Current sequence int
    if(this._lastBeat !== currBeat) {
      this._lastBeat = currBeat;
      //Pos in the sequence array
      let func = this._sequence[this.currentTriggerIndex];
      if(typeof func === "function") {
        func(currSeq, currBeat, this._tapTool);
      }
    }
  }
}