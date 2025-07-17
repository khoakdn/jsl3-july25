/**
* JavaScript syntax highlighting utilities	| JSF-2020-beta
*
* http://jsl.codemax.net/jsf2.1.js
* 
* 
* version	: 2020 beta
* author	: dr. G.Metaxas
* Copyright 2020 Ambianti B.V.
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
(function jsf_module(exports){/**
*	JavaScript syntax highlighting utilities
*/
	'use strict';
	let jsf={
		module:jsf_module
	};
	if(exports){
		exports.module=jsf;
	}else{
		let scriptTags = document.getElementsByTagName('script');
		let jsfNS=(/^.+\?ns=(\w+)/.exec(scriptTags[scriptTags.length - 1].getAttribute('src')||'')||[,'jsf'])[1];
		window[jsfNS]=jsf;
	}	
	
	 const cReservedWords={
			'abstract':1,	'arguments':1,	'await':1,		'boolean':1,	'break':1,		'byte':1,
			'case':1,		'catch':1,		'char':1,		'class':1,		'const':1,		'continue':1,
			'debugger':1,	'default':1,	'delete':1,		'do':1,			'double':1,
			'else':1,		'enum':1,		'eval':1,		'export':1,		'extends':1,
			'false':1,		'final':1,		'finally':1,	'float':1,		'for':1,		'function':1,	'goto':1,
			'if':1,			'implements':1,	'import':1,		'in':1,			'instanceof':1,	'int':1,		'interface':1,
			'let':1,		'long':1,		'native':1,		'new':1,		'null':1,		
			'package':1,	'private':1,	'protected':1,	'public':1,		'return':1,
			'short':1,		'static':1,		'super':1,		'switch':1,		'synchronized':1,
			'this':1,		'throw':1,		'throws':1,		'transient':1,	'true':1,		'try':1,		'typeof':1,
			'var':1,		'void':1,		'volatile':1,	'while':1,		'with':1,		'yield':1
	 }
	
	const cBlockMirror={
		'(':')',	')':'(',
		'[':']',	']':'[',
		'{':'}',	'}':'{'
	}
	const cNumericLiteralRegExp=/^(0[bB][0-1]+|0[oO][0-7]+|0[xX][0-9a-fA-F]+|[0-9]+(?:\.[0-9]*){0,1}([eE](?:[+-]{0,1})[0-9]+){0,1}|\.[0-9]+(?:[eE]([+-]{0,1})[0-9]+){0,1})/;
	const cRegExpLiteral=//adopted from http://www.ecma-international.org/ecma-262/6.0/index.html#sec-literals-regular-expression-literals
	/^((?:\u002f(?:(?:[^\n\r\u002a\u005c\u002f\u005b]|(?:\u005c[^\n\r])|(?:\u005b(?:[^\n\r\u005d\u005c]|(?:(?:\u005c[^\n\r])))*\u005d))(?:[^\n\r\u005c\u002f\u005b]|(?:\u005c[^\n\r])|(?:\u005b(?:[^\n\r\u005d\u005c]|(?:(?:\u005c[^\n\r])))*\u005d))*)\u002f(?:(?:[a-zA-Z_0-9])|(?:\u0024)|(?:\u005f)|(?:\u005c(?:(?:\u0075(?:[0-9a-fA-F][0-9a-fA-F][0-9a-fA-F][0-9a-fA-F]))|(?:\u0075\u007b[0-9a-fA-F]+\u007d))))*))/;
	const cSingleQuotedStrRegExp=/^'((?:[^'\\]|(?:\\[^]))*)'/;/* [^] = multiline . */
	const cDoubleQuotedStrRegExp=/^"((?:[^"\\]|(?:\\[^]))*)"/;
	const cTokensBeforeRegExp=jsl.forEach('{([~!%^&*-+=<>;?:|,/'.split(''),(v,n,c,r)=>{r[v]=v;});
	Object.assign(cTokensBeforeRegExp,{case:1,typeof:1,return:1,yield:1});
	const cIdentifierRegExp=/^([a-zA-Z_$][a-zA-Z0-9_$]*)/;

	function unindentSource(s){
		let lastLine=/\n[^\n]*$/g.exec(s);
		let leadTabs=lastLine && /^\n\t+/.exec(lastLine[0]);
		return leadTabs?s.replace(new RegExp(leadTabs[0],'g'),'\n'):s;
	}	
	function parseFunction(fn,syntaxHighlighter){	
		let input=unindentSource(fn.toString());		
		let blockStack=[];
		let lastToken;
		for(let r,pos=0,token; (pos<input.length) && (!syntaxHighlighter || !syntaxHighlighter.done) ; ){
			token=input[pos];			
			if(/\s/.test(token)){
				syntaxHighlighter.whiteSpace && syntaxHighlighter.whiteSpace(token);
				pos++;				
				continue;
			}else		
			if(token!='/'){
				lastToken=token;
			};
			switch(token){
				case '{': case '(':case '[': 
					pos++;
					syntaxHighlighter.blockOpen && syntaxHighlighter.blockOpen(token);
					blockStack.push(token);
				break;
				case '}': case ')':case ']': 
					pos++;
					syntaxHighlighter.blockClose && syntaxHighlighter.blockClose(token);
					console.assert(blockStack.length);
					let topBlock=blockStack.pop();
					if(cBlockMirror[topBlock]!=token){
						console.error('block "'+cBlockMirror[r]+'" expected, ','"'+token+'"','found at ',pos-1,);
						return null;
					};
				break;
				case '\'':
					r=cSingleQuotedStrRegExp.exec(input.slice(pos));
					pos+=r[0].length;
					syntaxHighlighter.output && syntaxHighlighter.output('string',r[0]);
				break;
				case '\"':
					r=cDoubleQuotedStrRegExp.exec(input.slice(pos));
					pos+=r[0].length;					
					syntaxHighlighter.output && syntaxHighlighter.output('string',r[0]);
				break;
				case '/':
					pos++;token=input[pos];
					switch(token){
						case '/':{//singleline comment
							r=/.*/.exec(input.slice(pos));
							pos+=r[0].length;
							syntaxHighlighter.comment && syntaxHighlighter.comment(r[0].slice(1),'singleline','//','');
							break;
						}
						case '*':{//multiline comment
							r=/\*\//.exec(input.slice(pos));
							syntaxHighlighter.comment && syntaxHighlighter.comment(input.slice(pos+1,pos+r.index),'multiline','/*','*/');
							pos+=r.index+2;
							break;
						}
						default	://regexp?
							if(!cTokensBeforeRegExp.hasOwnProperty(lastToken)){//just division
								lastToken='/';
								syntaxHighlighter.output && syntaxHighlighter.output('/');
								break;
							};
							lastToken='@';
							pos--;//go to the begining of the regexp literal
							r=cRegExpLiteral.exec(input.slice(pos));
							pos+=r[0].length;							
							syntaxHighlighter.output && syntaxHighlighter.output('regexp',r[0]);
					};					
				break;
				case '=':
					pos++;
					if(!blockStack.length && (input[pos+1]=='>')){
						pos++;
						syntaxHighlighter.output && syntaxHighlighter.output('=>');
					}else{
						syntaxHighlighter.output && syntaxHighlighter.output('=');
					}
				break;						
				default:
					if(r=cNumericLiteralRegExp.exec(input.slice(pos))){
						pos+=r[0].length;
						lastToken='0';
						syntaxHighlighter.output && syntaxHighlighter.output('number',r[0]);
					}else
					if(r=cIdentifierRegExp.exec(input.slice(pos))){
						pos+=r[0].length;	
						lastToken=cReservedWords.hasOwnProperty(r[0])?r[0]:'@';	
						if(lastToken=='@'){
							syntaxHighlighter.output && syntaxHighlighter.output('ident',r[0]);	
						}else{
							syntaxHighlighter.output && syntaxHighlighter.output('reserved',r[0]);
						}
					}else{
						pos++;
						syntaxHighlighter.output && syntaxHighlighter.output(token);
					}
			}
		}
		return syntaxHighlighter;
	}
	
	const commentMetaAttRegExp=/^\[(\w+)(?:=((\\.|[^\]])*)){0,1}\]/;
	const sMetaAttsRestComment=Symbol('rest');
	function extractMetaAtts(str){
		let atts={},rest;
		for(let p=0,r; r=commentMetaAttRegExp.exec(rest=str.slice(p)); p+=r[0].length){
			atts[r[1]]=r[2]?r[2].replace(/\\/g,''):true;
		};
		atts[sMetaAttsRestComment]=rest;
		return atts;
	};			
	
	function doBlockClick(event){
		this.parentElement.classList.toggle('collapsed');
	}
	
	
	function formatJavadocTooltip(doc){
		if(!doc){
			return;
		}
		doc=doc.toString();
		doc=doc.replace(/^[\*\s\r\n]*/m,'');
		doc=doc.replace(/\n\s*\*\s/g,'\n');
		const tokenRegEx=/(?:@([\w-]+)\s+([^\s]+))|(?:\{@([\w-]+)\s+([^\}]+)\})/;
		let p=0,i=0,j=0;
		let out='';
		let prevTag;
		for(let token; token=tokenRegEx.exec(doc.slice(p));){			
			out+=doc.slice(p,p+=token.index);
			let tag=token[1]||token[3];
			let val=token[2]||token[5];
			switch(tag){
				case 'param'   	:							
					out+= ((prevTag==tag)?'':'Parameters\n')+'\t'+val+':';
				break;
				case 'return'  	:
					out+= ((prevTag==tag)?'':'Returns')+'\t\t:';
					p-=!val?0:val.length;
				break;
				default			:out+='@'+tag+' '+val;
			};
			prevTag=tag;
			p+=token[0].length;
		};				
		out+=doc.slice(p);
		return out;
	}	
	
	const SyntaxHighlighter=jsf.SyntaxHighlighter=function SyntaxHighlighter(options){
		let lineNo=options.lineNo||1,nesting=options.nesting||'';
		let block=[EM({dataLine:lineNo}),nesting,options.prefix],stack=[];		
		let declaration,documentation,statements,root=this||window,identRoot=root;
		return({
			html(){
				//console.log({declaration,documentation,statements});
				options.lineNo=lineNo;
				return options.skipDecl?statements:block;
			},
			whiteSpace:function whiteSpace(t){//[title=handle white space]		
				switch(t){
					case '\r':break;
					case '\n':
						block.push(BR(),EM({dataLine:++lineNo}),nesting);
						block.lines++;
					break;
					default:
						block.push(t);
				}						
			},		
			output:function output(t,v){//[title=handle tokens of type t with value v]		
				if((t!='ident')&&(t!='.')){//reset the identifier root
					identRoot=root;
				};
				block.firstToken||(block.firstToken=t);
				if(v){//[title=use t as class name]
					switch(t){
						case 'string':case 'regexp':v=String(v);break;
						case 'ident' :
							if(identRoot && (identRoot=identRoot[v])){
								let fn=(typeof identRoot == 'function')?identRoot:undefined;
								v=A(v,
									fn && options.showFunction && function onclick(e){options.showFunction(fn);},
									{title:formatJavadocTooltip(extractDocumentation(identRoot))||(String(identRoot))}
									//SPAN({class:'tooltip'},formatJavadoc(extractDocumentation(identRoot),identRoot)||(identRoot+''))
								);	
							};
					};					
					block.push(EM({class:t},v));
				}else{
					/*switch(t){
						case '<':t='&lt;';break;
						case '>':t='&gt;';break;
						case '&':t='&amp;';break;
					};*/
					block.push(t);				
				}		
			},
			comment:function comment(c,t,p,q){
				c=String(c);
				if(!block.firstToken && !block.metaAtts && (t=='singleline')){
					c=(block.metaAtts=extractMetaAtts(c))[sMetaAttsRestComment];
					if(!c){
						return;
					}
				};
				let isDocComment=(t=='multiline') && (c[0]=='*');
				if(!documentation && isDocComment){
					documentation=c;
					if(options.skipDoc){
						return;
					}
				};
				let lines=(c.match(/\n/g)||[]).length;
				lineNo+=lines; block.lines+=lines;
				if(isDocComment){
					p='',q='',c=jsl.rdata(formatJavadocTooltip(c.slice(1)));
				}
				block.push(EM({class:['comment',t,isDocComment?'doc':'']},p,c,q));			
			},
			blockOpen:function blockOpen(t){
				identRoot=root;
				stack.push(block);
				block=[];
				block.lines=0;
				if(declaration && !statements){
					statements=block;
					if(options.skipDecl){
						stack=[];
						lineNo=0;
					}
				};
			},
			blockClose:function blockClose(t){
				identRoot=root;
				let blockHTML=SPAN({class:['block',block.lines?'multiline':'',block.metaAtts && block.metaAtts.collapsed && 'collapsed'],dataDepth:stack.length},
					EM({class:'block-begin',onclick:doBlockClick},block.metaAtts,cBlockMirror[t]),
					SPAN({class:'block-source'},block),
					EM({class:'block-end'},t)
				);
				(block=stack.pop()) && block.push(blockHTML);
				if(!declaration && !stack.length){
					declaration=block;
				};
			}
		});
	};	
	
	jsf.unindentSource=unindentSource;
	jsf.parseFunction=parseFunction;
	
	const syntaxHighlight=jsf.syntaxHighlight=function syntaxHighlight(fn,options){
		const t=typeof fn;
		function setOptionsPrefix(item,name,options){
			if((typeof item!='function') || /^(function|\()/.test(item+'')){
				options.prefix=options.prefix=[EM({class:'ident'},name),':'];
			}else{
				options.prefix='';
			};
			options.lineNo=(options.lineNo||0)+1;
		};
		switch(t){
			case 'function'	: return parseFunction(fn,SyntaxHighlighter(options)).html();	
			case 'object'	: return SPAN({class:'block'},
					EM({class:'block-begin'},'{'),BR(),
					SPAN({class:'block-source'}, 
						(options.nesting='\t',undefined),
						jsl.forEach(fn, (item,name)=> 
							[setOptionsPrefix(item,name,options),syntaxHighlight(item,options),',',BR()]
						)
					),
					EM({class:'block-end'},'}')
				);
			default:return [options.nesting,options.prefix,EM({class:t},fn)];
		}				
	}
	
	const extractDeclaration=jsf.extractDeclaration=function extractDeclaration(fn){
		let ret='';
		parseFunction(fn,{
			whiteSpace(t){ret+=t;},
			output(t,v){ret+=v||t;},
			blockOpen(t){ret+=t;},
			blockClose(t){
				ret+=t;
				this.done=true;
			},
		});
		return ret;
	}
	
	const extractDocumentation=jsf.extractDocumentation=function extractDocumentation(fn){
		let doc='';
		fn && parseFunction(fn,{
			comment(c,t,p,q){
				if((t=='multiline')&&(/^\*/.test(c))){
					doc=c.slice(1);
					this.done=true;
				}
			}
		});
		return doc;
	}	
	
	const extractIsVoidFunction=jsf.extractIsVoidFunction=function extractIsVoidFunction(fn){
		let passedDeclarations=false,ret=true;
		parseFunction(fn,{
			output(){
				(this.done=passedDeclarations)&&(ret=false);
			},
			blockClose(t){
				(this.done=passedDeclarations)||(passedDeclarations=true);
			}			
		});
		return ret;
	}
		
})(typeof exports === 'undefined'? undefined: exports);