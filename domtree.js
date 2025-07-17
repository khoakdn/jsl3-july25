/**
* DOM tree visualization module	
*
* http://jsl.codemax.net/domtree.js
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
(function domtrees(){	
	/**
	*	The domtrees module exports BUILDDOMTREE(node), a function that generates a DOM tree visualization
	*	from any DOM Node.
	*/
	'use strict'; 
	function doDomTreeClick(event){//[collapsed]
		this.parentElement.classList.toggle('collapsed');
		event.stopPropagation();
	};
	const WORDCLASSES=(text)=>{//[title=class list based on word count][collapsed]
		let p=Math.round(Math.log10(text.length));
		let r=[];
		for(let i=1;i<=p;i++){
			r.push('W'+Math.pow(10,i));
		};
		let q=Math.round(Math.log2(Math.min(text.length,128)));	
		for(let i=1;i<=q;i++){
			r.push('W'+Math.pow(2,i));
		};	
		return r;
	}
	const BUILDDOMTREE=((node)=>(DOMTREECASES[node.nodeType](node)));
	const DOMTREECASES={//[title=map of node types to jsl template arrow functions]
		1: //ELEMENT_NODE
		(node,name=node.nodeName.toLowerCase(),singleton=!node.hasChildNodes() && jsl.defs[name] && jsl.defs[name].singleton)=>
		DIV({class:'ELEMENT'},
			DIV({class:['tag-open',name]},singleton?{class:'tag-close'}:{onclick:doDomTreeClick},
				'<',SPAN(name),
				jsl.forEach(node.getAttributeNames(),(name) => DIV({class:'tag-attr'},' ',SPAN({class:'name'},name),
						(node.getAttribute(name) && ['="',SPAN({class:'value'},node.getAttribute(name)),'"'])
					)
				),
				(singleton?'/>':'>')
			),
			singleton?'':DIV({class:node.childNodes.length<2?'CHILD':'CHILDREN'},jsl.forEach(node.childNodes,BUILDDOMTREE)),
			singleton?'':DIV({class:'tag-close'},'</',SPAN(name),'>')
		),
		3: //TEXT_NODE
		(node)=>SPAN({class:'TEXT'},{class:WORDCLASSES(node.nodeValue)},node.nodeValue),
		4: //CDATA_SECTION_NODE
		(node)=>SPAN({class:'CDATA'},'<![CDATA['+node.nodeValue+']]>'),
		7: //PROCESSING_INSTRUCTION_NODE:
		(node)=>SPAN({class:'PROCESSING_INSTRUCTION'},'<?',node.nodeValue,'?>'),
		8: //COMMENT_NODE
		(node)=>SPAN({class:'COMMENT'},'<!--',node.nodeValue,'-->'),
		9: //DOCUMENT_NODE
		(node)=>DIV({class:'DOCUMENT'},SPAN('#document'),jsl.forEach(node.childNodes,BUILDDOMTREE)),
		10: //DOCUMENT_TYPE_NODE
		(node)=>DIV({class:'DOCUMENT_TYPE'},'<!doctype ',node.name,'>'),
		11: //DOCUMENT_FRAGMENT_NODE
		(node)=>DIV({class:'DOCUMENT_FRAGMENT'},SPAN('#document-fragment'),jsl.forEach(node.childNodes,BUILDDOMTREE)),
	};

	jsl.transform(STYLE(//[collapsed]
		function(){/*
		.ELEMENT{
			font-family:monospace;
			padding-left:2em;
			color:gray;
			border-left:1px dotted gray;
			clear:both;
		}
		.ELEMENT.collapsed > *:not(.tag-open):not(.tag-close){
			display:none;
		}
		.ELEMENT.collapsed>.tag-open::after{
			content:'...';
		}
		.ELEMENT .tag-open,.ELEMENT .tag-close,.ELEMENT .tag-attr{
			display:inline-block;
			cursor:pointer;
		}
		.ELEMENT .tag-open>span,.ELEMENT .tag-close>span{
			color:rgb(151,18,161);
		}
		.ELEMENT .tag-attr{
			display:inline-block;
			margin-left:0.5em;
		}
		.ELEMENT .tag-attr>span:nth-child(1){
			color:rgb(153,69,0);
		}
		.ELEMENT .tag-attr>span:nth-child(2){
			color:rgb(26,26,156);
		}

		.DOCUMENT_TYPE{
			font-family:monospace;
			color:gray;
		}
		.COMMENT{
			font-family:monospace;
			color:darkgreen;
		}
		.DOCUMENT{
			font-family:monospace;
			color:gray;
		}
		.DOCUMENT_FRAGMENT{
			font-family:monospace;
			color:gray;
			
		}
		.ELEMENT .tag-open.style ~ *:not(.tag-close), .ELEMENT .tag-open.script ~ *:not(.tag-close){
			white-space:pre;
		}

		.CHILD {
			display: inline;
		}

		.TEXT{
			font-family:monospace;
			color:black;
			white-space:pre-line;
		}
		.TEXT:before {content: '\000AB';}
		.TEXT:after {content: '\000BB';}

		.TEXT:not(:only-child), .TEXT.W32 {
			display: block;
			clear: both;
			padding-left: 2em;
			border-left: 1px dotted gray;
			clear: both;
		}
		*/}.jsl.RDATA
	));
	
	window.BUILDDOMTREE=BUILDDOMTREE;
	window.domtrees=domtrees;
})();	