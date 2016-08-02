String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

var defineGetter = function(obj, key) {
    obj.prototype[`get${key.capitalizeFirstLetter()}`] = function() {
        return this[key];
    };
};

var defineSetter = function(obj, key, restrictions) {
    obj.prototype[`set${key.capitalizeFirstLetter()}`] = function(val) {
        if (restrictions.type && typeof val !== restrictions.type) throw new TypeError(`${key} type must be a ${restrictions.type}`);
        if (restrictions.values && restrictions.values.indexOf(val) < 0) throw new TypeError(`${key}'s value must be one of the following: ${restrictions.values.join(', ')}`);
        if (restrictions.instanceOf && !(val instanceof restrictions.instanceOf)) throw new TypeError(`${key} is spawned from an unsupported instance`);
        Object.defineProperty(this,key,{
            configurable: true,
            writeable: false,
            value: val
        });
    };
};

// this obj is extensible, regular push, pop, shift, unshift will work. v2 add support for all that stuff.
var definePusher = function(obj, key, restrictions) {
    obj.prototype[`push${key.capitalizeFirstLetter()}`] = function(val) {
        if (restrictions.type && typeof val !== restrictions.type) throw new TypeError(`${key} type must be a ${restrictions.type}`);
        if (restrictions.values && restrictions.values.indexOf(val) < 0) throw new TypeError(`${key}'s value must be one of the following: ${restrictions.values.join(', ')}`);
        if (!this[key]) Object.defineProperty(this,key,{
            configurable: true,
            writeable: false,
            value: new Array()
        });
        this[key].push(val);
    };
};

var lockKeys = function(obj) {
    for (var key in obj) {
        this[key] = undefined;
        Object.defineProperty(this,key,{
            configurable: true,
            writeable: false
        });
    }
    Object.preventExtensions(this);
};

var create = function(obj) {
    var Obj = function(initStruct) {
        lockKeys.call(this, obj);
        if (initStruct) {
            for (var key in initStruct) {
                if (!this[`set${key.capitalizeFirstLetter()}`]) throw new TypeError(`${key} is not defined in the model`);
                this[`set${key.capitalizeFirstLetter()}`](initStruct[key]);
            }
        }
        return this;
    }

    for (var key in obj) {
        var type = obj[key].type;
        if (!type) throw new Error(`Your object definition must contain a type \n${key}: {type: 'string|number|boolean|object|array:type'}`);
        type = type.split(':');
        switch (type[0]) {
            case 'string':
            case 'number':
            case 'boolean':
            case 'object':
                defineGetter(Obj, key);
                defineSetter(Obj, key, obj[key]);
                break;
            case 'array':
                obj[key].type = type[1];
                definePusher(Obj, key, obj[key]);
                break;
        }
    }
    return Obj;
}

exports.create = create;

// exports.lockKeys = lockKeys;
// exports.defineGetter = defineGetter;
// exports.defineSetter = defineSetter;
// exports.definePusher = definePusher;