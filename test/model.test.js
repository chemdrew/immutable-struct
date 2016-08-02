'use strict';

var expect = require('chai').expect,
     sinon = require('sinon');

var model = require('./../lib/model.js');

describe('model.js creates a new object', () => {

    var ParentModel = function() {
        this.test = true;
    };

    var obj = {
        string: {type: 'string' },
        number: {type: 'number'},
        boolean: {type: 'boolean'},
        enum: {type: 'string', values: ['TEST1', 'TEST2', 'TEST3']},
        array: {type: 'array:string', values: ['test1', 'test2']},
        object: {type: 'object', instanceOf: ParentModel}
    }

    var Obj = model.create(obj);

    // getting and setting cases

    it('if I set the key string to my name using the set method it should be reflected', () => {
        var myObj = new Obj();
        var fn = function() { myObj.setString('Andrew Pratt'); }
        expect(fn).to.not.throw();
        expect(myObj.getString()).to.equal('Andrew Pratt');
        expect(myObj).to.have.all.keys(['string', 'number', 'boolean', 'enum', 'array', 'object']);
    });
    
    it('if I set the key number to my age using the set method it should be reflected', () => {
        var myObj = new Obj();
        var fn = function() { myObj.setNumber(23); }
        expect(fn).to.not.throw();
        expect(myObj.getNumber()).to.equal(23);
        expect(myObj).to.have.all.keys(['string', 'number', 'boolean', 'enum', 'array', 'object']);
    });

    it('if I set the key boolean to true using the set method it should be reflected', () => {
        var myObj = new Obj();
        var fn = function() { myObj.setBoolean(true); }
        expect(fn).to.not.throw();
        expect(myObj.getBoolean()).to.equal(true);
        expect(myObj).to.have.all.keys(['string', 'number', 'boolean', 'enum', 'array', 'object']);
    });

    it('if I set the key boolean to false using the set method it should be reflected', () => {
        var myObj = new Obj();
        var fn = function() { myObj.setBoolean(false); }
        expect(fn).to.not.throw();
        expect(myObj.getBoolean()).to.equal(false);
        expect(myObj).to.have.all.keys(['string', 'number', 'boolean', 'enum', 'array', 'object']);
    });

    it('if I set the key enum to TEST2 using the set method it should be reflected', () => {
        var myObj = new Obj();
        var fn = function() { myObj.setEnum('TEST2'); }
        expect(fn).to.not.throw();
        expect(myObj.getEnum()).to.equal('TEST2');
        expect(myObj).to.have.all.keys(['string', 'number', 'boolean', 'enum', 'array', 'object']);
    });

    it('if I set the key object to ParentModel using the set method it should be reflected', () => {
        var parentModel = new ParentModel();
        var myObj = new Obj();
        var fn = function() { myObj.setObject(parentModel); }
        expect(fn).to.not.throw();
        expect(myObj.getObject()).to.equal(parentModel);
        expect(myObj).to.have.all.keys(['string', 'number', 'boolean', 'enum', 'array', 'object']);
    });

    // array cases

    it('if I push to the array using the push method it should be reflected', () => {
        var myObj = new Obj();
        var fn = function() { myObj.pushArray('test1'); myObj.pushArray('test2'); }
        expect(fn).to.not.throw();
        expect(myObj.array[0]).to.equal('test1');
        expect(myObj.array[1]).to.equal('test2');
        expect(myObj).to.have.all.keys(['string', 'number', 'boolean', 'enum', 'array', 'object']);
    });

    // init cases

    it('if I set the key string to my name using the set method it should be reflected', () => {
        var parentModel = new ParentModel();
        var myObj = new Obj({string: 'string', number: 10, boolean: true, enum: 'TEST1', object: parentModel});
        expect(myObj.getString()).to.equal('string');
        expect(myObj.getNumber()).to.equal(10);
        expect(myObj.getBoolean()).to.equal(true);
        expect(myObj.getEnum()).to.equal('TEST1');
        expect(myObj).to.have.all.keys(['string', 'number', 'boolean', 'enum', 'array', 'object']);
    });

    // error cases

    it('a type error should be thrown if I try to instantiate a new model without type', () => {
        var myObj = new Obj();
        var fn = function() { var Obj = model.create( {test: {}} ); }
        expect( fn ).to.throw(Error, 'Your object definition must contain a type \ntest: {type: \'string|number|boolean|object|array:type');
    });
    
    it('a type error should be thrown if I try to traditionally add a key', () => {
        var myObj = new Obj();
        var fn = function() { myObj.test = 'test' }
        expect( fn ).to.throw(TypeError, 'Can\'t add property test, object is not extensible');
        expect(myObj).to.not.include.keys('test');
        expect(myObj).to.have.all.keys(['string', 'number', 'boolean', 'enum', 'array', 'object']);
    });

    it('a type error should be thrown if I use the assign method on it', () => {
        var myObj = new Obj();
        var fn = function() { Object.assign(myObj,{test: 'test'}); }
        expect( fn ).to.throw(TypeError, 'Can\'t add property test, object is not extensible');
        expect(myObj).to.not.include.keys('test');
        expect(myObj).to.have.all.keys(['string', 'number', 'boolean', 'enum', 'array', 'object']);
    });

    it('an error should be thrown if I assign a number to a string type', () => {
        var myObj = new Obj();
        var fn = function() { myObj.setString(10) }
        expect( fn ).to.throw(TypeError, 'string type must be a string');
    });

    it('an error should be thrown if I assign an invalid enum to a specified enum', () => {
        var myObj = new Obj();
        var fn = function() { myObj.setEnum('test') }
        expect( fn ).to.throw(TypeError, 'enum\'s value must be one of the following: TEST1, TEST2, TEST3');
    });

    it('an error should be thrown if I assign an incorrect instance to an object key', () => {
        var myObj = new Obj();
        var fn = function() { myObj.setObject({}) }
        expect( fn ).to.throw(TypeError, 'object is spawned from an unsupported instance');
    });

    it('an error should be thrown if I pass in an incorrect instantiation object', () => {
        var fn = function() { var myObj = new Obj({test: 'string'}); }
        expect( fn ).to.throw(TypeError, 'test is not defined in the model');
    });

    it('if I push and incorrect type to the array using the push method an error should be thrown', () => {
        var myObj = new Obj();
        var fn = function() { myObj.pushArray(10); }
        expect( fn ).to.throw(TypeError, 'array type must be a string');
    });

    it('if I push and incorrect value to the array using the push method an error should be thrown', () => {
        var myObj = new Obj();
        var fn = function() { myObj.pushArray('this is not accepted'); }
        expect( fn ).to.throw(TypeError, 'array\'s value must be one of the following: test1, test2');
    });

});