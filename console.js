(function(){	
	'use strict';
	const consoleCSS=jsl.rdata(function(){/*				
	*/});
	
	const typeIsPrimitive={
		'bigint':true,
		'symbol':true,		
		'number':true,
		'string':true,
		'boolean':true,
		'undefined':true,
	};	
	const typeIsComplex={
		'function':true,
		'object':true
	}
	const literalToString=function(literal,type){
		type=type||(typeof literal);
		if(type=='string'){
			return "'"+(literal+"").replace("'","\\'")+"'";	
		}else
		if(type=='symbol'){
			return literal.toString();
		}else
		if(type=='function'){
			//literal might be a getMember proxy... so let's avoid literal.toString
			return Function.prototype.toString.call(literal);	
		}else{
			return ''+literal;
		}			
	};
	
	const quote=(s)=> "'"+(s+"").replace("'","\\'")+"'";
	
	
	function OBJSUMMARY(obj,level=0){
		const classList={class:['summary','level'+level]};
		if(obj===null){
			return SPAN(classList,{class:'null'},'null');
		};
		if(obj===undefined){
			return SPAN(classList,{class:'undefined'},'undefined');
		};
		const type=typeof obj;
		const isArray=Array.isArray(obj);				
		classList.class.push(isArray?'array':type);		
		if(!typeIsComplex[type]){	
			classList.class.push('primitive');
			return SPAN(classList,String(obj));
		};
		if(level>=2){
			return SPAN(classList,
				isArray? SPAN('Array(',obj.length,')'):
					type=='function'? I(jsl.rdata('&fnof;')):
						(obj.constructor!==Object?obj.constructor.name:'{...}')
			);
		};
		if(type=='function'){
			return SPAN(classList,I(jsl.rdata('&fnof;')),'()'/*PRE((obj+'')*/);
		};
		classList.class.push('complex');
		return SPAN(classList,
			isArray?[SPAN('(',obj.length,')'),'[']:[obj.constructor!==Object?obj.constructor.name:'','{'],
			SPAN({class:'properies'},jsl.forEach(obj, (value,name,src,results)=>[
				(results && results.length?',':''), 			
				SPAN({class:'property'},					
					isArray?'': [SPAN({class:'name'},name),':'],
					SPAN({class:'value'},OBJSUMMARY(value,level+1))
				)
			])),
			isArray?']':'}'
		)
	}
	
	const FNCODE=(fn)=>CODE((fn+''));
	let consoleRoot;
	window.CONSOLELINE=function(type,args){
		return DIV({class:'line '+type,title:(new Date()).toLocaleTimeString()},args.map(arg=>OBJSUMMARY(arg)));	
	};
	window.CONSOLE=function(...args){	
		if(consoleRoot){
			console.warn('already created a console div');
		}
		const ID='@'+Date.now();
		function out(...args){
			this.apply(console,args);			
			if(consoleRoot||(consoleRoot=document.getElementById(ID))){
				consoleRoot.jsl.eof=DIV({class:'line '+this.name,title:(new Date()).toLocaleTimeString()},args.map(arg=>OBJSUMMARY(arg)));
				consoleRoot.parentElement.scrollTop=consoleRoot.scrollTop=10000000;	
			}
			
		};
		console.log		=out.bind(console.log);
		console.debug	=out.bind(console.debug);
		console.info	=out.bind(console.info);
		console.warn	=out.bind(console.warn)
		console.error	=out.bind(console.error);					
	return [STYLE(consoleCSS),DIV({class:'console',id:ID},args)];
	};
	
	
})();