(function jsl_module(){/**
* JavaScript Language Transformations and Templating  | JSL-2020-beta
*	
*	<a href="http://jsl3.codemax.net/jsl3.1.js">http://jsl3.codemax.net/jsl3.1.js</a>
*	<a href="http://jsl3.codemax.net/">http://jsl3.codemax.net/</a>
*	
* 	
*	version	: 3.1 stable release 
*	author	: dr. G.Metaxas
* 	Copyright 2020 Ambianti B.V.
* 	
*	Permission is hereby granted, free of charge, to any person obtaining a copy of this software and 
*	associated documentation files (the "Software"), to deal in the Software without restriction, 
*	including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, 
*	and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, 
*	subject to the following conditions:
*	
*	The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*	
*	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
*	INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
*	IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
*	WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
*	SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*	
*/
	'use strict';	
	console.warn('JSL3.1 https://jsl3.codemax.net');		
	const defs={//[collapsed][title=html tag definitions]
		fragment:{},//not standard, but useful ;-)
		a:{}, abbr:{}, address:{}, area:{singleton:true}, article:{}, aside:{}, audio:{}, 
		b:{}, base:{singleton:true}, bdi:{}, bdo:{}, blockquote:{}, body:{}, br:{singleton:true}, button:{}, 
		canvas:{}, caption:{}, cite:{}, code:{}, col:{singleton:true}, colgroup:{}, 
		data:{}, datalist:{}, dd:{}, del:{}, dfn:{}, dialog:{} ,div:{}, dlist:{}, dl:{}, dt:{}, details:{},
		em:{}, embed:{singleton:true}, fieldset:{}, figcaption:{}, figure:{}, footer:{}, form:{}, 
		h1:{}, h2:{}, h3:{}, h4:{}, h5:{},h6:{}, head:{}, header:{}, hr:{singleton:true}, html:{}, 
		i:{}, iframe:{}, img:{singleton:true}, input:{singleton:true}, ins:{}, kbd:{}, keygen:{singleton:true}, label:{}, legend:{}, li:{}, link:{singleton:true}, 
		main:{}, map:{}, mark:{}, meta:{singleton:true}, menu:{}, meter:{}, nav:{}, noscript:{}, object:{}, ol:{}, optgroup:{}, option:{}, output:{}, 
		p:{}, param:{singleton:true}, pre:{}, progress:{}, picture:{}, q:{}, rb:{}, rp:{}, rt:{}, rtc:{}, ruby:{},
		s:{}, samp:{}, script:{}, section:{}, select:{}, slot:{}, small:{}, source:{singleton:true}, span:{}, strong:{}, style:{}, sub:{}, sup:{}, summary:{},
		table:{}, tbody:{}, td:{}, template:{}, textarea:{}, tfoot:{}, th:{}, thead:{}, time:{}, title:{}, tr:{}, track:{singleton:true}, 
		u:{}, ul:{}, "var":{}, video:{}, wbr:{singleton:true}, 
	};
	for(let m in defs){
		defs[m].name=m;
		defs[m].tagName=m.toUpperCase();
	};
	defs.fragment.tagName=undefined;
	
	
	const kebabCaseToCamelCaseRegExp=/(?:\W)(\w)/g;
	const kebabCaseToCamelCase=(str)=>str.replace(kebabCaseToCamelCaseRegExp, (s, x, i)=> x.toUpperCase());
	const camelCaseToKebabCaseRegExp=/([^A-Z])([A-Z])/g;
	const camelCaseToKebabCase=(str)=>str.replace(camelCaseToKebabCaseRegExp, (s, x, y, i)=> x+'-'+y.toLowerCase());
	const dataAttrNameRegExp=/^data\-\w/;
	const enumeratedBooleanAttributes={//[title=enumerated boolean attributes]
		contenteditable:true,//true,false,inherit
		spellcheck:true,//true,false
		draggable:true//true,false https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/draggable#sect1
	}
	const typeIsObjectOrFunction={
		'function'	:true,
		'object'	:true
	};

	const globalObject=(()=>{
		Object.defineProperty(Object.prototype,'_global_object_for_js_',{
			configurable:true,
			get(){
				return this;
			}
		});
		const ret=_global_object_for_js_;
		delete Object.prototype._global_object_for_js_;	
		return ret||globalThis;//safari fix 2023-12-12 (globalThis is needed on Safari)
	})();
	const clientSide=(typeof document == 'object'),jslGlobalOptions={builderSyntax:true};

	function scriptTag(){//[collapsed][experimental]
		/**
		*	Return the script the last <i>script</i> element in the document.
		*	While the document is loading when we invoke this from within a &lt;script> element.
		*	X should be the last of &lt;script> elements...
		*	This allows to have "inline" scripts that are aware of their dom placement.
		*/
		if(!clientSide){
			return null;
		}
		if(document.readyState!="loading"){
			/*in runtime we can not identify the script source that invoked jsl.transform or any other function*/
			return null;
		}
		var scriptTags = document.getElementsByTagName('script');
		return scriptTags[scriptTags.length - 1];
	};
	
	if(clientSide){//[title=initialize JSL for client-side]
		const bool={true:true,false:false,yes:true,no:false,on:true,off:false};
		try{//[title=load the jslGlobalOptions from the src attribute of the loading script]
			const jslScriptTag=scriptTag();
			const src=jslScriptTag.getAttribute('src');
			const ver=/[a-zA-Z_]+(\d*(?:\.\d+){0,1})\.js(?:\?(.*)){0,1}/.exec(src||"");
			const opt=(ver[2]||'').split('&');
			for(let i=0;i<opt.length;i++){
				let prop=opt[i].split('=');
				if(!prop[0]){
					//
				}else
				if(prop.length==1){//treat presense as true
					jslGlobalOptions[kebabCaseToCamelCase(prop[0])]=true;
				}else{
					let b=bool[prop[1]];
					jslGlobalOptions[kebabCaseToCamelCase(prop[0])]=(b===!!b)?b:prop[1];
				}
			};
			jslGlobalOptions.version=parseFloat(ver[1]);
		}catch(e){
			console.error("jsl initialization error",e);
		};//
		console.log(jslGlobalOptions);
		//exportJSL(window,window,jslGlobalOptions);//
	}else{//[title=on the server-side the init function must be called externaly]
		//exports.init=exportJSL;
	};	
	const jslNamespace=jslGlobalOptions.jslns||'jsl';
	console.warn('JSL namespace set to "'+jslNamespace+'". The identifier "'+jslNamespace+'" is reserved as the JSL framework proxy in all javascript objects.');
	
	const builderSyntaxEnabled=!!jslGlobalOptions.builderSyntax;
	console.log('builderSyntaxEnabled',builderSyntaxEnabled);
	const sGetAtt=Symbol('get attribute value');
	const escapeContent=(function(){
		const regEx=/\&|\<|\>/g;
		const regRp={'&':'&amp;', '<':'&lt;', '>':'&gt;'};
		const regFn=(n)=>regRp[n];
		return (s)=>String(s).replace(regEx,regFn);
	})();	
	const escapeAtt=(function(){
		const regEx=/\&|\<|\>|"/g;
		const regRp={'&':'&amp;', '<':'&lt;', '>':'&gt;', '\"':'&quot;'};
		const regFn=(n)=>regRp[n];
		return (s)=>String(s).replace(regEx,regFn);
	})();
	function objectToStyle(v){
		let V=Array.isArray(v)?v:[v];
		let s='';
		for(let i=0,u,c=V.length; v=V[i],i<c; i++){
			Object.keys(v).forEach(m=>{
				s+=camelCaseToKebabCase(m)+': '+(Array.isArray(u=v[m])?u.join(' '):u)+';';
			});			
		};
		return s;		
	}
	
	const Generator=(function*(){}).prototype.constructor;
	const AsyncFunction=(async function(){}).constructor;//2023-12-12 async function as event handlers in tag functions
	var nextIdSuffix=1,refs=[];
	
	function o2r(o){//[collapsed][title=object to reference]
		let i=refs.push(o)-1;
		return	(jslNamespace+'.refs['+i+']');//+(jsl_options_debug_info?'/*'+ (o.name||o.toString().replace(/\/\*/g,'**')) +'*/':'');
	}
	function argsToString(args,leadingComma){/*convert the arguments to a javascript string that can be used to construct a function call*/
		let s='';
		for(let v,t,c=args.length,i=0; v=args[i], t=typeof v, i<c ;i++){ 
			(leadingComma || i) && (s+=', '); 
			if(v && ( (t=='object') || (t=='function') ) ){
				if(clientSide/* && !directiveStack[sImpersonateServer]*/){//client side doesn't need to make a persistent state of the object
					s+=o2r(v);
				}else{//server side must make a persistent state of the object. bound functions will not make it....
					if(t=='function'){
						if(v.name && !v.hasOwnProperty('prototype')){
							console.warn('bound functions on the server-side can not be executed on the client!',v);
						};
						s+=v.toString();
					}else{
						s+=JSON.stringify(v);
					}
				}
			}else
			if(t=='string'){//strings
				s+=JSON.stringify(v);
			}else{//all the rest
				s+=v;
			};
		};
		return s;
	}	
	
	const sExtractComments=Symbol();
	Function.prototype[sExtractComments]=function extractComments(indent){
		/**
		*	extracts the first multiline comments of the functions provided as arguments
		*	handy to produce html content without using strings;)
		*	we rely ofcourse that the javascript engine will keep the 
		*	comments in the function.toString()
		*/
		var e=/(?:[^\/])+\/\*([^]+?)(?=\*\/)\*\//.exec(this.toString());
		e= e && e[1] || '';
		!indent || e && (e=e.replace(/^[\*\s\r\n]*/,'').replace(/\n\s*\*\s/g,'\n'));
		return e;
	};	
	
	function JslObjBuilder(tagName,singleton,parent){
		switch(typeof tagName){
		case 'function'	:
			this.targetFunction=tagName;
		break;
		case 'object'	:
			this.targetObject=tagName;
			console.assert(singleton===undefined);
			console.assert(parent===undefined);				
		break;
		default:
			if(tagName){
				this.tag=tagName;
				this.singleton=singleton;
				this.atts={};
			};			
		}
		this.clr();
		this.ref=1;
		this.parent=parent;
		this.stream=parent && parent.stream;
	};	
	const sBefore=Symbol("contents before"),sAfter=Symbol("contents after");
	const sJslObjBuilder=Symbol.for('jsl object builder instance');//2023-03-31, so that we can tell externaly if an object is produced by jsl
	JslObjBuilder.prototype={
		[sJslObjBuilder]:true,
		constructor:JslObjBuilder,
		refs:refs,	
		toString(){
			/**
			*	Converts the current jsl context to valid HTML markup.
			*/
			let stream=this.stream;
			if(stream && this.bodyFlushed){
				return '';
			};
			if(stream && this.attsFlushed){
				console.assert(this.tag && !this.singleton);
				if(stream && this.bodyPending){//fix 20221215
					return '';
				};
				return (this.bodyFlushed=true),'</'+this.tag+'>';
			}else{
				let tag=this.tag,contents=builderSyntaxEnabled?this.contents.join(''):this.contents;
				if(!tag){
					stream && (this.bodyFlushed=true);
					return (this[sBefore]||'')+contents+(this[sAfter]||'');
				};
				let atts=this.atts;
				let r='<'+tag;
				for(let k in atts){
					let v=String(atts[k]);
					r+=' '+k+(v.length?'="'+ escapeAtt(v)/*v.replace(/"/g,"&quot;")*/ +'"':'');
				};
				if(stream){
					r+=this.singleton?(this.bodyFlushed=true,'/>'):'>';
					return (this.attsFlushed=true),r;
				}
				r+=(this.singleton && !contents)?'/>':('>'+ contents + '</'+tag+'>');
				return (this[sBefore]||'')+r+(this[sAfter]||'');				
			}
		},
		clr(){
			/**
			*	Clears the contents of the current jsl context.
			* 	@return The value of the specified attribute			
			*	@note	Builder-syntax method.
			*/
			this.contents=builderSyntaxEnabled?[]:'';
			return this;
		},			
		has(n){
			return this.atts && this.atts.hasOwnProperty(n);
		},
		get(n){
			/**
			*	Returns the value of an attribute of the current jsl context.
			*	@param	n 	The name of the attribute
			* 	@return The value of the specified attribute
			*/
			return this.atts && this.atts[n];
		},
		set(n,v){
			/**
			*	Assigns a value to an attribute of the current jsl context.
			*	@param	n 	The name of the attribute
			*	@param	v 	The value of the attribute 
			*	@return The new value of the attribute
			*/
			if(n[0]=='#'){//when live change the property instead of the attribute...
				n=n.substr(1);
			};
			console.assert(n!='id' || !this.atts.id);
			return this.atts && (this.atts[n]=v);
		},
		del(n){//[title=.del()]
			/**
			*	Deletes the specified attribute from the current jsl context.
			*	@param	n 	The name of the attribute to delete
			*	@return <i>this</i> object (i.e. the current jsl context)
			*/
			return delete this.atts[n],this;//fix 2024-03-09 (return was missing)
		},
		att(n,v=sGetAtt,concat=true,u=concat && this.get(n)||''){//[title=.att()]
			/**
			*	Retrieves or modifies an attribute of the current jsl context.
			*	@param n		the name of the attribute
			*	@param v		the new value of the attribute
			*	@param concat	when true the new value is concatenated to the old one(if defined), when false the new value replaces the old one.
			*	@return <i>this</i> object (i.e. the current jsl context)
			*/
			n=camelCaseToKebabCase(n);
			if(v===sGetAtt){
				return this.has(n)?this.get(n):undefined;
			}else
			if((v === undefined) || (v === null) || ((v === false) && !enumeratedBooleanAttributes[n])){
				this.del(n);
			}else
			if((v === true) && !enumeratedBooleanAttributes[n]){
				this.set(n, '');//this allows to evaluate as true, and to continue with concat ;-)
			}else
			if(Array.isArray(v)){
				if(n=='style'){
					this.set(n, u + objectToStyle(v));
				}else{
					this.set(n, u + v.join(' ') );
				}
			}else
			switch(typeof v){
				case 'function':
					if(clientSide){
						this.set(n, u + o2r(v)+'.call(this,event);');	
					}else{
						this.set(n, u + jslGlobalProxy.listener(v));
					}
				break;
				case 'object':
					if(v instanceof JslObjBuilder){//send to parent
						v.attName=n;
						this.add(v);
					}else
					if(n=='style'){						
						this.set(n, u + objectToStyle(v));
					}else{
						this.set(n, u + JSON.stringify(v));
					};
				break;
				default:
					u && (n=='class') && (u+=' ');//2023-03-11
					this.set(n, u + v );
			};
			return this;
		},
		get bof(){
			/**
			*	Set's the insertion point to the beggining of the current jsl context.
			*	@return <i>this</i> object (i.e. the current jsl context)			
			*/
			return this.ref=0, this;
		},
		set bof(v){/**
			*	Inserts the specified value in the beggining of the current jsl context
			*/
			this.bof.all([v]);
		},
		get eof(){
			/**
			*	Set's the insertion point to the end of the current jsl context.
			*	@return <i>this</i> object (i.e. the current jsl context)			
			*/
			return this.ref=1, this;
		},
		set eof(v){
			/**
			*	Appends the specified value to the end of the current jsl context
			*/
			this.eof.all([v]);
		},
		get inner(){
			/**
			*	Clears the contents, and set's the insertion point to the end of the current jsl context.
			*	@return <i>this</i> object (i.e. the current jsl context)			
			*/		
			return this.ref=1, this.clr();
		},
		set inner(v){
			/**
			*	Replaces the contents of the current jsl context with the specified value
			*/		
			this.inner.all([v]);
		},
		get outer(){
			delete this.tag;
			delete this.atts;
			delete this.sinksForParent;			
			return this.clr();
		},
		set outer(v){
			/**
			*	Replaces the outer html of the current jsl context with the specified value
			*	@return <i>this</i> object (i.e. the current jsl context)			
			*/			
			this.outer.all([v]);
		},
		get after(){
			/**
			*	Set's the insertion point after the current jsl context.
			*	@return <i>this</i> object (i.e. the current jsl context)			
			*/		
			return this.ref= 2, this;
		},
		set after(v){
			/**
			*	Appends the specified value after the current jsl context
			*/		
			this.after.all([v]);
		},
		get before(){
			/**
			*	Set's the insertion point before the current jsl context.
			*	@return <i>this</i> object (i.e. the current jsl context)			
			*/		
			return this.ref=-1, this;
		},
		set before(v){
			/**
			*	Inserts the specified value before the current jsl context
			*/		
			this.before.all([v]);
		},	
		get serial(){
			/**
			*	The serial mode instructs jsl to flush on the target object the html markup directly as it is generated.
			*	This allows to make big pages produced on the <b>server</b> more responsive, and to start returning content to the client before the full response body is available.
			*	At the same time the server saves resources since it does not accumulate first the response in memory.
			*/
			console.assert(this.targetObject && this.targetObject.write);
			return (this.stream=this.targetObject),this;
		},
		set serial(v){
			console.warn('kinda stupid... better use .serial.TAG()...etc')
			this.serial.all([v]);
		},
		raw(v){//[title=.raw()]
			/*
			*	Inserts a value as raw content to the current jsl context. 
			*	@param v	The value to be added as raw content.
			*	@return <i>this</i> object (i.e. the current jsl context)						
			*/		
			if(this.stream){
				let s=this.toString();
				return s && this.stream.write(s),v && this.stream.write(String(v)),this;
			}
			if((v===undefined)||(v===null)||(v==='')){
				return this;
			};			
			if(builderSyntaxEnabled){
				switch(this.ref){
					case -1:this[sBefore]=(this[sBefore]||'')+v;break;//(this[sBefore]||(this[sBefore]=[])).push(v);break;
					case  0:this.contents.splice(0,0,v);break;
					case  1:this.contents.push(v);break;
					case  2:this[sAfter]=v+(this[sAfter]||'');break;//(this[sAfter]||(this[sAfter]=[])).splice(0,0,v);break;
				}
			}else{
				switch(this.ref){
					case -1:this[sBefore]=(this[sBefore]||'')+v;break;
					case  0:this.contents=v+this.contents;break;
					case  1:this.contents=this.contents+v;break;
					case  2:this[sAfter]=v+(this[sAfter]||'');break;
				}
			};		
			return this;
		},		
		txt(v){//[title=.txt()]
			/**
			*	Inserts a value as text content to the current jsl context. 
			*	@param v	The value to be added as text content.
			*	@return <i>this</i> object (i.e. the current jsl context)									
			*/
			return this.raw(escapeContent(v));
		},
		add(u){
			/**
			*	Inserts a jsl fragment in this one
			*	@param u	The jsl fragment to insert
			*	@return <i>this</i> object (i.e. the current jsl context)									
			*/
			u.parent=this;
			let childSinks=u.sinksForParent;
			for(let j=0,c=childSinks && childSinks.length;j<c;j++){
				let childSink=childSinks[j];childSink[childSink.length-1].attName=u.attName;
				this.sinkFor.apply(this,childSinks[j]);	
			};
			return this.raw(u);
		},
		end(){//[title=.end()]
			/**
			*	Add this jsl context to its parent's contents and return the parent.
			*	@return the parent jsl context of <i>this</i> object.
			*/
			if(this.stream){
				for(let s; s=this.toString(); ){//make sure atts && body are flushed
					this.stream.write(s);
				};
				return this.parent || (this.stream.end?this.stream.end():new JslObjBuilder(this.stream).serial);
			}else
			if(!this.parent && this.targetObject && this.targetObject.write && this.targetObject.end){
				//!clientSide || console.warn('Shall we allow this on the client-side?');
				return this.targetObject.end();
			};
			return (this.parent && this.parent.add(this)) || new JslObjBuilder().add(this);
		},
		run(f){//[title=.run()]
			/**
			*	Invoke the specified function in the current jsl context.
			*	The <i>this</i> keyword inside <i>f</i> is set to the current jsl context on which <i>run</i> is called.
			*	@param f The function to invoke.
			*	@return <i>this</i> object (i.e. the current jsl context)			
			*/
			return f.call(this),this;
		},
		all(V,f){//[title=.all()]
			/**
			*	Enumerates the members of the collection V and adds them to the current context.
			*	If a tranformation function <i>f(value,key,collection,index)</i> is provided then the result of applying this function on each member is added instead.
			*	The <i>this</i> keyword inside <i>f</i> is set to the current jsl context on which <i>all</i> is called.
			*	@param	V a collection (array or object) who's members are enumerated.
			*	@param	f an optional tranformation function that is applied on the members of V.
			*	@return <i>this</i> object (i.e. the current jsl context)						
			*/
			let isFragment=!this.tag,isScript=!isFragment && (this.tag=='SCRIPT'),isStyle=!isScript && (this.tag=='SCRIPT');
			for(let v,k,i=0,K=Array.isArray(V)?V:Object.keys(V),c=K.length; i<c; i++){
				v=V[k=K==V?i:K[i]]; !f || (v=f.call(this,V[k],k,V,i)); 
				while((v!==undefined)&&(v!==null)&&(v!=='')){
					switch(typeof v){
					case 'function'	:
						if(isScript){
							if(v.name){//[title=named arrow ir normal function or  function, copy in script tag]
								if(v.hasOwnProperty('prototype')){//[title=named normal function]
									this.raw('\n'+v.toString()+';\n');
								}else{//[title=named arrow function, or bound function]
									this.raw('\nconst '+v.name+'='+v.toString()+';\n');//bound functions will raise runtime error
								};						
							}else{//[title=anonymous function(hence unbound), make expression]
								this.raw('\n('+ v.toString() +')();\n');
							};							
						}else					
						if(v.name && (v.hasOwnProperty('prototype')||(v.constructor==AsyncFunction))){//[title=named function, or async function(//2023-12-12 async function as event handlers in tag functions)]
							this.att(v.name,v);
						}else{//[title=anonymous or bound function]
							let g=v;((v=g.call(this,k))!==g)||(v=g.toString());
							continue;
						};
					break;
					case 'object'	:
						if(v instanceof JslObjBuilder){
							this.add(v);
						}else
						if(Array.isArray(v)){
							this.all(v,null);
						}else
						for(let n in v){
							this.att(n,v[n]);
						};
						if(v.valueOf(v)===v){//2023-03-24 
							break;//let primitive objects pass
						};//otherwise we have a number or a string or a boolean Object
					default:
						(isStyle||isScript) && this.raw(v) || this.txt(v);
					};
					v=undefined;
				};
			};
			return this;
		},	
		sinkFor(...args){//[title=.sinkFor()]
		/**
		*	Registers a function(last argument) as an event sink for the specified event sources(arguments 1 .. to N-1).
		*	If an event source argument is a JavaScript Promise then it is treated as valid jsl event source 
		*		that triggers when the promise is resolved or rejected with arguments <i>(err,res)</i> where <i>err</i> and <i>res</i> are the promise's outcome
		*	If an event source argument is not a valid jsl.eventSource, then the event-sink is called directly.		
		*	@param	...args		arg1...argN-1 : event-sources, argN : function to register as a sink to the specified sources		
		*/
			console.assert(clientSide);				
			if(!this.tag){//fragment
				this.sinksForParent||(this.sinksForParent=[]);
				this.sinksForParent.push(this.targetFunction?args.concat(this.targetFunction):args);
				return this;
			};
			let c=args.length-1,f=args[c];
			let id=this.get('id') || this.set('id',this.tag+'_'+ (++nextIdSuffix));
			if(f.constructor===Generator.constructor){
				let generator=f;
				f=function(...args){
					let r=generator.apply(this,args),first=r.next();//get the first yield outcome directly, 
					if(!first.done){//if the generator is not done process the rest outcomes in the message loop 
						let h=setInterval(()=>{r.next().done && clearInterval(h);},0);	
					}					
					return first.value;
				};
			};
			if(f.attName){
				let fn=f;
				f=function(...args){
					this[jslNamespace].att(fn.attName,fn.apply(this,args),false);
				}
			};			
			for(let src,i=0; src=args[i], i<c; i++){	
				if(src instanceof Promise){//make an event-source for the promise
					let promise=src;
					src=jslGlobalProxy.eventSource();
					promise.then(res=>src(null,res)).catch(err=>src(err,null));
				};
				if(typeof src == 'function'){
					src.sinks && src.sinks.push([f,id]) || console.warn('invalid event-source',src);
				}else{
					let ret=f.call(this,src);
					if(ret!=undefined){
						this.all([ret]);
					}
				}
			}
			return this;
		},
		get CDATA(){
			if(this.targetFunction){
				return this.txt(this.targetFunction[sExtractComments]());
			};
		},
		get RDATA(){
			if(this.targetFunction){
				return this.raw(this.targetFunction[sExtractComments]());
			};
		},
		transform(...args){//[title=jsl.transform()]
			/**
			*	Appends the arguments to the current global JSL target.			
			*/
			return this.all(args);
		},		
	}
	
	function JslDomBuilder(element,ref=null,parent=null){
		this.targetObject=element;
		this.element=element;
		this.ref=ref;
		this.parent=null;
	};
	
	const cOutOfSyncProperties={/*
			when we use an even sink attached to an attribute we want to make live changes.
			But if we set the attribute value we might not get the desired result....
			Some known cases are below:
		*/
		value:1,checked:1,selected:1,href:1,src:1,disabled:1,readonly:1,placeholder:1
	};
	
	JslDomBuilder.prototype={
		constructor:JslDomBuilder,
		get tag(){
			return this.element.tagName;
		},	
		clr(){
			return	this.sinksForParent=[],this.element.innerHTML='',this;
		},		
		toString(){
			return this.element.outerHTML;
		},
		end(){
			if(this.parent){
				return this.parent.add(this);
			}else
			if(this.element.parentNode){
				return new JslDomBuilder(this.element.parentNode).add(this);
			}else{
				return new JslObjBuilder().add(this);
			}
		},
		get bof(){
			return this.ref=this.element.firstChild, this;
		},
		set bof(v){
			this.bof.all([v]);
		},		
		get eof(){
			return this.ref=null, this;
		},	
		set eof(v){
			this.eof.all([v]);
		},	
		get inner(){
			return this.ref=null, this.clr();
		},
		set inner(v){
			this.inner.all([v]);
		},
		get outer(){
			let p=this.element.parentNode,n=this.element.nextSibling;
			return p.removeChild(this.element),new JslDomBuilder(p,n);
		},
		set outer(v){			
			this.outer.all([v]);
		},
		get before(){
			return new JslDomBuilder(this.element.parentNode,this.element,this);
		},
		set before(v){
			this.before.all([v]);
		},
		get after(){
			return new JslDomBuilder(this.element.parentNode,this.element.nextSibling,this);
		},
		set after(v){
			this.after.all([v]);
		},
		raw(v){
			if((v===undefined)||(v===null)||(v==='')){
				return this;
			};			
			let range=document.createRange();range.selectNodeContents(this.element);
			return this.element.insertBefore(v.element || range.createContextualFragment(v),this.ref), this;
		},		
		txt(v){
			if((v===undefined)||(v===null)||(v==='')){
				return this;
			};			
			return this.element.insertBefore(document.createTextNode(v),this.ref), this;
		},
		//non - builder!
		has(n){
			return this.element.hasAttribute(n);
		},
		get(n){
			return this.element.getAttribute(n);
		},
		set(n,v){
			if(n[0]=='#'){//change the property instead of the attribute...
				return (this.element[n.substr(1)]=v), v;
			};
			return this.element.setAttribute(n,v), v;
		},
		del(n){
			return delete this.element.removeAttribute(n), this;//fix 2024-03-09 (return was missing)
		},		
	};	
	Object.setPrototypeOf(JslDomBuilder.prototype,JslObjBuilder.prototype);	
	
	var autoCloseWarnings=1;
	function registerTag(tagDef,tagNamespace){
		//console.log(tagDef);
		let tagName=tagDef.tagName;
		if(!tagName)return;
		let tagFunction=({[tagName]:function(...args){//[title=Tag functions]
			/**	Every HTML Element has a corresponding <big>JSL<sub>3</sub></big> <i>tag-function</i>. 
			*	The tag-functions take any number of arguments and return the corresponding HTML.
			*	HTML content can be produced by calling and nesting these tag-functions.		
			*	
			*	For example the statement:<pre style="margin:0">
			* &Tab;jsl=<b>UL</b>({<b>class</b>:'red-text'},
			* &Tab;&Tab;<b>LI</b>('Lorem ipsum'),
			* &Tab;&Tab;<b>LI</b>('Dolor sit amet')
			* &Tab;)
			*	</pre> 
			* 
			* 	Appends in the end of the document body the HTML markup:<pre style="margin:0">
			* &Tab;&lt;<b>UL</b> <b>class</b>="red-text"&gt;
			* &Tab;&Tab;&lt;<b>LI</b>&gt;Lorem ipsum&lt;/<b>LI</b>&gt;
			* &Tab;&Tab;&lt;<b>LI</b>&gt;Dolor sir amet&lt;/<b>LI</b>&gt;
			* &Tab;&lt;/<b>UL</b>&gt;
			*	</pre>
			*	@param ...args		The contents of the tag-function
			*	@return	A JSL object that correspons to the markup. This object can be assigned to a designator such as the global jsl proxy and then it is converted to the corresponding DOM elements.
			*/
			//let node=builderSyntaxEnabled && this instanceof JslDomBuilder?new JslDomBuilder(document.createElement(tagName)):new JslObjBuilder(tagName,tagDef.singleton);
			if(this && this.stream && !this.attsFlushed){//just make sure we flush our attributes
				this.raw('');
			};			
			let ret=new JslObjBuilder(tagName,tagDef.singleton,this instanceof JslObjBuilder?this:undefined);
			{//fix 20221215 (builder mixed in serial mode, tag was closing prematurelly )
				ret.bodyPending=true;
				ret.all(args);
				ret.bodyPending=false;
			}
			return tagDef.singleton?ret.end():ret;
		}})[tagName];
		builderSyntaxEnabled && Object.defineProperty(JslObjBuilder.prototype,'$'+tagName,{
			configurable:true,
			get(){
				if(tagDef.singleton){
					autoCloseWarnings && autoCloseWarnings-- && console.warn('singleton tags close automatically!');
					return this;
				};
				let n=this;for(; n.tag && (tagName != n.tag); n=n.end());
				console.assert(n.tag == tagName,'can not match closing ',tagName);
				return n.end();
			}
		});			
		return tagNamespace[tagName]=JslObjBuilder.prototype[tagName]=tagFunction;	
	}
		
	Object.defineProperty(JslObjBuilder.prototype, jslNamespace, {
		get(){
			if(!this.element && this.atts && this.atts.id){
				let element=document.getElementById(this.atts.id);
				if(element)return element[jslNamespace];
			};
			return this;
		},
		set(v){
			this[jslNamespace].clr().all([v]);
		}		
	});
		
	Object.defineProperty(Function.prototype, jslNamespace, {
		get(){
			return new JslObjBuilder(this);
		}
	});			
		
	Object.defineProperty(Object.prototype, jslNamespace, {
		get(){
			if(typeof this.write === 'function'){
				let ret=new JslObjBuilder(this);
				ret.raw=v=>(this.write(String(v)),ret);
				return ret;
			};
			return new JslObjBuilder(this);
		},
		set(v){
			if(typeof this.write === 'function'){
				this[jslNamespace].all([v]);
			};			
		}		
	});

				
	clientSide && Object.defineProperty(String.prototype, jslNamespace, {
		get(){
			return new JslDomBuilder(document.querySelector(this));
		},
		set(v){
			this[jslNamespace].clr().all([v]);
		}
	});	
	
	clientSide && Object.defineProperty(Document.prototype, jslNamespace, {
		get(){
			if((this===document)&&(this.readyState=='complete')){
				return new JslDomBuilder(this.documentElement);
			}else{
				let ret=new JslObjBuilder(this);
				ret.raw=v=>(this.write(v),ret);
				return ret;
			};
		},
		set(v){
			if(typeof this.write === 'function'){
				this[jslNamespace].all([v]);
			};			
		}		
	});
	
	clientSide && Object.defineProperty(Element.prototype, jslNamespace, {
		get(){
			return new JslDomBuilder(this);
		},
		set(v){
			this[jslNamespace].clr().all([v]);
		}
	});	
	
	function unindentSource(s){
		s=String(s);
		let lastLine=/\n[^\n]*$/g.exec(s);
		let lnIndent=lastLine && /^\n\s+/.exec(lastLine[0]);
		return lnIndent?s.replace(new RegExp(lnIndent[0],'g'),'\n'):s;
	}		
	const jslGlobalProxy={		
		defs: defs,
		refs: refs,
		module: jsl_module,
		transform(...args){//[title=jsl.transform()]
			/**
			*	Appends the arguments to the current jsl target.	
			*	{@note this function is depricated}			
			*/
			return (jslGlobalProxy.target||document)[jslNamespace].all(args);//,globalJslProxy.clr();
		},
		set outer(v){
			let script=scriptTag();
			if(script){//use the script element as target
				script[jslNamespace].outer=v;
			}else{
				this.transform(v);
			}
		},		
		listener(...args){//[title=jsl.listener()]
			/** Binds a method a number of params, so that it can be used as an event-listener.
			*	The jsl.listener can be avoided easily on the client using javascript closures.
			*	On the server-side however it is the only way to produce an event handler that is aware of a context 
			*	The last argument is the event handler method, the first N-1 arguments are bundled with the handler.
			*	The onevent attribute ressembles <i>onevent="lastArgument.call(this,event,arg1,...,argN-1)"</i>
			*	@param	...args	arg1...argN-1,lastArgument
			*	@return	a value that can be used for an onevent	attribute
			*/
			let f=this.targetFunction||args.pop(),s=argsToString(args,true);
			if(clientSide/* && !directiveStack[sImpersonateServer]*/){
				console.warn(
					'jsl.listener on client-side may deter performance!\
					In most cases you can use the javascript closures to avoid using this method.'
				);
				//f=o2r(f);
				f='('+f+')';
			}else{
				f='('+f+')';
			};
			return (f+'.call(this,event'+s+');');
		},//[sJslDoc].uses({argsToString}),
		javascript:function javascript(...args){//[title=jsl.javascript()]
			/**
			*	Script generated with the <i>SCRIPT</i> tag-function, can be bound to a part of the lexical scope using this utility function.
			*/
			if(clientSide){// && !directiveStack[sImpersonateServer]){
				console.warn('jsl.javascript on client-side may deter performance!\nIn most cases you can use the javascript closures to avoid using this method.');
			};
			let f=unindentSource(this.targetFunction||args.pop()),s=argsToString(args,true);
			return '\r\n'+'('+f+').call(this'+s+');\r\n';
		},//[sJslDoc].uses({argsToString}),			
		forEach:function forEach(collection,callback,options=true){//[title=jsl.forEach()]
			/** Enumerates the members of a collection and returns an array populated 
			*	with the results of calling the provided callback function on every element in the collection.
			*	When you want to iterate an array, it is more efficient to use the native Array.prototype.map() function
			*	However, jsl.forEach is more flexible allowing mapping also non-array objects, 
			*	It also allows to add properties on the result(treated as attributes by tag-functions).
			*	@param	collection array or other object who's members are enumerated
			*	@param	callback   a callback function (item,indexOrKey,collection,results) that is called for every member of the collection
			*	@param	options    when true(default value), jsl.forEach will return an array also for non-array collections
			*	@return	a collection that can be used as argument by any tag-function
			*/
			if(Object(collection).valueOf()!==collection){// || typeIsObjectOrFunction(collection)){
				(collection===undefined) || console.warn("jsl.forEach requires an iterable collection!",typeof collection);
				return callback(collection);
			}
			const returnAsArray=(options===true)||(options && (options.returnAsArray!==false));
			let V=collection,K=(Array.isArray(V)&&V.length)?V:Object.keys(V),results=[];
			for(let r,v,k,c=K.length,i=0; i<c; i++){/*if we don't initialize c to K.length, then the callback might expand it as we loop. Do we wan't this?*/
				v=(V==K)?V[k=i]:V[k=K[i]];
				((r=callback(v,k,V,results))!==undefined) && (results[returnAsArray?i:k]=r);
			};
			return returnAsArray?results:Object.assign({},results);//if returnAsArray is set to false, just assign the array to an object;-)
		},
		CSS:function CSS(...args){//[title=jsl.CSS()]
			/** Converts the arguments to a valid css style-sheet
			*	each argument may be an object of the form<pre>
			*	{
			*		['css-rule1']: {
			*			'kebab-case-property': 'style-property-value',
			*			camelCaseProperty    : 'style-property-value',
			*			...
			*		},
			*		['css-rule2']:{
			*			...
			*		},...
			*	}</pre>
			*	@param ...args	one or more objects that are to be converted
			*	@return	a CSS formatted string that represents a set of CSS rules
			*/
			let ret='';
			for(let arg,i=0; arg=args[i], i<args.length; i++){
				for(let m in arg)if(arg.hasOwnProperty(m)){
					ret+="\n\n"+m+"{\n\t"+objectToStyle(arg[m])+"\n}";
				};
			}
			return ret;
		},		
		writer:function(){
			return new JslObjBuilder();
			//return {val:'',write(v){this.val+=v;},toString(){return this.val;}}[jslNamespace];
		},		
		cdata(v,indent){//[title=jsl.cdata()]
			/**
			*	Generates a jsl text fragment from the specified value.
			*	If the value is a function then the first multiline comments of the specified function are used instead.
			*	@param fn	the function who's comments are to be extracted
			*	@return <i>this</i> object (i.e. the current jsl context)						
			*/
			return new JslObjBuilder().txt(typeof v == 'function'?v[sExtractComments](indent):v);
		},
		rdata(v,indent){//[title=jsl.rdata()]
			/**
			*	Generates a jsl html fragment from the specified value.
			*	If the value is a function then the first multiline comments of the specified function are used instead.			
			*	@param v	the value to add as raw content
			*	@return <i>this</i> object (i.e. the current jsl context)						
			*/
			return new JslObjBuilder().raw(typeof v == 'function'?v[sExtractComments](indent):v);
		},
		cref:Proxy && (new Proxy({}, {/*feature added 2003-03-20*/
			 get: function(target, prop, receiver) {
				 return jsl.rdata('&'+prop+';')
			 }
		})),
		eventSource(name='eventSource'){//[title=jsl.eventSource()]
			/**
			* 	Creates an event source function. Event sinks can register for this event-source using jsl.sinkFor .
			*	When the event source is invoked with arguments (arg0,arg1...,argN-1), all the registered sinks are called with arguments (eventSource,arg0,...argN-1)
			*	@note The <i>this</i> keyword inside the sink is set to the DOM element on which the sink is registered.
			*	@note If the event sink returns a value, then it is assigned to the jsl proxy of the same DOM element.
			*	@param name optional parameter
			*/
			let sinks=[];
			let obsolete=0,hTimeout;
			const source=({[name]:function(...args){
				args.splice(0,0,source);
				if((hTimeout===undefined) && (obsolete>=4)){//pack in the next message loop
					hTimeout=setTimeout(()=>{
						source.sinks=sinks=sinks.filter(sink=> sink && (sink[2]=document.getElementById(sink[1])));	
						clearTimeout(hTimeout);
						obsolete=0;
						hTimeout=undefined;
						console.warn('packing sinks',sinks.length);
					},0)					
				};
				for(let sink,c=sinks.length,i=0; i<c; i++)if(sink=sinks[i]){
					//console.log('sink',i,':',sink);
					if( (sink[2]||(sink[2]=document.getElementById(sink[1]))) && sink[2].isConnected ){
						let ret=sink[0].apply(sink[2],args);
						if((ret!==undefined) && !(ret instanceof Promise)){//(ret instanceof Promise) added on 2023-06-16
							sink[2][jslNamespace]=ret;
						};	
					}else
					if(sink[2]){//[title=not in tree]
						//console.warn('event sink target disconnected',sink[1]);
						obsolete++;
						delete sinks[i];
					}else{
						//console.warn('event sink target not ready',sink[1]);
						obsolete++;
					}
				};
			}})[name];
			source.sinks=sinks;
			if(this.targetFunction){//add an eventSource function to the target function
				this.targetFunction[name]=source;
				return this.targetFunction;
			};
			return source;
		},		
		sinkFor(...args){//[title=jsl.sinkFor()]
			/**
			*	Registers a callback function to be called whenever any of the specified event sources are triggered. The callback function is called with the event source and its current value as arguments.
			*	@param source1,...sourceN	The event sources to listen for. If any of these are null or undefined, the callback will be called immediately upon registration.
			*	@param callback	The callback function(eventSource,value1,...valueN) to be called when any of the specified event sources are triggered. The first parameter is the event source that was triggered, and the rest are the values passed by the event source.
			*	@return	a jsl context that can be used inside jsl tag functions.
			*	@note If an event source argument is a JavaScript Promise then it is treated as valid jsl event source that triggers when the promise is resolved or rejected with arguments <i>(err,res)</i> where <i>err</i> and <i>res</i> are the promise's outcome		
			*/
			return JslObjBuilder.prototype.sinkFor.apply(new JslObjBuilder(),args);
		},
		register(tagName,isSingleton,tagNamespace,forceUpperCase=true){//[title=jsl.register()]
			/**	Registers a new tag to be used as valid tag-function
			*	@param tagName 		the name of the new tag (e.g. 'svg')
			*	@param isSingleton	specifies if the new tag is a singleton (i.e. does not all child elements)
			*	@param tagNamespace	if defined it registers the new tag-function in this object
			*	@param forceUpperCase if true(default) the tagName is converted to upper case
			*	@return	a tag-function that generates valid html markup
			*/
			forceUpperCase && (tagName=tagName.toUpperCase());
			let alreadyExists=tagNamespace && tagNamespace[tagName];
			if(alreadyExists){
				if(alreadyExists instanceof JslObjBuilder){
					console.warn('tag',tagName,'is already registered in target namespace');
					return alreadyExists;
				}else{
					console.warn('tag',tagName,'already exists in the target namespace: ',alreadyExists);
				}
			}
			return registerTag({tagName,singleton:isSingleton},tagNamespace);
		}
	};
	Object.defineProperty(globalObject, jslNamespace, {
		get(){
			return jslGlobalProxy;
		},
		set(v){
			(jslGlobalProxy.target||document)[jslNamespace].all([v]);
		}		
	});	
	
	const jslTagNamespace=(jslGlobalOptions.tagns==jslNamespace)?jslGlobalProxy:(globalObject[jslGlobalOptions.tagns]||globalObject);

	Object.keys(defs).forEach( tag=> {
		registerTag(defs[tag],jslTagNamespace);
	});	
		
	const sSelect=Symbol.for('jsl path selector');
	
	const jpathSelect=Object.prototype[sSelect]=function jpathSelect(selector,ancestorOrSelf,dest){
		/**
		*	Selects a part of "this" using the specified selector object
		*	@param Selector The selector object to be used. Should be an object of the following syntax:
		*		Selector::
		*		{
		*			path-selector1: value-selector
		*			path-selector2: ...
		*			...
		*		}
		*		path-selectors::
		*			*						: all the keys that Object.keys(this) returns (ie. all named properties of this object)
		*			prop1[,prop2,...propn]	: the keys prop1, prop2, ... propn 
		*			/regexp					: all the keys that Object.keys(this).filter(n=>regexp.test(n)) returns (i.e. all named properties of object matching the regexp)
		*			^prop1,prop2,...propn	: all the keys except the keys prop1, prop2, ... propn 
		*			[jsl.sel(filter)]		: all the keys that Object.keys(this).filter(fn) 
		*			\prop					: the key 'prop'
		*	    
		*		value-selectors::
		*			object		:: 	Selector | 
		*			function	::	function(value,key,values,position,keys,count,out,ancestor,self){...}
		*								the params of the function adhere to the equality: 
		*									value===values(key)===values(keys(position))===values()[key], key===keys(position), count==keys().length
		*								the ancestor allows access to the ancestorOrSelf axis (similar to xpath)
		*								should either return a value to be used for a matching key, or directly write in the resulting value "out"
		*								all the params can be accessed from the "this" of the function
		*			primitive	::  	a primitive that is copied to the output (except undefined which is not copied)
		*			jsl.sel()	::	the identity function (i.e. v=>v )
		*
		*	@param ancestorOrSelf	:If access to the ancestorOrSelf axis is needed it should be set originally to an empty array [], otherwise it can be left undefined
		*	@param dest				:Destination object. If specified output is produced in the destination object, otherwise a new object(or array) is created depending on "this"
		*	
		*	
		*/
		let V=this,isArray=Array.isArray(V),U=dest||(isArray?[]:{}),retArray=Array.isArray(U),A;
		Object.keys(selector).concat(Object.getOwnPropertySymbols(selector)).forEach(s=>{
			let K,f=selector[s];
			if(typeof s=='symbol'){
				K=Object.keys(V).filter(jpathSelect.filters[s]);
			}else
			if(s=='*'){
				K=isArray?V:Object.keys(V);
			}else				
			if(s[0]=='^'){
				let e=s.slice(1).split(',');
				K=Object.keys(V).filter(k=>e.indexOf(k)<0);
			}else
			if(s[0]=='/'){
				let e=new RegExp(s);
				K=Object.keys(V).filter(k=>e.test(k));
			}else
			if(s[0]=='\\'){// so that we can use "*", "^" , "/" and "," as path-selectors 
				K=[s.slice(1)];
			}else{
				K=s.split(',');
			};
			for(let u,v,k,i=0,c=K.length; i<c ; i++){
				v=V[k=(V==K)?String(i):K[i]];u=undefined;
				//if(v!=undefined) comment so that we can also create fields that are undefined in V
				{
					const values=(ancestorOrSelf || (f.length>2)) && ((i)=> (i===undefined)?V: (i!==(i|0))||(V==K)?V[i]:V[K[i]]);
					const keys	=(ancestorOrSelf || (f.length>4)) && ((i)=> (i===undefined)?K: (V==K)?i:K[i]);
					ancestorOrSelf && (Object.assign(A=[0].concat(ancestorOrSelf),{value:v,key:k,values,pos:i,keys,count:c,out:U,ancestor:ancestorOrSelf,self:this})[0]=A);
					switch(typeof f){
					case 'function':
						u=f.call(A,v,k,values,i,keys,c,U,A,V);
						break;
					case 'object'  :
						(v==undefined)||(u=v[sSelect](f,A));
					break;
					default:
						u=f;
					};
					ancestorOrSelf && (A[0]=undefined) && (A=undefined);
				}
				if(u!=undefined){
					retArray && U.push(u) || (U[k]=u);
				}
			}
		});
		return U;
	};
	
	const jpathCopy=v=>v;
	jslGlobalProxy.sel=JslObjBuilder.prototype.sel=function(selector,ancestorOrSelf,dest){
		if(selector===undefined){
			return jpathCopy;
		};
		if(typeof selector == 'function'){//make a filter symbol
			let s=Symbol(selector);
			return ((jpathSelect.filters || (jpathSelect.filters={}))[s]=selector),s;
		};
		if(this===jslGlobalProxy){
			console.warn('can not apply jpathSelect on global jsl proxy');
			return;
		};
		console.assert(this.targetObject);		
		return jpathSelect.call(this.targetObject,selector,ancestorOrSelf,dest);
	}
	
	
	if(clientSide && !('isConnected' in Node.prototype)){
	/**
	* Node.isConnected polyfill for IE and EdgeHTML
	* 2020-02-04
	*
	* By Eli Grey, https://eligrey.com
	* Public domain.
	* NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
	*/		
	  Object.defineProperty(Node.prototype, 'isConnected', {
		get() {
		  return (
			!this.ownerDocument ||
			!(
			  this.ownerDocument.compareDocumentPosition(this) &
			  this.DOCUMENT_POSITION_DISCONNECTED
			)
		  );
		},
	  });
	}	
	
})()