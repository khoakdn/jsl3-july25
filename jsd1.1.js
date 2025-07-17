(function(exports){
	'use strict';
	const clientSide=exports==undefined;

	const sJslDoc=Symbol.for('javascript documentation');
	const sUses=Symbol('uses');
	const sUsedBy=Symbol('used by');
	const sSeeAlso=Symbol('see also');
	const sExamples=Symbol('examples');
	const sDefines=Symbol('defines');
	const sDefinedIn=Symbol('defined in');
	const sDefinedAs=Symbol('defined as');
	const sFlags=Symbol('flags');

	function uses(a,b,n){
		if(!(a && b)){
			//console.warn('uses');
			return;
		};		
		let aUses=a[sJslDoc].uses;//get the 'uses' function of a
		aUses[n]=b;
		if((typeof a == 'function') && a.name){
			let bUsedBy=b[sJslDoc].usedBy;
			bUsedBy[a.name]=a;
		}
	};

	function defines(a,b,n){
		if(!(a && b)){
			//console.warn('defines',{a,b,n});
			return;
		};
		let aDefines=a[sJslDoc].defines;//get the 'defines' function of a
		aDefines[n]=b;
		b[sDefinedIn]=a;
		b[sDefinedAs]=n;
	};

	function relevant(a,b,n){
		if(!(a && b)){
			//console.warn('can not add relevant',{a,b,n});
			return;
		};		
		let aSeeAlso=a[sJslDoc].seeAlso;//get the 'seeAlso' function of a
		aSeeAlso[n]=b;
		if((typeof a == 'function') && a.name){
			//console.warn('relevant',{a,b,n});
			let bSeeAlso=b[sJslDoc].seeAlso;//get the 'seeAlso' function of b
			bSeeAlso[a.name]=a;
		}
	};

	function example(a,b,n){
		if(!(a && b)){
			//console.warn('examples');
			return;
		};			
		let aExamples=a[sJslDoc].examples;//get the 'examples' function of a
		aExamples[n]=b;
	};
	const objectDoc={
		get raw(){
			const target=this.target;
			return	{
				uses	 :target[sUses],
				usedBy	 :target[sUsedBy],
				seeAlso	 :target[sSeeAlso],
				examples :target[sExamples],
				defines	 :target[sDefines],
				definedIn:target[sDefinedIn],
				definedAs:target[sDefinedAs],
				flags	 :target[sFlags]
			}
		},
		get flags(){
			const target=this.target;
			return	target[sFlags]||(target[sFlags]=function(flag,value){
				target[sFlags][flag]=value;
				return target;
			});
		},
		get defines(){
			const target=this.target;
			return target[sDefines]||(target[sDefines]=function(...args){//[title=target[sJslDoc].uses is a function and a storage]
				/** 
				*	@param	...args		each argument either a named function or an object who's members are cited by the target
				*	@return	the documentation target
				*	@note the 'defines' function itself is also the store for the used members
				*/
				for(let t,a,i=0,c=args.length; a=args[i], t=typeof a, i<c ;i++){
					if((t=='function')&&(a.name)){//[title=named function]
						defines(target,a,a.name);
					}else
					if(t=='object'){
						Object.keys(a).forEach(n=>defines(target,a[n],n));
					};
				};
				return target;
			});
		},
		get uses(){
			const target=this.target;
			return target[sUses]||(target[sUses]=function(...args){//[title=target[sJslDoc].uses is a function and a storage]
				/** 
				*	@param	...args		each argument either a named function or an object who's members are cited by the target
				*	@return	the documentation target
				*	@note the 'uses' function itself is also the store for the used members
				*/
				for(let t,a,i=0,c=args.length; a=args[i], t=typeof a, i<c ;i++){
					if((t=='function')&&(a.name)){//[title=named function]
						uses(target,a,a.name);
					}else
					if(t=='object'){
						Object.keys(a).forEach(n=>uses(target,a[n],n));
					};
				};
				return target;
			});
		},
		get usedBy(){
			const target=this.target;
			return target[sUsedBy]||(target[sUsedBy]=function(...args){//[title=target[sJslDoc].uses is a function and a storage]
				/** 
				*	@param	...args		each argument either a named function or an object who's members are cited by the target
				*	@return	the documentation target
				*	@note the 'uses' function itself is also the store for the used members
				*/
				console.assert(target.name);
				for(let t,a,i=0,c=args.length; a=args[i], t=typeof a, i<c ;i++){
					if(t=='function'){//[title=named function]
						uses(a,target,target.name);
					}else
					if(t=='object'){
						Object.keys(a).forEach(n=>uses(a[n],target.name));
					};
				};
				return target;
			});
		},
		get seeAlso(){
			const target=this.target;
			return target[sSeeAlso]||(target[sSeeAlso]=function(...args){//[title=target[sJslDoc].seeAlso is a function and a storage]
				/** 
				*	@param	...args	 each argument either a named function or an object who's members are relevant to the target
				*	@return	the documentation target
				*	@note the 'seeAlso' function itself is also the store for the relevant items
				*/
				for(let t,a,i=0,c=args.length; a=args[i], t=typeof a, i<c ;i++){
					if((t=='function')&&(a.name)){//[title=named function]
						relevant(target,a,a.name);
					}else
					if(t=='object'){
						Object.keys(a).forEach(n=>relevant(target,a[n],n));
					};
				};
				return target;
			})
		},
		get examples(){
			const target=this.target;
			return target[sExamples]||(target[sExamples]=function(...args){//[title=target[sJslDoc].examples is a function and a storage]
				/** 
				*	@param	...args	 each argument either a named function or an object who's members are examples of the target
				*	@return	the documentation target
				*	@note the 'examples' function itself is also the store for the relevant items
				*/
				for(let t,a,i=0,c=args.length; a=args[i], t=typeof a, i<c ;i++){
					if((t=='function')&&(a.name)){//[title=named function]
						example(target,a,a.name);
					}else
					if(t=='object'){
						Object.keys(a).forEach(n=>example(target,a[n],n));
					};
				};
				return target;
			})
		}
	};

	Object.defineProperty(Object.prototype,sJslDoc,{
		get(){
			return Object.setPrototypeOf({target:this},objectDoc);
		}
	});
	
	if(exports){
		exports.module=sJslDoc;
	}else{
		//console.log('b');
		let scriptTags = document.getElementsByTagName('script');
		let jsdNS=(/^.+\?ns=(\w+)/.exec(scriptTags[scriptTags.length - 1].getAttribute('src')||'')||[,'jsd'])[1];
		window[jsdNS]=sJslDoc;
	}	
	
})(typeof exports === 'undefined'? undefined: exports);