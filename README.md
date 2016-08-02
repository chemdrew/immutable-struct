  [![Build Status](https://travis-ci.org/chemdrew/immutable-struct.svg?branch=master)](https://travis-ci.org/chemdrew/immutable-struct)
  [![Coverage Status](https://coveralls.io/repos/chemdrew/immutable-struct/badge.svg?branch=master)](https://coveralls.io/r/chemdrew/immutable-struct?branch=master)

here is how you use it

```javascript
var obj = {
    string: {type: 'string' },
    number: {type: 'number'},
    boolean: {type: 'boolean'},
    enum: {type: 'string', values: ['TEST1', 'TEST2', 'TEST3']},
    array: {type: 'array:string', values: ['test1', 'test2']},
    object: {type: 'object', instanceOf: ParentModel}
}

var Obj = model.create(obj);

var myObj = newObj();

myObj.setNumber(10);
myObj.getNumber(); // returns 10

// or
var myObj = newObj( {string: 'stringInit', number: 20, boolean: false} );
```

ideally you would have each model in it's own file with module.exports = model.create(obj)