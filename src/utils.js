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