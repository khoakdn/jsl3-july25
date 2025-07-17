export const DEFHEADER=(...args)=>HEADER(
    NAV({class: 'navbar'},
        DIV({class: 'navbar-logo'}, A(IMG({src: './images/jsl3-logo.jpg'}), {href: 'index.html'}), 'JSL',SUB(3)),
        DIV({class:'searchbox'},
            INPUT({type: 'text', placeholder: 'Search...', class: 'search-bar', id:"searchBar"},function oninput(e){
                console.log('search input',this.value);
                import("./jsl-search.js").then(({findTextInDoc})=>{
                    const res=findTextInDoc(this.value);
                    console.log(res);
               });
            }),
                UL({id:"searchResultsList"}),
        ),
        DIV({class: 'navbar-links'},
            A(IMG({src: './images/docs.png', alt: 'docs'}),{href: 'docs.html', class:"docs"}, 'Docs'),
            // ...args,
            A(IMG({src: './images/playgr.png', alt: 'playground'}),{href: 'playground.html'}, 'Playground'),
            A({href: 'https://github.com', target:'blank'}, IMG({src: './images/github.png', alt: 'GitHub'})),
        )
    )
);

        // class JslObjBuilder {
        //     constructor(contents) {
        //         this.contents = contents;
        //     }
        // }

        // const extractTextFromJslOut = (from) => {
        //     if (Array.isArray(from)) {
        //         return from.reduce((text, item) => text + " " + extractTextFromJslOut(item), "");
        //     } else if (from instanceof JslObjBuilder) {
        //         return from.contents ? extractTextFromJslOut(from.contents) : "";
        //     } else {
        //         return from.toString();
        //     }
        // };

        // const makeTopicPage = (source, name) => `
        //     <h1>${name}</h1>
        //     <p>${extractTextFromJslOut(source[name].contents)}</p>
        // `;

        // const findTextInJslOut = (text, from, goto_list, excerpts) => {
        //     Object.keys(from).forEach((key) => {
        //         const item = from[key];
        //         const content = extractTextFromJslOut(item.contents);
        //         const index = content.toLowerCase().indexOf(text.toLowerCase());
        //         if (index >= 0) {
        //             excerpts.push(`${key}: ${content.slice(index, index + 50)}...`);
        //             goto_list.push(() => {
        //                 document.getElementById("content").innerHTML = makeTopicPage(from, key);
        //             });
        //         }
        //     });
        // };

        // const jslHelp = {
        //     "Introduction": new JslObjBuilder("Welcome to JSL! Learn the basics of our library."),
        //     "Quick Start": new JslObjBuilder("Get started quickly with JSL using these guides."),
        //     "Advanced Features": new JslObjBuilder("Explore advanced features and capabilities of JSL."),
        // };

        // document.addEventListener("DOMContentLoaded", () => {
        //     const searchBar = document.getElementById("searchBar");
        //     const resultsDiv = document.getElementById("results");

        //     searchBar.addEventListener("input", (event) => {
        //         const query = event.target.value.trim().toLowerCase();
        //         resultsDiv.innerHTML = "";
        //         resultsDiv.style.display = query ? "block" : "none";

        //         if (query) {
        //             const goto_list = [];
        //             const excerpts = [];
        //             findTextInJslOut(query, jslHelp, goto_list, excerpts);

        //             excerpts.forEach((excerpt, index) => {
        //                 const resultItem = document.createElement("li");
        //                 resultItem.textContent = excerpt;
        //                 resultItem.addEventListener("click", () => {
        //                     goto_list[index](); 
        //                     resultsDiv.style.display = "none"; 
        //                     searchBar.value = ""; 
        //                 });
        //                 resultsDiv.appendChild(resultItem);
        //             });
        //         }
        //     });
        // });