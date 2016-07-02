[![Build Status](https://travis-ci.org/ohager/nanoflux-fusion.svg?branch=master)](https://travis-ci.org/ohager/nanoflux-fusion)


# nanoflux-fusion

[__PROJECT SITE__](http://ohager.github.io/nanoflux/)

> Note: This is still a very early version and considered as a developer preview

A Redux-like extension for Nanoflux.

*nanoflux-fusion* is built on top of [nanoflux](https://github.com/ohager/nanoflux), a quite efficient Flux implementation,  
and adopts the concept of reducer functions for application state management, making Flux even more comfortable.

## Concept

[Dan Abramov](https://github.com/gaearon) pushed the Flux evolution with [Redux](http://redux.js.org/) and proved that application 
state management is possible with a very minimalistic approach. The idea of using reducer functions to alter the state
is very elegant. *nanoflux-fusion* adopts the idea of reducer functions (called *Fusionators*, because naming is fun) to make Flux even more comfortable.
That way, it's not necessary to define any Store. The user just focus on *how* he wants to alter the state using
functions the simply return the new state.

### Example

```javascript

	var NanoFlux = require('nanoflux-fusion');
	
	// NanoFlux provides a dedicated store
	var fusionStore = NanoFlux.getFusionStore();
	
	// subscription is the same as in NanoFlux, note that the function passes a state (which is immutable)
	var subscription = fusionStore.subscribe(this, function(state){
		// ... do something with the state
		// state is also available via fusionStore.getState()
		console.log("Items:", state.items);
	});
	
	// the 'fusionator' is responsible for the state manipulation
	// it is called with two arguments, the previous state
	// and an arguments array containing the arguments passed on actor call.
	NanoFlux.createFusionator({
		
		addItem : function(previousState, args){
			var currentItems = previousState.items ? previousState.items.slice() :[] ;
			currentItems.push(args[0]);
			return { items : currentItems };
		},
		removeItem : function(previousState, args){
			if (!previousState.items || previousState.items.length == 0) return {};

			var items = previousState.items.filter(function (item) {
				return item.name !== args[0].name;
			});
			return {items: items}
		}
	});
	
	// gets the fusion actors, i.e. have the same name as defined above
	var addItem = NanoFlux.getFusionActor("addItem");
	var removeItem = NanoFlux.getFusionActor("removeItem");
	
	// use the actors as simple action functions
	addItem({ name: "item1", value : 1 });
	addItem({ name: "item2", value : 2 });
	
	removeItem("item1");

```

## Immutability
The state passed on notification and/or `getState()` is immutable. Internally, [Object.freeze](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze) 
is used to (deeply) freeze the state making it immutable. For large nested states this will have an performance impact (tests will be made to quantify). 
Due to the use of `Object.freeze` the overall performance is not directly comparable with, e.g. nanoflux (which does not guarantee immutability), but should be still fast enough 
for most scenarios.

## Asynchronous Actions

*nanoflux-fusion* supports asynchronous actions out-of-the-box. If a Fusionator returns a promise instead of a state object,
the promise will be executed. The state shall be passed as argument of the resolver. Chaining is also possible. 
*nanoflux-fusion* aims to support all [A+ compliant](https://promisesaplus.com/) implementations. 
It is currently tested with the 

 - [native Promise-API](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise/)
 - [Q](https://github.com/kriskowal/q/)
 - [RSVP](https://github.com/tildeio/rsvp.js/)
 - [Bluebird](https://github.com/petkaantonov/bluebird/)
 
 ### Example
 
```javascript

function asyncA(arg1){
	return new Promise(function(resolve,reject){
		setTimeout(function(){
			// returns state to be merged
			resolve({a: arg1);
		}, 500)
	})
}
 
function asyncB(arg1){
	return new Promise(function(resolve,reject){
		setTimeout(function(){
			var newState = arg1;
			newState.b = 5 + arg1.a;
			resolve(newState);
		}, 500)
	})
}

var asyncFusionator = NanoFlux.createFusionator({
	
	simplePromise: function(prevState, args){
			return asyncA(args[0]); 
	}	
	chainedPromises: function(prevState, args){
		return asyncA(args[0]).then(function(data){
			console.log(data); // data = {a: 5} 
			return asyncB(data);  
		});
	}
});

var simplePromise = NanoFlux.getFusionActor("simplePromise");
var chainedPromises = NanoFlux.getFusionActor("chainedPromises");

// call the actions
simplePromise(5); // state will be { a: 5 }
chainedPromises(5); // state will be { a: 5, b: 10 }

```

## Compatibility

Compatible with: Chrome, Firefox, Opera, Edge 

*nanoflux-fusion* uses internally `Object.assign()` and `Object.freeze()`. While `Object.freeze` is supported since IE9, `Object.assign` was only introduced in EDGE.
Therefore, you need a [polyfill](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign#Polyfill) for older browsers. 
 
 TODO

- More examples
- Doc for project site


