const nextID=(prefix)=>{
	let t=Date.now(),i=0,id;
	while(document.getElementById(id=(prefix+'_'+t+'_'+(i++))));
	return id;
};
const jslProxyPrototype=HTML().constructor.prototype;

const builderSyntax=function(){//[title=Builder syntax]
/**
*	A new feature in JSL is the support of builder syntax as a syntactic flavour.
*	All <i>TAG()</i> functions have a corresponding <i>$TAG</i> property which closes the current tag and returns its parent.
*	You can add contents using other tag-functions and the builder-syntax supporting methods.
*	
*	For example the javascript bellow in builder syntax:<pre style="margin:0">
*		&Tab;<b>UL</b>({<b>class</b>:'red-text'})
*		&Tab;&Tab;.<b>LI</b>().txt('Lorem ipsum').<b>$LI</b>
*		&Tab;&Tab;.<b>LI</b>().txt('Dolor sit amet').<b>$LI</b>
*		&Tab;.<b>$UL</b>
*	</pre>	
*	Corresponds to the same HTML markup as the javascript expression:<pre style="margin:0">
*		&Tab;<b>UL</b>({<b>class</b>:'red-text'},
*		&Tab;&Tab;<b>LI</b>('Lorem ipsum'),
*		&Tab;&Tab;<b>LI</b>('Dolor sit amet')
*		&Tab;)
*	</pre>
*	The builder syntax provides a more readable format. Besides it uses fewer resources while evaluating.
*	Its main advantage however is that on the server-side it allows serialization to start before the whole response body is complete.
*/}[jsd].defines({	
	txt:jslProxyPrototype.txt[jsd].examples(function txtExample(){//[title=Using <i>.txt()</i> in builder-syntax]
		/**
		*	<i>.txt()</i> escapes and inserts a value as text content to the current jsl context.
		* 	The example bellow demonstrates its basic usage.
		*/
		jsl=
		PRE({style:{outline:'1px solid',padding:'1ch'}})
			.txt('Basic <HTML> syntax:')
			.BR()
			.txt(
				HTML()
					.HEAD().$HEAD
					.BODY().$BODY
				.$HTML
			)
		.$PRE			
	}),
	raw:jslProxyPrototype.raw[jsd].examples(function rawExample(){//[title=Using <i>raw()</i> in builder-syntax]
		/**
		*	<i>.raw()</i> inserts a value as raw content to the current jsl context(thus without escaping).
		* 	The example bellow demonstrates its basic usage.
		*/		
		jsl=
		UL()
			.LI().raw('<b>Lorem</b> ipsum').$LI
			.LI().raw('<i>Dolor</i> sit amet').$LI
		.$UL
	}),
	end:jslProxyPrototype.end[jsd].examples(function endExample(){//[title=Using <i>end()</i> in builder-syntax]
		/**
		*	<i>.end()</i> closes the current jsl context and returns its parent.
		* 	The example bellow demonstrates its basic usage.
		*	@note	The <i>$TAG</i> properties implicitly call this function.		
		*/
		jsl=
		UL()
			.LI().txt('Lorem ipsum').end()
			.LI().txt('Dolor sit amet').end()
		.end()
	}),
	all:jslProxyPrototype.all[jsd].examples(function allExample(){//[title=Using <i>all()</i> in builder-syntax]
		/**
		* 	The example bellow demonstrates the basic usage of <i>.all()</i>.
		*	We loop through the members of a collection and transform them to a <i>LI</i> elements.
		*/
		jsl=
		UL()
			.all({a:'Lorem',b:'ipsum',c:'dolor',d:'sit',e:'amet'},(value,key,collection,index)=>
				 LI()			
					.B().txt('#'+index).$B
					.raw('&Tab;')
					.txt('collection.'+key+'==')
					.Q().txt(value).$Q
				.$LI
			)
		.$UL
	}),
	run:jslProxyPrototype.run[jsd].examples(function runExample(){//[title=Using <i>run()</i> in builder-syntax]
		jsl=
		UL()
			.run(function(){
				for(let i=0;i<4;i++){
					this.jsl.LI('Added item #',i).end();
				}
			})
		.$UL
	}),
	sinkFor:jslProxyPrototype.sinkFor[jsd].examples(function sinkExample(){//[title=Using <i>sinkFor()</i> in builder-syntax]			
		let counter=5,timerTick=jsl.eventSource(),hInterval=setInterval(timerTick,500);
		jsl=
		UL()
			.sinkFor(timerTick,null,function(){
				if(counter){
					this.jsl.LI(counter--).end();	
				}else{
					clearInterval(hInterval);
				}
			})
		.$UL			
	})
	,/*
	has:jslProxyPrototype.has,		
	get:jslProxyPrototype.get,
	set:jslProxyPrototype.set,
	del:jslProxyPrototype.del,*/
});

