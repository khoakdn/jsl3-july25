const JslObjBuilder = HTML().constructor;

const extractTextFromJslOut = (from) => {
    if (Array.isArray(from)) {
        return from.reduce((text, item) => text + ", " + extractTextFromJslOut(item), "");
    } else if (from instanceof JslObjBuilder) {
        return from.contents ? extractTextFromJslOut(from.contents) : "";
    } else {
        return from.toString();
    }
};

const searchableJSL = (
    jsl.forEach(jslHelp, (navtopic, name) =>
        LI({
                goto_topic: () => {
                    'body > main'.jsl = makeTopicPage(jslHelp, name, true); // Ensure NAV appears
                }
            },
            H1(extractFnTitle(navtopic) || name),
            NAV( // Include navigation bar in search data
                UL(
                    jsl.forEach(jslHelp, (navItem, navName) =>
                        LI(
                            A(extractFnTitle(navItem) || navName, {
                                class: navName === name ? 'active' : '',
                                onclick(e) {
                                    'body > main'.jsl = makeTopicPage(jslHelp, navName, true);
                                }
                            })
                        )
                    )
                )
            ),
            makeTopicPage(jslHelp, name, true), // Ensure NAV is included
            !navtopic[jsd].raw.defines ? '' :
            UL(
                jsl.forEach(navtopic[jsd].defines, (subtopic, subname) =>
                    LI({
                            goto_topic: () => {
                                'body > main'.jsl = makeTopicPage(navtopic[jsd].defines, subname, true);
                            }
                        },
                        H2(extractFnTitle(subtopic) || subname),
                        makeTopicPage(navtopic[jsd].defines, subname, true)
                    )
                )
            )
        )
    , true)
);


const findTextInJslOut = (text, from, goto_list, excerpts) => {
    if (Array.isArray(from)) {
        return from.find((item) => findTextInJslOut(text, item, goto_list, excerpts));
    } else if (from instanceof JslObjBuilder) {
        const res = from.contents ? findTextInJslOut(text, from.contents, goto_list, excerpts) : false;
        if (res) {
            if (from?.atts?.goto_topic) {
                goto_list.push(from.atts.goto_topic);
                console.log("Added goto_topic function:", from.atts.goto_topic); // Debugging
            } else {
                console.warn("goto_topic function not found in:", from); // Debugging
                return true; // use the parent goto_topic
            }
        }
    } else {
        from = from.toString();
        const ix = from.indexOf(text);
        if (ix >= 0) {
            excerpts.push(from.slice(Math.max(0, ix - 20), ix + text.length + 20));
        }
        return ix >= 0;
    }
};

export const findTextInDoc = (text) => {
    const goto_list = [], excerpts = [];
    findTextInJslOut(text, searchableJSL, goto_list, excerpts);

    const searchResultsList = document.getElementById('searchResultsList');
    searchResultsList.innerHTML = ''; // Clear previous results
    console.log({goto_list, excerpts});

    if (excerpts.length > 0) {
        excerpts.forEach((excerpt, index) => {
            const li = document.createElement('li');
            const highlightedExcerpt = excerpt.replace(
                new RegExp(text, 'gi'),
                (match) => `<span class="highlight">${match}</span>`
            );
            li.innerHTML = highlightedExcerpt;

            // Add event listener to navigate to the topic page with NAV
            li.addEventListener('click', () => {
                if (typeof goto_list[index] === 'function') {
                    let topicName = Object.keys(jslHelp).find(key => goto_list[index].toString().includes(key));
                    if (topicName) {
                        // Ensure NAV appears with the search result
                        'body > main'.jsl = makeTopicPage(jslHelp, topicName, true);
                    }
                    goto_list[index]();
                } else if (typeof goto_list[index] === 'string') {
                    eval(goto_list[index]); // Execute string-based navigation
                } else {
                    console.error("goto_topic function not found for index:", index);
                }
            });

            searchResultsList.appendChild(li);
        });
    } else {
        // Handle case when no results are found
        searchResultsList.innerHTML = '<li>No results found.</li>';
    }
    return { goto_list, excerpts };
};


// Debugging and initial test
const goto_list = [], excerpts = [];
findTextInJslOut("list item", searchableJSL, goto_list, excerpts);
console.log("search results:", {
    goto_list,
    excerpts
});

// Add event listener to document
document.addEventListener('click', (event) => {
    const searchResultsList = document.getElementById('searchResultsList');
    if (!searchResultsList.contains(event.target)) {
      // Clear search results list
      searchResultsList.innerHTML = '';
    }
  });