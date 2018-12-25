export class PromiseProxy {
  constructor(initialPromise) {
    let externalResolve, externalReject;
    let p = new Promise((res, rej)=>{
      externalResolve = res;
      externalReject = rej;
    });
    p.resolve = externalResolve;
    p.reject = externalReject;

    p.proxy = function(externalPromise){
      externalPromise
        .then(externalResolve)
        .catch(externalReject);
    };

    if(initialPromise) {
      p.proxy(initialPromise);
    }

    return p;
  }
}

export function _assert(condition, message="Assertion Error", error=Error) {
  if(!condition) {
    throw new error(message);
  }
}

export function normalRandom() {
  var n=(Math.random()+Math.random()+Math.random()+Math.random()+Math.random())-2.5;
  return n;
}

export function randomRange(a,b) {
  return Math.random()*(b-a)+a;
}

//Actual modulus, instead of just remained (%).
//handles negative number wrap around properly
export function mod(f,m) {
  return f - m * Math.floor(f / m);
}