const insertModeDefs={
	'jsl.inner':Object.getOwnPropertyDescriptor(HTML().constructor.prototype,'inner')[jsd].examples({
		'jsl.inner insert mode with an HTMLElement as target':function(){
			jsl.transform(
				P('original paragraph content'),
				BUTTON(function onclick(event){
					let paragraph=this.previousElementSibling;
					paragraph.jsl.inner=[B('new content'),' as innerHTML of the paragraph'];
				},'click here')
			);
		}[jsd].flags('important',false),
		'jsl.inner insert mode with a selector(string) as target':function(){
			const paragraphId=nextID('para');
			jsl.transform(
				P({id:paragraphId},'original paragraph content'),
				BUTTON(function onclick(event){
					('#'+paragraphId).jsl.inner=[B('new content'),' as innerHTML of the paragraph'];
				},'click here')
			);
		}[jsd].flags('important',false),
		'jsl.inner insert mode in builder syntax':function(){/**
			*	In this example we use <i>jsl.inner</i> to replace the innerHTML of a designated <i>&lt;div&gt;</i> element.
			*	Notice that <i>jsl.inner</i> is the default insert-mode for HTML elements, so in this specific case its usage is reduntant.
			*/
			function doButtonClick(event){
				let targetDiv=this.parentElement.querySelector('button ~ div');
				targetDiv.jsl.inner
				.SPAN()
					.txt('You clicked on the ')
					.B({style:{color:'red'}})
						.txt(event.target.title)
					.$B
					.txt('!')
				.$SPAN;
			}
			jsl.transform(
				BUTTON({onclick:doButtonClick,title:'first button' },'click here'),' ',
				BUTTON({onclick:doButtonClick,title:'second button'},'click here'),
				DIV('click one of the buttons...')
			)
		}
	}),
	'jsl.outer':Object.getOwnPropertyDescriptor(HTML().constructor.prototype,'outer')[jsd].examples({
		'jsl.outer insert mode with an HTMLElement as target':function(){/**
			* In the example bellow we assign a jsl expression to <q><i>list.jsl.outer</i></q> in order to replace the <i>list's</i> outerHTML.
			* As a result the <i>&lt;OL&gt;</i> element is replaced by a <i>&lt;DIV&gt;</i>
			*/
			const listId=nextID('list');
			jsl.transform(
				OL({id:listId},LI('a list item'),LI('another list item')),
				BUTTON(function onclick(event){
					let list=document.getElementById(listId);
					list.jsl.outer=DIV('replaced the ',I('<OL>'),' with this ',I('<DIV>'));
					this.disabled=true;
				},'click here')
			);
		},
		'jsl.outer insert mode with a selector(string) as target':function(){
			const listId=nextID('list');
			jsl.transform(
				OL({id:listId},LI('a list item'),LI('another list item')),
				BUTTON(function onclick(event){
					('#'+listId).jsl.outer=DIV('replaced the ',I('<OL>'),' with this ',I('<DIV>'));
					this.disabled=true;
				},'click here')
			);
		}[jsd].flags('important',false),
		'jsl.outer insert mode in builder syntax':function(){
			let modified=jsl.eventSource();
			jsl.transform(
				BUTTON({onclick:modified},'modify'),
				DIV('A div element',
					jsl.sinkFor(modified,function(){
						this.jsl.outer
						.UL()
							.LI()
								.txt('div replaced by a UL element')
							.$LI
						.$UL
					})
				)
			)
		}[jsd].flags('important',false),//[jsd].seeAlso({'Model-view notifications':jsl.internals.modelViewNotifications}),			
	}),
	'jsl.eof':Object.getOwnPropertyDescriptor(HTML().constructor.prototype,'eof')[jsd].examples({
		'jsl.eof insert mode as function':function(){
			let modified=jsl.eventSource();
			jsl.transform(
				BUTTON({id:'button',onclick:modified},'append item'),
				UL(
					jsl.sinkFor(modified,function(){this.jsl.eof=LI('last item')}),
					LI('list item A'),
					LI('list item B'),
				)
			)
		},
		'jsl.eof insert mode with an HTMLElement as target':function(){/**
			*	In this example we assign a jsl expression to <i>this.nextElementSibling.jsl.eof</i> to append a item in the target list(<i>nextElementSibling</i>).
			*	Notice that <i>jsl.eof</i> is the default insert-mode when assigning to the global <i>jsl</i> proxy.
			*/
			jsl.transform(
				BUTTON({onclick(event){
					this.nextElementSibling.jsl.eof=LI('last list item');
				}},'append new item'),' ',
				UL(
					LI('list item A'),
					LI('list item B')
				)
			);
		}[jsd].flags('important',false)	,
		'jsl.eof insert mode with a selector(string) as target':function(){
			const listId=nextID('list');
			jsl.transform(
				BUTTON({onclick(event){
					('#'+listId).jsl.eof=LI('last list item');
				}},'append new item'),' ',
				UL({id:listId},
					LI('list item A'),
					LI('list item B')
				)
			);
		}[jsd].flags('important',false)
	}),
	'jsl.bof':Object.getOwnPropertyDescriptor(HTML().constructor.prototype,'bof')[jsd].examples({
		'jsl.bof insert mode as function':function(){/**
			*	In this example we use <i>jsl.bof</i> to to insert new list items in the begining of a target list.
			*/
			const listId=nextID('list');
			function doButtonClick(event){
				let list=document.getElementById(listId);
				list.jsl.bof=LI('first item');
			}
			jsl.transform(
				BUTTON({onclick:doButtonClick},'insert new item'),' ',
				UL({id:listId},
					LI('list item A'),
					LI('list item B')
				)
			);
		}[jsd].flags('important',false),
		'jsl.bof with an element on a target':function(){
			jsl.transform(
				BUTTON({onclick(event){
					this.nextElementSibling.jsl.bof=LI('first list item');
				}},'insert new item'),' ',
				UL(
					LI('list item A'),
					LI('list item B')
				)
			);
		}[jsd].flags('important',false),
		'jsl.bof with a selector as target':function(){
			const listId=nextID('list');
			jsl.transform(
				BUTTON({onclick(event){
					('#'+listId).jsl.bof=LI('first list item');
				}},'insert new item'),' ',
				UL({id:listId},
					LI('list item A'),
					LI('list item B')
				)
			);
		}
	}),
	'jsl.before':Object.getOwnPropertyDescriptor(HTML().constructor.prototype,'before')[jsd].examples({
		'jsl.before insert mode as function':function(){/**	
			*	In this example we use jsl.before to insert an item in the list before the last item. 
			* 	When the user clicks the button, the we trigger the <i>modified</i> event-sink which results in triggering the event-sink
			*	The result is assigned to the target element's jsl proxy designator <i>before</i>, and thus a new list item
			*	is insterted before the last item.
			*/
			let modified=jsl.eventSource();
			let itemIx=0;
			jsl=[
				BUTTON(
					'add new item',
					function onclick(event){
						itemIx++;
						modified(itemIx);
					}
				),
				UL(
					LI('last item',jsl.sinkFor(modified,function(source,value){
						this.jsl.before=LI('new item ',itemIx);
					})),
				)
			];
		},//[jsd].seeAlso({'Model-view notifications':jsl.internals.modelViewNotifications}),
		'jsl.before insert mode with an HTMLElement as target':function(){
			const listId=nextID('list');
			jsl.transform(UL({id:listId},LI('a list item')));
			document.getElementById(listId).jsl.before=H2('before the list');
		}[jsd].flags('important',false),
		'jsl.before insert mode with a selector(string) as target':function(){
			let listId=nextID('list'),count=0;
			jsl.transform(
				UL({id:listId},LI('list item A'),LI('list item B')),
				BUTTON(function onclick(event){
					('#'+listId+' LI:last-of-type').jsl.before=LI('before list item B #',++count);
				},'click here')
			);
		}[jsd].flags('important',false)
	}),
	'jsl.after':Object.getOwnPropertyDescriptor(HTML().constructor.prototype,'after')[jsd].examples({
		'jsl.after insert mode as function':function(){/**	In this example we use jsl.after as a function. 
			* 	Its result is the return value of an arrow-function registered as an event-sink for a jsl event-source.
			*	The result is assigned to the target element's jsl proxy, and thus the new list items
			*	are insterted after their designated reference items.
			*/
			let modified=jsl.eventSource();
			jsl.transform(
				BUTTON({onclick:modified},'modify'),
				UL(
					LI('list item A',jsl.sinkFor(modified,function(){this.jsl.after=LI('after list item A')})),
					LI('list item B',jsl.sinkFor(modified,function(){this.jsl.after=LI('after list item B')})),
				)
			)
		}[jsd].flags('important',false),//[jsd].seeAlso({'Model-view notifications':jsl.internals.modelViewNotifications}),
		'jsl.after insert mode with an HTMLElement as target':function(){/**
			* In this example we use jsl.after to append new list items after two designated targets.
			*/
			let listId=nextID('list'), counter=0;
			jsl.transform(
				BUTTON(function onclick(event){
					let listItems=document.querySelectorAll('#'+listId+' .reference-item');
					counter++;
					for(let i=0;i<listItems.length;i++){
						listItems[i].jsl.after=LI('after '+listItems[i].innerText+' #',counter);
					};
				},'click here'),
				UL({id:listId},
					LI({class:'reference-item'},'list item A'),
					LI({class:'reference-item'},'list item B')
				)
			);
		},
		'jsl.after insert mode with a selector(string) as target':function(){/**
			*	In this example. we apply jsl.after on a css selector string.
			*/
			let listId=nextID('list'), count=0;
			jsl.transform(
				UL({id:listId},LI('list item A'),LI('list item B')),
				BUTTON(function onclick(event){
					('#'+listId+' LI:first-of-type').jsl.after=LI('after list item A #',++count);
				},'click here')
			);
		}[jsd].flags('important',false)
	}),
	'jsl.serial':Object.getOwnPropertyDescriptor(HTML().constructor.prototype,'serial')[jsd].examples({
		serializationExample:function serializationExample(
			response={
				val:'',
				write(v){
					(v && !this.val) && (console.clear(),console.info('response start'));
					this.val+=v;
					v && console.log(v);
				},
				end(){
					console.info('response end');
					jsl=jsl.rdata(this.val);
				}
			}
		){//[title=serial output example]
			/**
			*	In this example we use the <i>serial</i> insert mode together with builder-syntax on a nodejs server response.
			*	Each of the console messages corresponds to a JSL call of the response's write method.
			*/
			response.jsl.serial
			.DIV({class:['my-div-class','container'],title:'serial output'})
				.H3().txt('Serial output demo').$H3
				.UL()
					.all([1,2,3],function(x){			
						this.LI().txt('list item #'+x).$LI;
					})
				.$UL
				.FORM({onsubmit:jsl.listener(e=>e.preventDefault())})
					.INPUT({type:'password'})
					.INPUT({type:'submit'})
				.$FORM
			.$DIV
			.end();				
		}[jsd].flags('nodom',true)[jsd].flags('console',true),
		serializationExample1:function serializationExample(
			response={
				val:'',
				write(v){
					(v && !this.val) && (console.clear(),console.info('response start'));
					this.val+=v;
					v && console.log(v);
				},
				end(){
					console.info('response end');
					jsl=jsl.rdata(this.val);
				}
			}
		){//[title=Buffered output example]
			/**
			*	Notice how the output in the console changes when we don't use the <i>serial</i> insert mode.
			*	{@note	All the insert modes of JSL except <i>serial</i> are buffered.}
			*/
			response.jsl/*.serial*/
			.DIV({class:['my-div-class','container'],title:'serial output'})
				.H3().txt('Buffered output demo').$H3
				.UL()
					.all([1,2,3],function(x){			
						this.LI().txt('list item #'+x).$LI;
					})
				.$UL
				.FORM({onsubmit:jsl.listener(e=>e.preventDefault())})
					.INPUT({type:'password'})
					.INPUT({type:'submit'})
				.$FORM
			.$DIV
			.end();				
		}[jsd].flags('nodom',true)[jsd].flags('console',true)[jsd].flags('important',false)	
	})
};

