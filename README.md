# manual-promise

`yarn add manual-promise`

`npn install manual-promise`


### Use case

A drop in replacement for JS `Promise` that exposes the `resolve` and `reject` function to scopes that have access to the promise instance; Plain JS promise can only be resolved or rejected from inside the function passed to the constructor of that promise, `ManualPromise` allows the promise to be resolved or rejected from outside itself.


### How

Extends `Promise` so 

`new ManualPromise() instanceof Promise === true`

Other solutions on the internet use a proxy or wrapper class for promise so they do not function as a drop in replacement.

View the test file for examples.