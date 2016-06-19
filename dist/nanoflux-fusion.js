!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.NanoFlux=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
(function (global){
!function(t){if("object"==typeof exports)module.exports=t();else if("function"==typeof define&&define.amd)define(t);else{var r;"undefined"!=typeof window?r=window:"undefined"!=typeof global?r=global:"undefined"!=typeof self&&(r=self),r.NanoFlux=t()}}(function(){return function t(r,n,e){function i(s,c){if(!n[s]){if(!r[s]){var u="function"==typeof _dereq_&&_dereq_;if(!c&&u)return u(s,!0);if(o)return o(s,!0);throw new Error("Cannot find module '"+s+"'")}var a=n[s]={exports:{}};r[s][0].call(a.exports,function(t){var n=r[s][1][t];return i(n?n:t)},a,a.exports,t,r,n,e)}return n[s].exports}for(var o="function"==typeof _dereq_&&_dereq_,s=0;s<e.length;s++)i(e[s]);return i}({1:[function(t,r,n){"use strict";function e(t,r){this.__dispatcher=t,this.__constructor(r)}e.prototype.__constructor=function(t){for(var r in t)t.hasOwnProperty(r)&&(this[r]=t[r])},e.prototype.dispatch=function(t,r){this.__dispatcher.dispatch(t,r)};var i={};r.exports={clear:function(){i={}},create:function(t,r,n){if(!t||0===t.length)throw"Empty names are not allowed";return i[t]=new e(r,n),i[t]},getActions:function(t){return i[t]}}},{}],2:[function(t,r,n){"use strict";function e(t){return Array.isArray(t)?t:[t]}function i(t){var r=this;this.__stores=[],this.__handlerMapCache={},this.__isDispatching=!1;var n=function(t){for(var n=e(t),i=0;i<n.length;++i)r.__registerAction(n[i])},i=function(){t&&n(t)};i()}function o(t,r){return t||(t=c),s[t]||(s[t]=new i(r)),s[t]}i.prototype.__getHandlerName=function(t){var r=this.__handlerMapCache[t];return r||(r="on"+t[0].toUpperCase()+t.substr(1),this.__handlerMapCache[t]=r),r},i.prototype.__callAction=function(){for(var t=this.__getHandlerName(arguments[0]),r=Array.prototype.slice.call(arguments,1),n=0;n<this.__stores.length;++n){var e=this.__stores[n];e[t]&&e[t].apply(e,r)}},i.prototype.__registerAction=function(t){this[t]||(this[t]=this.__callAction.bind(this,t))},i.prototype.connectTo=function(t){for(var r=e(t),n=0;n<r.length;++n)-1===this.__stores.indexOf(r[n])&&this.__stores.push(r[n])},i.prototype.dispatch=function(t,r){if(this.__isDispatching)throw"DISPATCH WHILE DISPATCHING: Don't trigger any action in your store callbacks!";try{this.__isDispatching=!0,this.__registerAction(t),this[t](r)}catch(n){throw console.error(n),n}finally{this.__isDispatching=!1}};var s={},c="__defDispatcher";r.exports={clear:function(){s={}},create:function(t,r){return o(t,r)},getDispatcher:function(t){return o(t)}}},{}],3:[function(t,r,n){"use strict";var e=t("./store"),i=t("./dispatcher"),o=t("./actioncreator");r.exports={reset:function(){i.clear(),e.clear(),o.clear()},createStore:function(t,r){return e.create(t,r)},createDispatcher:function(t,r){return i.create(t,r)},createActions:function(t,r,n){return o.create(t,r,n)},getDispatcher:function(t){return i.getDispatcher(t)},getStore:function(t){return e.getStore(t)},getActions:function(t){return o.getActions(t)}}},{"./actioncreator":1,"./dispatcher":2,"./store":4}],4:[function(t,r,n){"use strict";function e(t,r){var n=r,e=t;this.unsubscribe=function(){var t=r.indexOf(e);n.splice(t,1)}}function i(t){this.__constructor(t),this.__subscriptionList=[]}i.prototype.__constructor=function(t){for(var r in t)t.hasOwnProperty(r)&&(this[r]=t[r]);this.onInitialize&&this.onInitialize()},i.prototype.subscribe=function(t,r){var n={context:t,func:r};return this.__subscriptionList.push(n),new e(n,this.__subscriptionList)},i.prototype.notify=function(){for(var t=0;t<this.__subscriptionList.length;++t){var r=this.__subscriptionList[t];r.func.apply(r.context,arguments)}};var o={};r.exports={clear:function(){o={}},create:function(t,r){return o[t]=new i(r),o[t]},getStore:function(t){return o[t]}}},{}]},{},[3])(3)});
}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],2:[function(_dereq_,module,exports){
module.exports = _dereq_('./dist/nanoflux.min');
},{"./dist/nanoflux.min":1}],3:[function(_dereq_,module,exports){
var nanoflux = _dereq_('nanoflux');

var FUSION_STORE_NAME = "__fusionStore__";

function getFusionStoreDefinition(){

	function deepFreeze(obj) {
		var propNames = Object.getOwnPropertyNames(obj);

		propNames.forEach(function(name) {
			var prop = obj[name];
			if (typeof prop == 'object' && prop !== null)
				deepFreeze(prop);
		});

		return Object.freeze(obj);
	}

	var stateHolder = {
		immutableState : {},
		setState : function(newState){
			deepFreeze(newState);
			this.immutableState = newState;
		}
	};

	return {
		on__fuse : function(args){
			var state = {};

			Object.assign(state, stateHolder.immutableState, args.fuse.call(null, stateHolder.immutableState, args.action));
			stateHolder.setState(state);

			this.notify(stateHolder.immutableState);
		},
		getState : function(){
			return stateHolder.immutableState;
		}
	}
}



function createFusionStore(){
	var store = nanoflux.createStore(FUSION_STORE_NAME, getFusionStoreDefinition());
	nanoflux.createDispatcher(null, ['__fuse']).connectTo(store);
}

// extend nanoflux interface
nanoflux.getFusionStore = function(){ return nanoflux.getStore(FUSION_STORE_NAME) };
nanoflux.createFusionActor = function(fuseFunc, actorId){
	return function(){
		nanoflux.getDispatcher().__fuse({
			fuse: fuseFunc,
			action: {
				id : actorId,
				args : arguments
			}
		})
	}
};

// override for tests
var baseReset = nanoflux.reset;
nanoflux.reset = function(){
	baseReset();
	createFusionStore();
};

createFusionStore();

module.exports = nanoflux;

},{"nanoflux":2}]},{},[3])
(3)
});