insertModeDefs['jsl.inner'][jsd].seeAlso({'jsl.outer':insertModeDefs['jsl.outer']});
insertModeDefs['jsl.outer'][jsd].seeAlso({'jsl.inner':insertModeDefs['jsl.inner']});
insertModeDefs['jsl.before'][jsd].seeAlso({'jsl.after':insertModeDefs['jsl.after']});
insertModeDefs['jsl.after'][jsd].seeAlso({'jsl.before':insertModeDefs['jsl.before']});
insertModeDefs['jsl.bof'][jsd].seeAlso({'jsl.eof':insertModeDefs['jsl.eof']});
insertModeDefs['jsl.eof'][jsd].seeAlso({'jsl.bof':insertModeDefs['jsl.bof']});

	
jslHelp={

	'Playground':function(){
		/**
		JSL3 PlayGround
		*/
		}[jsd].examples({
			example2:function(){//[title=]
			jsl=['Hello World'];
			},
		}),
		
	// 'Example 1: A Simple Quiz':function(){
	// 	/**
	// 	*	This example demonstrates how to create a simple quiz using JSL3. The quiz consists of a list of questions with input fields for the user to enter their answers. When the user clicks the "Check" button, the answer is checked and a message is displayed indicating whether the answer is correct or not.
	// 	*/
	// }[jsd].examples(function todoListExample(){//[title=Example 1: A Simple Quiz]
	// 	const quiz = [
	// 		{ question: "What is the capital of France?", answer: "Paris" },
	// 		{ question: "What is the largest planet in our solar system?", answer: "Jupiter" },
	// 		{ question: "Who painted the Mona Lisa?", answer: "Leonardo da Vinci" }
	// 	  ];
		  
	// 	  jsl = SECTION(
	// 		H2("Quiz"),
	// 		UL(
	// 		  quiz.map((item, index) => 
	// 			LI(
	// 			  P(item.question),
	// 			  INPUT({ type: "text", placeholder: "Answer" }),
	// 			  BUTTON("Check", {
	// 				onclick: function() {
	// 				  const answer = this.previousElementSibling.value;
	// 				  if (answer === item.answer) {
	// 					this.jsl = P("Correct!");
	// 				  } else {
	// 					this.jsl = P("Incorrect. The correct answer is " + item.answer);
	// 				  }
	// 				}
	// 			  })
	// 			)
	// 		  )
	// 		)
	// 	  )
	// }),//[jsd].flags('nodom',true))

	// 'Example 2: A Simple Weather App':function(){
	// 	/**
	// 	*	This example demonstrates how to create a simple weather app using JSL3. The weather app consists of a list of cities and their corresponding weather conditions. When the user clicks the "Get Weather" button, the weather condition for the selected city is displayed.
	// 	*/
	// }[jsd].examples(function todoListExample(){//[title=Example 2: A Simple Weather App]
	// 	const weatherData = [
	// 		{ city: "New York", temperature: 22, condition: "Sunny" },
	// 		{ city: "London", temperature: 18, condition: "Cloudy" },
	// 		{ city: "Paris", temperature:  15, condition: "Rainy" }
	// 	  ];
		  
	// 	  jsl = SECTION(
	// 		H2("Weather App"),
	// 		SELECT(
	// 		  weatherData.map((data) => 
	// 			OPTION({ value: data.city }, data.city)
	// 		  )
	// 		),
	// 		BUTTON("Get Weather", {
	// 		  onclick: function() {
	// 			const selectedCity = this.previousElementSibling.value;
	// 			const cityData = weatherData.find(data => data.city === selectedCity);
	// 			jsl.transform(
	// 			  P(`The weather in ${cityData.city} is ${cityData.temperature}°C and ${cityData.condition}.`)
	// 			);
	// 		  }
	// 		})
	// 	  );
	// }),

	// 'Example 3: A Simple Table with Sorting':function(){
	// 	/**
	// 	*	This example demonstrates how to create a simple table with sorting functionality using JSL3. The table displays a list of names and ages, and users can sort the table by either name or age by clicking the respective buttons.
	// 	*/
	// }[jsd].examples(function todoListExample(){//[title=Example 3: A Simple Table with Sorting]
	// 	const tableData = [
	// 		{ name: "John", age: 25 },
	// 		{ name: "Jane", age: 30 },
	// 		{ name: "Bob", age: 20 }
	// 	  ];
		  
	// 	  jsl = SECTION(
	// 		H2("Table"),
	// 		TABLE(
	// 		  THEAD(
	// 			TR(
	// 			  TH("Name"),
	// 			  TH("Age")
	// 			)
	// 		  ),
	// 		  TBODY(
	// 			tableData.map((row) => 
	// 			  TR(
	// 				TD(row.name),
	// 				TD(row.age)
	// 			  )
	// 			)
	// 		  )
	// 		),
	// 		BUTTON("Sort by Name", {
	// 		  onclick: function() {
	// 			tableData.sort((a, b) => a.name.localeCompare(b.name));
	// 			jsl.transform(
	// 			  TABLE(
	// 				THEAD(
	// 				  TR(
	// 					TH("Name"),
	// 					TH("Age")
	// 				  )
	// 				),
	// 				TBODY(
	// 				  tableData.map((row) => 
	// 					TR(
	// 					  TD(row.name),
	// 					  TD(row.age)
	// 					)
	// 				  )
	// 				)
	// 			  )
	// 			);
	// 		  }
	// 		}),
	// 		BUTTON("Sort by Age", {
	// 		  onclick: function() {
	// 			tableData.sort((a, b) => a.age - b.age);
	// 			jsl.transform(
	// 			  TABLE(
	// 				THEAD(
	// 				  TR(
	// 					TH("Name"),
	// 					TH("Age")
	// 				  )
	// 				),
	// 				TBODY(
	// 				  tableData.map((row) => 
	// 					TR(
	// 					  TD(row.name),
	// 					  TD(row.age)
	// 					)
	// 				  )
	// 				)
	// 			  )
	// 			);
	// 		  }
	// 		})
	// 	  );
	// }),

	// 'Example 4: A Simple Gallery':function(){
	// 	/**
	// 	*	This example demonstrates how to create a simple image gallery using JSL3. The gallery displays a list of images, and users can add new images dynamically. When the "Add Image" button is clicked, a new image is added to the gallery.
	// 	*/
	// }[jsd].examples(function todoListExample(){//[title=Example 4: A Simple Gallery]
	// 	const images = [
	// 		{ src: "./images/github.png", alt: "Image 1" },
	// 		{ src: "image2.jpg", alt: "Image 2" },
	// 		{ src: "image3.jpg", alt: "Image 3" }
	// 	  ];
		  
	// 	  jsl = SECTION(
	// 		H2("Gallery"),
	// 		DIV(
	// 		  images.map((image) => 
	// 			IMG({ src: image.src, alt: image.alt })
	// 		  )
	// 		),
	// 		BUTTON("Add Image", {
	// 		  onclick: function() {
	// 			const newImage = { src: "image4.jpg", alt: "Image 4" };
	// 			images.push(newImage);
	// 			jsl.transform(
	// 			  DIV(
	// 				images.map((image) => 
	// 				  IMG({ src: image.src, alt: image.alt })
	// 				)
	// 			  )
	// 			);
	// 		  }
	// 		})
	// 	);
	// }),

	'Example 1: Real-Time Search Filter':function(){
		/**
		*	Description: This example creates a real-time search filter, dynamically updating the list as the user types.
		*/
	}[jsd].examples(function todoListExample(){//[title=Example 1: Real-Time Search Filter]
			/**
			*	Functions used: .txt(), .run(), jsl.eventSource, jsl.sinkFor
			*/
			const searchUpdated = jsl.eventSource();
			const items = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry'];
			
			jsl = DIV(
				INPUT({
					type: 'text',
					placeholder: 'Search...',
					oninput() {
						searchUpdated(this.value);
					}
				}),
				UL(jsl.sinkFor(searchUpdated, (src, query) =>
					items
						.filter((item) => item.toLowerCase().includes(query.toLowerCase()))
						.map((item) => LI().txt(item).$LI)
				))
			);			
	}),

	'Example 2: Dynamic Table with Sorting':function(){
		/**
		*	Description: Creates a sortable table where clicking on column headers sorts the rows.
		*/
	}[jsd].examples(function todoListExample(){//[title=Example 2: Dynamic Table with Sorting]
		/**
		*	Functions used: jsl.eventSource, jsl.sinkFor, .run()
		*/
		const sortUpdated = jsl.eventSource();
		const tableData = [
			{ name: 'John', age: 25 },
			{ name: 'Alice', age: 30 },
			{ name: 'Bob', age: 20 }
		];

		jsl = TABLE(
			THEAD(
				TR(
					TH('Name', { onclick: () => sortUpdated('name') }),
					TH('Age', { onclick: () => sortUpdated('age') })
				)
			),
			TBODY(jsl.sinkFor(sortUpdated, (src, key) =>
				tableData
					.sort((a, b) => (a[key] > b[key] ? 1 : -1))
					.map((row) =>
						TR(
							TD(row.name),
							TD(row.age)
						)
					)
			))
		);
	}),

	'Example 3: To-Do List with Task Completion':function(){
		/**
		*	Description: Builds a to-do list where tasks can be added dynamically and marked as completed.
		*/
	}[jsd].examples(function todoListExample(){//[title=Example 3: To-Do List with Task Completion]
		/**
		*	Functions used: jsl.eventSource, jsl.sinkFor, .bof(), .eof()
		*/
		const tasks = [];
		const taskAdded = jsl.eventSource();
		const taskUpdated = jsl.eventSource();
		jsl = DIV(
			FORM({
				onsubmit(e) {
					e.preventDefault();
					const task = this.elements.taskInput.value;
					tasks.push({ task, completed: false });
					taskAdded(tasks);
				}
			},
				INPUT({ name: 'taskInput', placeholder: 'New task...' }),
				BUTTON({ type: 'submit' }, 'Add Task')
			),
			UL(jsl.sinkFor(taskAdded, (src, tasks) =>
				tasks.map((t, i) =>
					LI(
						INPUT({
							type: 'checkbox',
							checked: t.completed,
							onchange() {
								t.completed = this.checked;
								taskUpdated(tasks);
							}
						}),
						t.task
					)
				)
			))
		);
	}),

	'Example 4: Collapsible Sections':function(){
		/**
		*	Description: Implements collapsible sections where only one section is expanded at a time.
		*/
	}[jsd].examples(function todoListExample(){//[title=Example 4: Collapsible Sections]
		/**
		*	Functions used: .run(), jsl.sinkFor, jsl.eventSource
		*/
		const toggleSection = jsl.eventSource();

		jsl = DIV(
			Array.from({ length: 3 }, (_, i) =>
				DIV(
					H3({
						onclick() {
							toggleSection(i);
						}
					}, `Section ${i + 1}`),
					DIV({ hidden: true, id: `section-${i}` }, `Content for Section ${i + 1}`)
				)
			),
			jsl.sinkFor(toggleSection, (src, index) => {
				Array.from(document.querySelectorAll('div[id^="section-"]')).forEach((el, i) => {
					el.hidden = i !== index;
				});
			})
		);		
	}),

	'Example 5: Multi-Step Form':function(){
		/**
		*	Description: Creates a multi-step form with navigation.
		*/
	}[jsd].examples(function todoListExample(){//[title=Example 5: Multi-Step Form]
		/**
		*	Functions used: .txt(), jsl.eventSource, jsl.sinkFor
		*/
		const stepChanged = jsl.eventSource();
		let currentStep = 0;
		const steps = [
			'Enter your name:',
			'Enter your email:',
			'Review your details:'
		];
		
		jsl = DIV(
			P().txt(steps[currentStep]),
			INPUT({ id: 'inputField', placeholder: 'Type here...' }),
			DIV(
				BUTTON({
					onclick() {
						if (currentStep < steps.length - 1) {
							currentStep++;
							stepChanged(currentStep);
						}
					}
				}, 'Next')
			),
			jsl.sinkFor(stepChanged, (src, step) => {
				document.querySelector('#inputField').value = '';
				document.querySelector('p').innerText = steps[step];
			})
		);		
	}),

	'Example 6: Dynamic Poll System':function(){
		/**
		*	Description: Creates a simple poll system where votes update dynamically.
		*/
	}[jsd].examples(function todoListExample(){//[title=Example 6: Dynamic Poll System]
		/**
		*	Functions used: jsl.eventSource, .bof(), .eof()
		*/
		const voteUpdated = jsl.eventSource();
		const pollData = [
			{ option: 'Option A', votes: 0 },
			{ option: 'Option B', votes: 0 },
			{ option: 'Option C', votes: 0 }
		];

		jsl = DIV(
			UL(
				pollData.map((option, i) =>
					LI(
						BUTTON({
							onclick() {
								option.votes++;
								voteUpdated();
							}
						}, `${option.option} (${option.votes})`)
					)
				)
			),
			jsl.sinkFor(voteUpdated, () => {
				pollData.forEach((option, i) => {
					document.querySelectorAll('button')[i].innerText = `${option.option} (${option.votes})`;
				});
			})
		);
	}),

	'Example 7: Image Carousel':function(){
		/**
		*	Description: Builds an interactive image carousel.
		*/
	}[jsd].examples(function todoListExample(){//[title=Example 7: Image Carousel]
		/**
		*	Functions used: jsl.sinkFor, jsl.eventSource
		*/
		const imageChanged = jsl.eventSource();
		const images = ['./images/img1.jpg', './images/img2.jpg', './images/img3.jpg'];
		let currentIndex = 0;

		jsl = DIV(
			IMG({ src: images[currentIndex], id: 'carouselImage' }),
			DIV(
				BUTTON({ onclick: () => imageChanged(--currentIndex < 0 ? (currentIndex = images.length - 1) : currentIndex) }, 'Prev'),
				BUTTON({ onclick: () => imageChanged(++currentIndex >= images.length ? (currentIndex = 0) : currentIndex) }, 'Next')
			),
			jsl.sinkFor(imageChanged, () => {
				document.querySelector('#carouselImage').src = images[currentIndex];
			})
		);
	}),

	'Example 8: Dynamic Quiz App':function(){
		/**
		*	Functions used: jsl.eventSource, jsl.sinkFor, .run()
		*/
	}[jsd].examples(function todoListExample(){//[title=Example 8: Dynamic Quiz App]
		/**
		*	Functions used: jsl.eventSource, jsl.sinkFor, .run()
		*/
		const questionUpdated = jsl.eventSource();
		const questions = [
			{ question: '2 + 2?', options: ['3', '4', '5'], answer: 1 },
			{ question: 'Capital of France?', options: ['Berlin', 'Paris', 'Rome'], answer: 1 }
		];
		let currentQuestion = 0;

		jsl = DIV(
			P().txt(questions[currentQuestion].question),
			UL(
				questions[currentQuestion].options.map((opt, i) =>
					LI(
						BUTTON({
							onclick() {
								alert(i === questions[currentQuestion].answer ? 'Correct!' : 'Wrong!');
								currentQuestion = (currentQuestion + 1) % questions.length;
								questionUpdated(currentQuestion);
							}
						}, opt)
					)
				)
			),
			jsl.sinkFor(questionUpdated, (src, index) => {
				document.querySelector('p').innerText = questions[index].question;
				const buttons = document.querySelectorAll('ul button');
				questions[index].options.forEach((opt, i) => {
					buttons[i].innerText = opt;
				});
			})
		);
	}),

	'Example 9: Task Manager with Prioritization':function(){
		/**
		*	Description: Creates a task manager with task prioritization.
		*/
	}[jsd].examples(function todoListExample(){//[title=Example 9: Task Manager with Prioritization]
		/**
		*	Functions used: .bof(), .eof(), jsl.sinkFor
		*/
		const priorityUpdated = jsl.eventSource();
		const tasks = [];
		jsl = DIV(
			FORM({
				onsubmit(e) {
					e.preventDefault();
					const task = this.elements.task.value;
					const priority = this.elements.priority.value;
					tasks.push({ task, priority });
					priorityUpdated(tasks);
				}
			},
				INPUT({ name: 'task', placeholder: 'Task' }),
				SELECT({ name: 'priority' },
					OPTION({ value: 'high' }, 'High'),
					OPTION({ value: 'medium' }, 'Medium'),
					OPTION({ value: 'low' }, 'Low')
				),
				BUTTON({ type: 'submit' }, 'Add Task')
			),
			UL(jsl.sinkFor(priorityUpdated, (src, tasks) =>
				tasks.sort((a, b) => a.priority.localeCompare(b.priority)).map((t) =>
					LI().txt(`${t.task} (${t.priority})`)
				)
			))
		);
	}),

	'Example 10: Real-Time Notification System':function(){
		/**
		*	Description: Implements a real-time notification system that appends notifications as they are triggered.
		*/
	}[jsd].examples(function todoListExample(){//[title=Example 10: Real-Time Notification System]
		/**
		*	Functions used: jsl.eventSource, .eof()
		*/
		const notificationAdded = jsl.eventSource();

		jsl = DIV(
			BUTTON({
				onclick() {
					const message = `Notification ${new Date().toLocaleTimeString()}`;
					notificationAdded(message);
				}
			}, 'Add Notification'),
			UL(jsl.sinkFor(notificationAdded, (src, message) =>
				LI().txt(message)
			))
		);		
	}),
	
	
// 	tagFunctions:HTML/*[jsd].uses(jsl.tags)*/[jsd].seeAlso({builderSyntax,'jsl.directives':Object.assign({},jsl.directives)})[jsd].examples({
// 		simpleContent:function(){//[title=Simple content generation]
// 			/**
// 			*	You can compose content with JSL tag-functions by assigning the return value, to the global jsl proxy to append content in the document.
// 			*	{@note Primitive arguments of <i>tag-functions</i> are converted to text-content.}
// 			*	{@note Arrays are flattened recursively, so the expression <code>DIV(1,[2,[3,[4]]])</code> is the same as <code>DIV(1,2,3,4)</code>.}
// 			*	{@note <i>undefined</i> and <i>null</i> are ignored, so the expression <code>DIV(0,undefined,1,null)</code> is the same as <code>DIV(0,1)</code>.}
// 			*/
// 			jsl=[B('H'),SUB('ellow'),' ',SUP('world!')];
// 			jsl=SECTION(
// 				H2('A section with a list'),				
// 				UL(
// 					LI('1st item'),
// 					LI('2nd item'),
// 					[LI('3rd item'),LI('4th item')]
// 				),
// 			);			
// 		}[jsd].seeAlso({'jsl.transform':jsl.transform}),
// 		contentWithAtts:function(){//[title=Content with attributes]
// 			/**
// 			*	Object arguments of <i>tag-functions</i> are converted to attributes.
// 			*	Each property of the object is converted to a corresponding attribute.
// 			*	{@note	JSL automatically converts <q>camelCase</q> properties to <q>kebab-case</q> attributes.}
// 			*/
// 			jsl=FORM({method:'POST'},
// 					FIELDSET(LEGEND('Pizza'),
// 						LABEL(INPUT({type:'radio',name:'type',value:'margherita'}),'Margherita'),BR(),
// 						LABEL(INPUT({type:'radio',name:'type',value:'pepperoni'}),'Pepperoni'),BR(),
// 						LABEL(INPUT({type:'radio',name:'type',value:'quattro formaggi'}),'Quattro formaggi'),BR(),
// 					),
// 					LABEL(INPUT({type:'checkbox'}),'extra mozarella'),HR(),
// 					INPUT({type:'reset'}),' ',INPUT({type:'submit',disabled:true}),
// 				);
// 		},//[jsd].seeAlso({'jsl property setter':jsl.internals.setupJslProxyObject}),				
// 		contentRepetition:function(){//[title=Content repetiton]
// 			/**
// 			*	<i>tag-functions</i> flatten and then join their <i>Array</i> arguments.
// 			*	This allows content repeation using Array.prototype.map, or {@link jsl.forEach}.
// 			*/
// 			let pizzaList=['Margherita','Pepperoni','Quattro formaggi'];
// 			jsl=FORM({method:'POST'},
// 				FIELDSET(LEGEND('Pizza'),
// 					pizzaList.map( type =>//map each pizza type to its own markup 
// 						[LABEL(INPUT({type:'radio',name:'type',value:type.toLowerCase()}),type),BR()],
// 					)
// 				),
// 				LABEL(INPUT({type:'checkbox'}),'extra mozarella'),HR(),
// 				INPUT({type:'reset'}),' ',INPUT({type:'submit',disabled:true}),
// 			);
// 		}[jsd].seeAlso({'jsl.forEach':jsl.forEach}),		
// 		styleAttributes:function(){//[title=Style attributes]
// 			/**
// 			*	<i>style</i> object properties are converted to a valid css style attributes. 
// 			*	Each property of such a <i>style</i> object is treated as a css style property,
// 			*	and its name is transformed from camelCase to kebab-case. 
// 			*/
// 			jsl=DIV('styled div',{//[title=attribute-bag]
// 						title:'this is a styled div',
// 						style:{
// 							margin:'2em', padding:'1em', 
// 							borderTop   :'1px solid red', 
// 							borderBottom:['1px','dotted','blue']
// 						}
// 			});
// 		}[jsd].seeAlso({'jsl.CSS':jsl.CSS}),
// 		attributeMerging:function(){//[title=Attribute merging]
// 			/**
// 			*	With the exception of the ID attribute, the rest of attribute-bags are merged.
// 			*	In this example the tallest building defines an attribute-bag to be merged with the previously defined attributes.
// 			*/
// 			let buildings=[{name:'Burj Khalifa',height:828},{name:'Shanghai Tower',height:632},{name:'Taipei 101',height:508}];
// 			jsl=buildings.map((building,rank) =>//map each building to a <div>
// 				DIV(building.name,': ',building.height,'m',
// 					{//[title=common attribute-bag for all buildings]
// 						title:building.name,
// 						style:{color:'blue'}
// 					}, 
// 					rank>0?null:
// 					{//[title=merge this attribute-bag with the previous]
// 						title:'(tallest building!)',
// 						style:{fontWeight:'bold'}
// 					}
// 				)
// 			);
// 		},
// 		booleanAttributes:function(){//[title=Boolean attributes]
// 			/**
// 			*	In HTML, {@link https://www.w3.org/TR/html52/infrastructure.html#sec-boolean-attributes boolean attributes} are considered true by their existence alone.
// 			*	Jsl, takes this into account when generating attributes from boolean properties.
// 			*	@note	
// 			*		{@link https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/contentEditable <i>"contenteditable"</i>}
// 					and 
// 					{@link https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/spellcheck <i>"spellcheck"</i>}
// 					are enumerated, <b>not</b> boolean attributes.
// 			*/
// 			jsl=FORM(
// 				HEADER({hidden:true},'Not to be displayed!'),
// 				LABEL(INPUT({type:'checkbox',checked:true ,disabled:true}),'checked & disabled'),BR(),
// 				LABEL(INPUT({type:'checkbox',checked:false,disabled:false}),'unchecked & enabled'),BR(),
// 				INPUT({spellcheck:true,value:'click to spllcheck',autofocus:true})
// 			);
// 		},
// 		eventHandlers:function(){//[title=Event-handler attributes]
// 			/**
// 			*	<i>onevent</i> properties are treated as event-handlers, and their values can be javascript functions.
// 			*	This feature together with {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures javascript closures} allows event-handlers to be bundled with their lexical scope.
// 			*	Alternativelly you can specify an event handler using a named-function argument.
// 			*	When you pass a function named "<i>onevent</i>" as an argument to a tag-function, jsl treats it also as an event-handler.
// 			*	In the example below, each item of the <i>weatherList</i> is mapped to a <i>&lt;button&gt;</i>.
// 			*	In each button an <i>onclick</i> event-handler is defined which is aware of its lexical scope.
// 			*	The <b>onclick</b> handler is bundled with <b>cityWeather</b> thanks to its javascript closure.
// 			*	Notice that when using jsl on the server-side, the lexical scope on the browser is lost.
// 			*	In this case, you may use <b>jsl.listener</b> to bind the handler with a set of local parameters.
// 			*/
// 			const weatherList=[{city:'Amsterdam',state:'Cloudy'},{city:'Rome',state:'Sunny'},{city:'Paris',state:'Rainy'}];
// 			jsl=[
// 					H4('Event handlers defined by onclick property of object-argument'),
// 					weatherList.map( cityWeather=> BUTTON(cityWeather.city,{//[title={...} object argument is treated as attribute-bag]
// 						onclick(event){//[title=onclick property becomes an event listener]
// 							this.jsl=[I(cityWeather.city),B(': '),cityWeather.state];
// 						}
// 					})),
// 					HR(),
// 					H4('Event handlers defined by function-argument named onclick'),
// 					weatherList.map( cityWeather=> BUTTON(cityWeather.city,
// 						function onclick(event){//[title=onclick function becomes an event listener]
// 							this.jsl=[I(cityWeather.city),B(': '),cityWeather.state];
// 						}
// 					))
// 				];
// 		}[jsd].seeAlso({'jsl.listener':jsl.listener,'jsl.genericHandler':jsl.genericHandler}),
// 		generatingScripts1:function(){//[title=Generating scripts - named functions]
// 			/**
// 			*	Unbound named functions that are passed as arguments to the <i>SCRIPT</i> jsl tag-function, 
// 			*	are copied to the body of the resulting <i>&lt;script&gt;</i> element.
// 			*/
// 			jsl=[
// 				SCRIPT(
// 					function dummyClick(event){
// 						event.target.nextElementSibling.jsl.eof=H4('You clicked on dummy');
// 					}
// 				),
// 				BUTTON('try dummy',{onclick:"dummyClick(event)"}),
// 				DIV('waiting to try dummy')
// 			];
// 		}[jsd].seeAlso({'jsl.javascript':jsl.javascript}),
// 		generatingScripts2:function(){//[title=Generating scripts - anonymous functions]
// 			/**
// 			*	Anonymous functions that are passed as arguments to the <i>SCRIPT</i> jsl tag-function, 
// 			*	are copied and called in the body of the resulting <i>&lt;script&gt;</i> element.
// 			*/
// 			jsl=SCRIPT(function(){//[title=anonymous function should run when this script is loaded]
// 				jsl=SCRIPT(function(){//[title=anonymous function should run when this script is loaded]
// 					jsl=P('This paragraph was created by a script which was created by a script which.... jsl!')
// 				});
// 			});
// 		}[jsd].seeAlso({'jsl.javascript':jsl.javascript}),
// 		builderSyntax:function(){//[title=Builder syntax]
// 			/**
// 			*	As an alternative to the jsl javascript expression syntax, you may use jsl with builder syntax. 
// 			*	The builder-syntax syntactic sugar can be turned on with the initialization flag <i>builder-syntax</i>
// 			*/
// 			let pizzaList=['Margherita','Pepperoni','Quattro formaggi'];
// 			jsl=FORM({method:'POST'})
// 					.FIELDSET()
// 						.LEGEND().txt('Pizza').$LEGEND
// 						.all(pizzaList, function(type){//map each pizza type to its own markup 
// 							this.jsl.
// 							LABEL()
// 								.INPUT({type:'radio',name:'type',value:type.toLowerCase()})
// 								.txt(type)
// 							.$LABEL
// 							.BR()
// 						})
// 					.$FIELDSET
// 					.LABEL()
// 						.INPUT({type:'checkbox'})
// 						.txt('extra mozarella')
// 					.$LABEL
// 					.HR()
// 					.INPUT({type:'reset'}).txt(' ').INPUT({type:'submit',disabled:true})
// 				.$FORM;
// 		}[jsd].seeAlso({builderSyntax,'jsl.serial':insertModeDefs['jsl.serial']}),
// 		combinedSyntax:function(){//[title=Combined syntax]
// 			/**
// 			*	You may combine the two syntactic flavours to make your code more readable
// 			*/
// 			let pizzaList=['Margherita','Pepperoni','Quattro formaggi'];
// 			jsl=FORM({method:'POST'},
// 					FIELDSET(
// 						LEGEND('Pizza'),
// 						pizzaList.map(type=>[//map each pizza type to its own markup 
// 							 LABEL(
// 								INPUT({type:'radio',name:'type',value:type.toLowerCase()}),
// 								type
// 							 ),BR()
// 						])
// 					).$FIELDSET,
// 					LABEL(INPUT({type:'checkbox'}),'extra mozarella'),
// 					HR(),
// 					INPUT({type:'reset'}),' ',INPUT({type:'submit',disabled:true})
// 				).$FORM;
// 		},//[jsd].seeAlso({'jsl.transform':jsl.transform}),		
// 	}),	
// 	insertModes:function(){//[title=Insert modes]
// 	/**
// 	*	JSL provides multiple modes for inserting produced fragments in the DOM tree.
// 	*	All the insert modes are accessible as properties of the jsl proxy of any target object.
// 	*	<ul style="list-style:square">
// 	*		<li>clear the contents of the body: 
// 	* 			<code>document.body.jsl='';</code></li>
// 	* 		<li>insert a header in the begining of the document's body: 
// 	* 			<code>document.body.jsl.bof=HEADER('Header');</code></li>
// 	*		<li>insert a footer in the end of the document's body: 
// 	* 			<code>document.body.jsl.eof=FOOTER('Header');</code></li>
// 	*		<li>insert a section after the header:
// 	* 			<code>'body > header'.jsl.after=SECTION('top section');</code></li>
// 	* 		<li>insert a section before the footer:
// 	* 			<code>'body > footer'.jsl.after=SECTION('bottom section');</code></li>
// 	*		<li>replace the contents of the header:
// 	* 			<code>document.querySelector('header').jsl.inner=[H1('Header'),IMG({src:'logo.png',class:'logo'})];</code></li>
// 	*		<li>replace the image in the header with a picture element:
// 	* 			<code>'img.logo'.jsl.outer=PICTURE({class:'logo'},SOURCE({src:'logo.png'}),IMG());</code></li>
// 	* 	</ul>
// 	* 
// 	*	The following two statements demonstrate how an insert mode can be used in both syntactic flavours of JSL
// 	*	<ul style="list-style:none">
// 	*		<li><code>someDomElement.jsl.eof=DIV('a button');</code> (normal syntax)</li>
// 	*		<li><code>someDomElement.jsl.eof.DIV.txt('a button').$DIV;</code> (Builder syntax)</li>
// 	*	</ul>
// 	*	
// 	*	{@note The default insert mode of the global <i>jsl</i> proxy, and <i>document</i> is <i>jsl.eof</i>,
// 	*	&nbsp;&nbsp;&nbsp;thus both <code>jsl='foo';</code> and <code>document.jsl='foo'</code> write in the end of the document the string <i>'foo'</i>.}
// 	* 	{@note The default insert mode of any <i>HTMLElement</i>'s <i>jsl</i> proxy is <i>jsl.inner</i>, 
// 	*	&nbsp;&nbsp;&nbsp;thus <code>mydiv.jsl='foo';</code> is equivalent to <code>mydiv.jsl.inner='foo'</code>.}
// 	*/
// 	}[jsd].defines(insertModeDefs),
// 	'Event handlers':function(){
// 		/**
// 		*	jsl tag-functions treat <i>onevent</i> function-arguments and  <i>onevent</i> properties of object-arguments as event handlers.
// 		*	On the client-side the handlers are bundled with their lexical scope thanks to {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures javascript closures}.
// 		*	On the server-side you may use the jsl.listener utility function to pass extra parameters to an event-handler.
// 		* 	<ul style="list-style:square">
// 		* 		<li>make a button with an onclick event listener:
// 		* 			<code>jsl=BUTTON('clickme',{onclick(event){console.log('the button is clicked!')}})</code></li>
// 		* 		<li>an alternative way for a button with a click event:
// 		* 			<code>jsl=BUTTON('clickme',function onclick(event){console.log('the button is clicked!')})</code></li>
// 		* 	</ul>
// 		*/
// 	}[jsd].defines({
// 		'onevent properties':function(){
// 		/**
// 		*	Objects with named properties passed as tag-function parameters, are processed as attribute-bags. 
// 		*	Thus <i>onevent</i> properties having a function as value are treated as DOM events.
// 		*/
// 		}[jsd].examples({
// 			example2:function(){//[title=Event handler defined in the attribute-bag object]
// 				/**
// 				*	In this example the attribute-bag object has a property <i>onclick</i> with an event hander as value.
// 				*	The handler is aware of its lexical-scope, thus when clicking on a button, its innerText gets a value 
// 				*	based on the corresponding weather item. The native {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures javascript closure} of the handler makes this possible.
// 				*/
// 				const weatherList=[{city:'Amsterdam',state:'Cloudy'},{city:'Rome',state:'Sunny'},{city:'Paris',state:'Rainy'}];
// 				jsl=DIV(weatherList.map( item=> 
// 					BUTTON(item.city,
// 						{//[title=the object argument is treated as an attribute-bag]
// 							title:'click to see the weather',
// 							onclick(event){//[title=The property's function value becomes an event listener]
// 								/*the onclick handler is bundled with the 'item' thanks to its javascript closure*/
// 								this.innerText=item.city + '-' + item.state;
// 							}
// 						}
// 					)
// 				));
// 			}[jsd].seeAlso({'jsl.listener':jsl.listener,'jsl.genericHandler':jsl.genericHandler}),
// 		}),
// 		'onevent functions':function(){
// 		/**
// 		*	<i>onevent</i> named functions passed as tag-function parameters are treated as event handlers.
// 		*/
// 		}[jsd].examples({
// 			example1:function(){//[title=Event handler defined by a named-function argument]
// 				/**
// 				*	This example is semantically equivalent to the previous. 
// 				*	However, we use a function named <i>onclick</i> as argument to the BUTTON tag-function
// 				*	instead of an attribute-bag object.
// 				*/
// 				const weatherList=[{city:'Amsterdam',state:'Cloudy'},{city:'Rome',state:'Sunny'},{city:'Paris',state:'Rainy'}];
// 				jsl=DIV(weatherList.map( item=> 
// 						BUTTON(item.city,function onclick(event){//[title=named function becomes an event listener]
// 							/*the onclick handler is bundled with the 'item' thanks to its javascript closure*/
// 							this.innerText=item.city + '-' + item.state;
// 						})
// 					));
// 			}[jsd].seeAlso({'jsl.listener':jsl.listener,'jsl.genericHandler':jsl.genericHandler}),
// 			mergedEvents(){//[title=Two click events combined]
// 				/**
// 				*	Similarly to the rest of attributes, event handlers also get merged when a tag-function encounters more than one for the same event type.
// 				*	In this example we define two click handlers in each button.
// 				*/
// 				jsl=['a','b','c','d'].map( (item,index)=>
// 					DIV(BUTTON('button ',item,
// 						{onclick(e){this.jsl.inner='You clicked '+item}}, 
// 						{onclick(e){this.jsl.after=H4('This heading is after button ',item)}}  
// 					))
// 				);
// 			}			
// 		}),
// 		'jsl.listener':jsl.listener,
// 		'generic handlers':0 && jsl.genericHandler[jsd].examples({
// 			'Generic handler with a css selector as filter':function(){/**
// 				*	In this example we use a css selector for the generic onclick handler.
// 				*	<p>The selector allows the generic handler to filter the event's target's.
// 				*	Notice that the buttons will not have an onclick attribute assigned.
// 				*	Instead, the generated generic onclick handler will be defined as an attribute of the transformation target.
// 				*	Since only one handler is created to capture the click events on all the buttons, the handler will not have 
// 				*	access to the lexical-scope of each name in the list. Therefore we assign a data-* attribute to each button,
// 				*	and use it instead to get access to the name corresponding to the clicked button.
// 				*	</p>
// 				*/
// 				let names=['John','Anna','Jim','Tim','Elly','Alex'];
// 				jsl=UL(names.map( name => 
// 						LI(
// 							BUTTON('Call ',name,{
// 								class	:'call-button',
// 								dataName:name,
// 								onclick	:function(event){
// 									this.jsl=[B('...calling'),' ',this.dataset.name];
// 								}.jsl.genericHandler('.call-button[data-name]')
// 							})
// 						)
// 					));
// 			},
// 			'Generic handler with custom filter':function(){/**
// 				*	In this example a filter function is used to define the handler's targets
// 				*/
// 				let names=['John','Anna','Jim','Tim','Elly','Alex'];
// 				jsl=[
// 					UL(names.map( name => 
// 						LI(
// 							BUTTON('Call ',name,{
// 								dataName:name,
// 								onclick	:function(event){
// 									this.jsl=[B('Calling'),' ',I(this.dataset.name)];
// 								}.jsl.genericHandler( target => target.hasAttribute('data-name') )
// 							})
// 						)
// 					))
// 				];
// 			},
// 			'Generic handler with automatic filter':function(){/**
// 				*	In this example the genericHandler creates a filter based on the tag-name and class list of the event targets.
// 				*/
// 				let names=['John','Anna','Jim','Tim','Elly','Alex'];
// 				jsl=UL(names.map( name => 
// 						LI(
// 							BUTTON(B('Call'),' ',name,{
// 								dataName:name,
// 								class	:'name-to-call',
// 								onclick	:function(event){
// 									this.jsl=[B('Calling'),' ',I(this.dataset.name)];
// 								}.jsl.genericHandler()
// 							})
// 						)
// 					));
// 			},
// 			'Merged generic handlers':function(){/**
// 				*	Jsl merges attributes with the same name. The same holds also for event-handlers.
// 				*	So, in this example we use two generic handlers for the click event of the buttons.
// 				*		The first onclick handler captures the click event when the buttons are marked as 'calling'.
// 				*		The second onclick handler captures the click event when the buttons are not marked as 'calling'.
// 				*	We also use a generic click handler for the list items that contain the buttons.
// 				*	All these generic handlers are merged and become a single event of the root element(<i>&lt;UL&gt;</i>).
// 				*/
// 				let names=['John','Anna','Jim','Tim','Elly','Alex'];
// 				/*	-we only use the impersonateServer directive to display the merged event source in the DOM
// 					-we only use jsl.fragment to make sure that the generic-handler becomes the onclick event of the UL */
// 				jsl=UL(jsl.directives.impersonateServer(),jsl.fragment(
// 					names.map( name => 
// 						LI(
// 							function onclick(event){//[title=add a dot to the button(this should be triggered whether the button is disabled or not)]
// 								this.querySelector('button').jsl.eof='.';
// 							}.jsl.genericHandler(),//handle the event if the target has a '.call-button'
// 							BUTTON('Call ',name,{dataName:name},
// 								function onclick(event){//[title=used when the button is marked as 'calling' and it's not disabled]
// 									this.jsl=[B('Please wait'),{disabled:true}];
// 								}.jsl.genericHandler('button.calling:not(:disabled)'),
// 								function onclick(event){//[title=used when the button is not marked as 'calling']
// 									this.jsl=[B('Calling'),' ',this.dataset.name,{title:'click again...'}];
// 									this.classList.add('calling');
// 								}.jsl.genericHandler('button:not(.calling)')
// 							)
// 						)
// 					)
// 				));
// 			}[jsd].flags('important',false),
// 			'Another generic handler example':function(){
// 				/**	In this example, the function onclick will be defined as a generic-event handler.
// 				*	This means that it will have access only to the lexical-scope of the first stock item.
// 				*	So we define also a custom attribute 'stock-ref' that keeps a reference to the corresponding stock item.
// 				*	This allows access to the stock item via this.stockRef, while having only a single event handler for all items.
// 				*/
// 				/*model*/
// 				let stockList=[{type:'apples',remaining:2},{type:'bananas',remaining:15},{type:'mangos',remaining:7}];
// 				stockList.modified=jsl.eventSource();
// 				function eat(item){
// 					item.remaining>>>=1;
// 					setTimeout(stockList.modified,500);
// 				}
// 				function buy(item){
// 					item.remaining=10;
// 					setTimeout(stockList.modified,500);
// 				}
// 				/*view&controller*/
// 				jsl=UL(stockList.map(stock=> 
// 					LI(
// 						BUTTON({class:'eat-buy-button'},'we have ',(()=>[stock.remaining,' ',stock.type,' left']).sinkFor(stockList.modified,null),
// 							{
// 								/*custom attribute "stock-ref" that uses a jsl reference to the stock item*/
// 								stockRef:stock,
// 								/*onclick generic event handler*/
// 								onclick	:function(event){
// 									if(this.stockRef.remaining){
// 										this.parentElement.querySelector('div').jsl.eof=P('let\'s eat some ',this.stockRef.type);
// 										eat(this.stockRef);
// 									}else{
// 										this.parentElement.querySelector('div').jsl=P('let\'s buy more',this.stockRef.type);
// 										buy(this.stockRef);
// 									};
// 								}.jsl.genericHandler()/*make onclick a generic-event handler*/
// 							}
// 						),
// 						DIV()
// 					)
// 				));
// 			}[jsd].flags('important',false),
// 		})
// 	}),
// 	jslUtilities:function(){//[title=Utility functions], will use the examples from its defs
// 		/**
// 		*	Jsl provides a number of utility functions which can be accessed from the global <i>jsl</i> namespace.
// 		*/
// 	}[jsd].defines({
// 		transform	:jsl.transform[jsd].examples(function transformUsage(){//[title=jsl.transform usage]
// 			/**
// 			*	In the example below, we append some simple content to the end of the document
// 			*/
// 			jsl.transform(
// 				H3('A list with 2 items'),				
// 				UL(
// 					LI('1st item'),
// 					LI('2nd item'),
// 				),
// 			);
// 		}),
// 		forEach		:jsl.forEach[jsd].uses({
// 				callback(item,key,collection,results){
// 					/**	Callback function used by forEach
// 					*	@param item        item in the collection
// 					*	@param key         the name or index of the item in the collection (i.e. collection[key]===item)
// 					*	@param collection  the collection being iterated
// 					*	@param results     the array with the results that forEach will return
// 					*	@return	a value to be added in the results 
// 					*/
// 				}
// 			})[jsd].examples({forEachExample:function(){//[title=jsl.forEach() utility function]
// 				/**
// 				*	In the example below, we enumerate the properties of the <i>ingredients</i> object using the utility function jsl.forEach()
// 				*	and generate a corresponding data-* attribute  for each of them. 
// 				*/
// 				let ingredients={salt:'1tsp',pasta:'500g',garlic:'3pcs'};
// 				jsl=DIV(
// 					jsl.forEach(ingredients, (quantity,name) =>(//[title=map each ingredient to a data attribute]
// 						{['data-'+name]:quantity}
// 					)),
// 					'the data-* attributes of this div are:',
// 					UL(
// 						jsl.forEach(ingredients, (quantity,name) => LI(//[title=make a list item for each ingredient]
// 							PRE('data-',name,jsl.rdata('&Tab;="'),quantity,'"')
// 						))
// 					)
// 				);
// 			}
// 		}),
// 		listener	:jsl.listener[jsd].examples(function listenerExample(response=Object.assign(jsl.writer(),{end(){jsl=this}})){//[title=jsl.listener() utility function]
// 			/**
// 			*	In this example, the server maps a list of fruits to three respective buttons. 
// 			*	The identifier <i>fruit</i> is within the lexical scope at the server-side, but is unavailable on the client-side.
// 			*	To make our client-side handler aware of the fruit's value we declare an extra parameter in it named <i>theFruit</i>.
// 			*	Then we use jsl.listener to bundle <i>fruit</i> from the server-side, to <i>theFruit</i> on the client-side.
// 			*/
// 			response.jsl=
// 			UL(['Apples','Bananas','Coconuts'].map( fruit => 
// 				LI(BUTTON(fruit,{
// 					onclick:jsl.listener(fruit,function(event,theFruit){
// 						this.innerText=theFruit+' are the best';
// 					})
// 				}))
// 			));
// 			response.end();
// 		}),
// 		javascript	:jsl.javascript[jsd].examples(function javascriptExample(response=Object.assign(jsl.writer(),{end(){jsl=this}})){//[title=Using jsl.javascript]
// 			/**
// 			*	In the example bellow the server generates a <i>SCRIPT</i> element which should execute three different variants of a function when loaded at the client-side.
// 			*	The lexical-scope is only relevant to the server, so we use the utility function <i>jsl.javascript</i>
// 			*	to bind each of the function variants with a server-side parameter.
// 			*/
// 			response.jsl=SCRIPT(
// 				['Apples','Bananas','Coconuts'].map( fruit => //map each fruit to a different script
// 					jsl.javascript(fruit,function(theFruit){
// 						jsl=DIV(theFruit);
// 					})
// 				)
// 			);
// 			response.end();
// 		}),
// 		CSS			:jsl.CSS[jsd].examples(function cssExample(){//[title=Using jsl.CSS to generate a stylesheet]
// 			/**
// 			*	In this example a stylesheet is generated dynamically from a set of base colors.
// 			*/
// 			jsl.transform(
// 				STYLE(['brown','silver','black','white'].map( color => 
// 					jsl.CSS({//[title=based on each color generate two styles]
// 						['.'+color+'-background']:{//[title=style for background]
// 							backgroundColor: color
// 						},
// 						['.'+color+'-foreground']:{//[title=style for foreground]
// 							color: color,
// 						},
// 						['.'+color+'-background, '+'.'+color+'-foreground']:{
// 							padding: '1ch'
// 						}
// 					})
// 				))
// 			);
// 			jsl.transform(//let's give it a try
// 				DIV({class:['black-background','white-foreground']},'black on white'),
// 				DIV({class:['silver-background','brown-foreground']},'brown on silver'),
// 				DIV({class:['brown-background','black-foreground']},'black on brown'),
// 			);
// 		}),
// 		register	:jsl.register[jsd].examples({
// 			'Register a non-standardized tag as a jsl tag-function':function(){/**
// 				*	Make SVG part of the jsl framework.
// 				*/
// 				/* register the svg element svg, as a tag-function SVG(...) */
// 				jsl.register('svg',false,this);

// 				/*	make a namespace object for the rest of svg tag-functions, to keep things tiddy */
// 				var svg={};

// 				/* register the singleton svg element ellipse, as a tag-function svg.ELLIPSE(...)*/
// 				jsl.register('ellipse',true,svg);

// 				/*register the svg element text, as a tag-function svg.TEXT(...)*/
// 				jsl.register('text',false,svg);

// 				/*let's declare also a custom function that helps with svg transformations*/
// 				svg.translate=function(dx,dy){
// 					return {transform:'translate('+dx+','+dy+')'};
// 				}
// 				/*now it is JSL showtime as usual*/
// 				jsl.transform(
// 					SVG({width:'100%',height:200,style:'border:1px solid black'},
// 						jsl.forEach([0,50,100],(vx,i)=>
// 							 jsl.forEach([0,50,100],(vy,j)=>
// 								svg.ELLIPSE(svg.translate((0.5-vx/100)*48,(0.5-vy/100)*38),
// 									{cx:vx+'%',cy:vy+'%',rx:20,ry:15,style:{fill:'rgb(255,'+ vx +','+ vy +')'}})
// 							)
// 						),
// 						svg.TEXT({x:'50%',y:'50%','text-anchor':'middle'},
// 							'This how jsl2svg.js could look like...'
// 						)
// 					)
// 				);
// 			}
// 		}),
// 		rdata	:jsl.rdata[jsd].examples({
// 			rdataFromText(){//[title=string as raw html using jsl.rdata]
// 				/**
// 				*	In the example bellow we use rdata to generate raw html content from a string
// 				*/
// 				jsl=jsl.rdata('<b>This bold text</b> is generated using <i>jsl.cdata()</i>');
// 			},
// 			rdataFromFunc(){//[title=function comments as raw html using jsl.rdata]
// 				/**
// 				*	In the example bellow we use rdata to generate raw html content from the comments in a function
// 				*/
// 				jsl=jsl.rdata(function(){/*
// 					<h3><i>function</i> comments as raw html</h3>
// 					The comments of functions can be used to generate raw <b>html</b> content.<br/>
// 					This allows to create <i>html fragments</i> without having to worry about string escaping...
// 				*/});
// 			}
// 		}),
// 		cdata	:jsl.cdata[jsd].examples({
// 			cdataFromText(){//[title=escaping using jsl.cdata]
// 				/**
// 				*	In the example bellow we use cdata to escape html content
// 				*/
// 				jsl=[H3('This is the html markup for a simple html form:'),
// 					jsl.cdata(
// 						FORM({method:'POST'},INPUT({type:'submit'}))
// 					)
// 				];
// 			},
// 			cdataFromFunc(){//[title=function comments as text-content using jsl.cdata]
// 				/**
// 				*	In the example bellow we use cdata to generate html text content from the comments in a function
// 				*/
// 				jsl=[H3('This is the html markup for a simple html form:'),
// 					jsl.cdata(function(){/*
// 						<form method="post"><input type="submit"/></form>
// 					*/})
// 				];
// 			}
// 		})		
// 	}),
// 	modelViewNotifications:function(){//[title=Model-View notifications]
// 			/**
// 			* 	The model-view separation is a design pattern that is commonly used in software development to separate concerns between the data model and the view. In this pattern, the model represents the underlying state of an application, and the view displays that state to the user. The view is updated automatically whenever the model changes, and the model is updated when the user interacts with the view(controller).
// 			* 
// 			* 	This pattern is supported by JSL using model-view notifications.
// 			* 			
// 			* 	In the JSL view you may declare a function as a sink for such an event-source using <i>jsl.sinkFor()</i>.
// 			* 
// 			* 	Model-view notifications in JSL allow you to create data models that represent the state of their application. 
// 			* 
// 			* 	You can define event-sources to represent different types of changes that occure over time(e.g. data notifications from an external API).
// 			* 		Create an eventSource function which we can use to trigger notifications when a new customer is added to the database:
// 			* 		<code>const customerAdded=jsl.eventSource();</code>
// 			* 
// 			* 	Sinks in JSL are callback functions that are registered with event sources, allowing them to respond to changes in the model. 
// 			* 		Register a callback function as a sink for <i>customerAdded</i>:
// 			* 		<code>jsl.sinkFor(customerAdded,function(eventSource,customer){alert(customer.name)})</code>
// 			* 
// 			* 	Whenever you trigger a jsl event source the registered sinks are called and can update the view to reflect the current state of the model.
// 			* 		Trigger the sink we defined above:
// 			* 		<code>customerAdded({name:'Joe Doe'})</code> 
// 			* 
// 			* 	Using event sources and sinks, you can implement the model-view separation pattern, making it easier to manage complex state and update the view in response to changes in the model.			
// 			*/
// 	}[jsd].seeAlso(jsl.eventSource,jsl.sinkFor)[jsd].defines(
// 		jsl.eventSource[jsd].examples(function usage(){//[title=Usage]
// 			/**
// 			* 	The example below demonstrates the basic usage of <i>jsl.eventSource()</i> and <i>jsl.sinkFor()</i>.
// 			*/
			
// 			/** Model
// 			*	We create two event sources, <i>eatEvent</i> &amp;  <i>sleepEvent</i>, using <i>jsl.eventSource()</i>. 
// 			* 	We trigger the first event after a second by calling <i>eatEvent('time to eat')</i>, 
// 			*		The string </i>'time to eat'</i> will be passed to any event sink that will register to <i>eatEvent</i>.
// 			* 	We trigger the second event after two seconds by calling <i>sleepEvent('time to sleep')</i>, 
// 			*		The string </i>'time to sleep'</i> will be passed to any event sink that will register to <i>sleepEvent</i>.
// 			*/
// 			const eatEvent = jsl.eventSource();
// 			const sleepEvent = jsl.eventSource();			
// 			setTimeout(()=>eatEvent('time to eat'),1000);
// 			setTimeout(()=>sleepEvent('time to sleep'),2000);

// 			/** View
// 			* 	We create a view using the <i>DIV()</i> tag-function, and we use <i>jsl.sinkFor()</i> 
// 			* 	to register a callback function as a sink for both of the events.
// 			* 	The callback function takes the event source and the event data as arguments,
// 			* 	and returns a new <i>P</i> element containing some formatted content based on its arguments.
// 			*/
// 			jsl =[
// 				H3('View'),
// 				DIV(
// 					jsl.sinkFor(
// 						//register for the eatEvent
// 						eatEvent,
// 						//register for the sleepEvent
// 						sleepEvent, 
// 						//the sink callback function 
// 						(source, data) =>P(B(source==eatEvent?'eatEvent':'sleepEvent'),' says :',Q(data))						
// 					)
// 				)
// 			];			
// 		}),
// 		jsl.sinkFor[jsd].examples(function usage(){//[title=Usage]
// 			/**
// 			*	The example below demonstrates the basic usage of <i>jsl.eventSource()</i> and <i>jsl.sinkFor()</i>.
// 			*/
			
// 			/** Model
// 			*	We create a new event source using <i>jsl.eventSource()</i>. 
// 			* 	We then trigger the event when a button is clicked by calling <i>myEventSource('Hello, world!',counter++)</i>, 
// 			*		passing the string 'Hello, world!' and the counter value as data arguments for any registered sinks. 
// 			*/

// 			const myEventSource = jsl.eventSource();
// 			// Trigger eventSourceA every one second
// 			let counter=0;
// 			jsl=BUTTON('Notify any registered sinks',
// 				{
// 					title:'Click here to notify the registered sinks',
// 					onclick(){
// 						//trigger the notification of any registered sinks passing to them some data
// 						myEventSource('Hello, world!',counter++)
// 					}
// 				}
// 			);
			
// 			/** View 1
// 			* 	We create a view using the <i>DIV()</i> tag-function, and we use <i>jsl.sinkFor()</i> 
// 			* 	to register a callback function that is called whenever <i>myEventSource</i> is triggered.
// 			* 	The callback function takes the event source and the event data as arguments,
// 			* 	and returns a new <i>P</i> element containing the data passed as arguments.
// 			* 
// 			* 	In this first view we register an arrow-function as the sink callback of the event source.
// 			* 	The returned value of it replaces the content of the parent element whenever we trigger <i>myEventSource</i>
// 			*/
// 			jsl =[
// 				H3('View 1'),
// 				DIV(
// 					jsl.sinkFor(
// 						myEventSource, (source, hint, counter) => P(hint,counter)
// 					)
// 				)
// 			];
			
			
// 			/** View 2
// 			* 	In the second view we register a normal function as a sink callback for the event source.
// 			* 	Now the sink can access the parent element through <i>this</i> and append new content using the <i>eof</i> or any other JSL insert-mode.
// 			*/
			
// 			jsl=[
// 				H3('View 2'),
// 				DIV(
// 					jsl.sinkFor(myEventSource, function(source, hint, counter){
// 						this.jsl.eof=P(hint,counter);
// 					})
// 				)
// 			];
			
// 			/** View 3
// 			*	In the third view we register a sink both for <i>null</i> and for <i>myEventSource</i>.
// 			*	Registering to the <i>null</i> source will result in calling the sink immediatelly.
// 			*	This allows us to initialize the view until we receive a notification from <i>mySource</i>
// 			*/
// 			jsl=[
// 				H3('View 3'),
// 				DIV(
// 					jsl.sinkFor(
// 						//register as sink for the null event source
// 						null, 
// 						//register as sink for myEventSource
// 						myEventSource, 
// 						//the callback arrow-function
// 						(source, hint, counter)=>{
// 							if(source==null){
// 								//initialize the view
// 								return P('Nothing yet!');
// 							}else{
// 								//mySource has triggered
// 								return P(hint,counter);
// 							};
// 						}
// 					)
// 				)
// 			];
// 		}) 
// 	)[jsd].examples({
// 		simpleClock1:function(){//[title=A simple clock using JSL notifications]
// 			/**
// 			*	In this example we setup a notification source using <i>jsl.eventSource()</i>, and register a sink for it using <i>jsl.sinkFor()</i>.
// 			*	We trigger the event every second, passing to the registed sink(s) the current time. 
// 			*/
// 			/*model*/
// 			let timeChanged=jsl.eventSource();//timeChanged is now an event-source function
// 			setInterval(function(){//notify any registered sink, passing the current time as parameter
// 				timeChanged(new Date().toLocaleTimeString());
// 			},1000);
// 			/*view*/
// 			jsl=DIV(
// 				/*register an arrow function as a sink for 'timeChanged'.*/
// 				jsl.sinkFor(timeChanged,(eventSource,time)=>H1(time))
// 			);
// 		},
// 		simpleClock2:function(){//[title=A simple clock with initial value]
// 			/**
// 			*	When registering a function as a model-view sink, you can specify any number of event-sources.
// 			*	A null event-source is treated as an implicit source, instructing JSL to evaluate the sink directly.
// 			*	Just like in the previous example we trigger the event every second, passing to the registed sink(s) the current time. 
// 			*	This time however the event-sink arrow-function is registed also for the <i>null</i> source; now the timer has also an initial value.
// 			*/
// 			/*model*/
// 			let timeChanged=jsl.eventSource();//timeChanged is now an event-source function
// 			setInterval(function(){//notify any registered sink, passing the current time as parameter
// 				timeChanged(new Date().toLocaleTimeString());
// 			},1000);
// 			/*view*/
// 			jsl=DIV(
// 				/*register an arrow function as a sink for 'timeChanged', and as a default sink (null).*/
// 				jsl.sinkFor(timeChanged,null,(eventSource,time)=>H1(eventSource==timeChanged?time:'00:00:00am'))
// 			);
// 		},		
// 		sinkForNull:function(){//[title=A more comprehensive example]
// 			/**
// 			*	In the example bellow, the same function is used both to initialize the list items,
// 			*	and to append new list items when new messages are received.
// 			*/
// 			/*model*/
// 			let messagesReceived=jsl.eventSource();//timeChanged is now an event-source function
// 			let messages=['hello!','how are you?','please wait...'];
// 			let messageC=0;
// 			let hInterval=setInterval(function(){//notify the registered sink
// 				if(messageC++<10){
// 					messages.push(messageC<10?lorem(3):'last message');
// 					messagesReceived(messages.slice(-1));
// 				}else{
// 					clearInterval(hInterval);
// 				}
// 			},1000);
// 			/*view*/
// 			jsl=UL(
// 				/*Register a function as a sink for 'messagesReceived'.
// 					Besides, 'null' instructs jsl to also evaluate the function initialy.*/
// 				jsl.sinkFor(messagesReceived,null,function(eventSource,receivedMessages = messages){//[title=insert new messages in the end of the list]
// 					this.jsl.eof=receivedMessages.map(message => 
// 						LI(message,SUP(eventSource==messagesReceived?new Date().toLocaleTimeString():'initial'))
// 					);
// 				})
// 			);
// 		},	
// 		oneSourceTwoSinks:function(XMLHttpRequest=function(){
// 			Object.assign(this,{open(){},onload(){},send(){this.responseText=JSON.stringify({temperature:(Math.random()*5)|0+24}); this.onload()}})
// 		}){//[title=A model with two views]
// 			/**
// 			*	One of the advantages of model-view separation is that you can connect any number of views to the same model.
// 			*	In the example bellow two different views register their respective sinks for the <q><i>tempChanged</i></q> source. 
// 			*	The first view is displaying the current reading of a temperature sensor, while the second view is displaying historical readings.
// 			*/
// 			let model={//the model is agnostic of the views
// 				tempChanged:jsl.eventSource(),//notifier for the views
// 				getTemperature(){//interface for the controller
// 					let xhr=new XMLHttpRequest();
// 					xhr.onload=()=>this.tempChanged(JSON.parse(xhr.responseText));/*the arrow's this is the getTemperature's this*/
// 					xhr.open("GET", "resource.json");
// 					xhr.send();
// 				}
// 			};
// 			jsl=SECTION(
// 				BUTTON('Get Temperature',{onclick:model.getTemperature.bind(model)}),//controller
// 				DIV({title:'main-view'},'waiting sensor data',//1st view
// 					jsl.sinkFor(model.tempChanged,function(eventSource,sensor){//register this function as a sink for model.tempChanged
// 						this.jsl=H2(sensor.temperature);
// 					})
// 				),
// 				UL({title:'history-view'},//2nd view
// 					jsl.sinkFor(model.tempChanged,function(eventSource,sensor){//register this function as a sink for model.tempChanged
// 						this.jsl.bof=LI(new Date().toLocaleTimeString(),':',sensor.temperature);
// 					})
// 				)
// 			);
// 		},
// 		eventHandlerAsSource:function(){//[title=DOM event hander as JSL event source]
// 			/**
// 			*	Event handlers can also make use of jsl notifications. In the example bellow, the onclick event of each one of the threee  <i>radio button</i>s
// 			*	notifies all three event sinks defined in the three different <i>&lt;div&gt;</i> elements. 
// 			*/
// 			const persons=[{name:'Jose',age:27},{name:'Anna',age:22},{name:'Alex',age:30}];
// 			let buttonClicked=jsl.eventSource();
// 			jsl=[
// 				persons.map(person => 
// 					DIV(
// 						LABEL(//a label per person
// 							INPUT({type:'radio',name:'person',value:person.name},{
// 								/*the event handler of onclick is itself an eventSource that will signal its registered sinks*/
// 								onclick:buttonClicked,
// 								/*make a "data-age" attribute*/
// 								dataAge:person.age
// 							}),
// 							person.name,'(',person.age,')',
// 						)
// 					)
// 				),
// 				persons.map(person => 
// 					DIV(//and a div per person
// 						jsl.sinkFor(buttonClicked,function(eventSource,event){//[title=event-sink for button click and initial value]
// 							/*the event was triggered by clicking on the button*/
// 							if(event.target.dataset.age>person.age){
// 								return [{hidden:false},event.target.value,' is ',B('older'),' than ',person.name,'.'];
// 							}else
// 							if(event.target.dataset.age<person.age){
// 								return [{hidden:false},event.target.value,' is ',B('younger'),' than ',person.name,'.'];
// 							}else{
// 								return {hidden:true}
// 							};							
// 						})
// 					)
// 				)
// 			];
// 		},
// 		attributeSink:function(){//[title=Sink assigned to an attribute]
// 			/**
// 			*	Well known attributes can have a sink function assigned as value, allowing their dynamic modification.
// 			*	In the example bellow, the <i>&lt;div&gt</i>'s <i>style</i> is assigned a function that acts as a sink for <i>progressChanged</i>.
// 			*/
// 			const hsl=(h,s,l)=>('hsl('+ h +'deg,'+ s +'%,'+ l + '%)');
// 			let progressChanged=jsl.eventSource(),progressValue=0;
// 			setInterval(()=>progressChanged(progressValue+=5),100);
// 			jsl=DIV(B('progress-bar'),{//[title=DIV's attributes]
// 				style:jsl.sinkFor(progressChanged,(eventSource,progress)=>({color:hsl(360+(progress % 360),100,50),padding:'1em'}))
// 			})
// 		},
// 		asyncSink:function(){//[title=Asynchronous event sinks(I)]
// 			/**
// 			*	{@link  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function* Generator functions} can be used as event-sink callback functions.
// 			*	This can imporove drastically the responsiveness of otherwise time consuming pages.
// 			*	In the example bellow, a number of items is added to a list using a generator function as event-sink.
// 			*/
// 			const buttonClicked=jsl.eventSource();
// 			jsl=[
// 				BUTTON('Add more items',{onclick:buttonClicked}),
// 				OL(jsl.sinkFor(buttonClicked,null,function*(){//[title=use a generator function as an event sink]
// 					for(let i=1;i<=50;i++){//[title=Add 50 items]
// 						this.jsl.bof.transform(//[title='Add the item in the begining of the list']
// 							LI(lorem(-7))
// 						);
// 						if((i % 4)==0){//[title=yield every 4 items]
// 							yield;
// 						}
// 					};
// 				}))
// 			]
// 		},
// 		asyncSink2:function(){//[title=Asynchronous event sinks(II)]
// 			/**
// 			*	{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function async functions} can also be used as event-sink callback functions.
// 			*	In the example bellow, the the sink callback waits for a promise to resolve and then generates the content inside the ordered list.
// 			*/
// 			const fetchItems=function(){//[collapsed][title=fetch more items]
// 				/*
// 				returns a promise that will resolve to an array of three new items after 500ms
// 				*/
// 				return new Promise((resolve,reject)=>{
// 					setTimeout(()=>{
// 						resolve([lorem(-7),lorem(-7),lorem(-7)]);
// 					},500);
// 				});
// 			};
// 			const buttonClicked=jsl.eventSource();
// 			jsl=[
// 				BUTTON('Add more items',{onclick:buttonClicked}),
// 				OL(
// 					LI(lorem(-7)),LI(lorem(-7)),LI(lorem(-7)),
// 					jsl.sinkFor(buttonClicked,async function(){//[title=use a generator function as an event sink]
// 						const items=await fetchItems();
// 						this.jsl.eof=items.map(item=>LI(item));
// 					}))
// 			]
// 		},
// 		promiseAsEventSource:function(){//[title=Promise as event sources]
// 			/**
// 			*	JavaScript promises can be used as event sources for event sinks
// 			*	In the example bellow the sink callback will be triggered when the promise is resolved or rejected
// 			*/
// 			jsl=DL(jsl.sinkFor(fetch('phantom'),(soure,err,res)=>{
// 				if(res){//map each header entry to a DT/DD tupple
// 					return [...res.headers.entries()].map(e=>[
// 						DT(e[0]),
// 						DD(e[1])				
// 					])
// 				}else
// 				if(err){//return the error message
// 					return `Error:${err.message}`;
// 				}
// 			}));
// 		}
// 	}),
// 	builderSyntax,
// };

// jslHelp.builderSyntax[jsd].seeAlso({
// 	'jsl.serial':jslHelp.insertModes[jsd].defines['jsl.serial']
// });

// //jsl.internals.setupJslProxyObject[jsd].seeAlso({'insertModes':jslHelp.insertModes});
}
