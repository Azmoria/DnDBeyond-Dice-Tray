
// load stylesheets
[
	"status.css"
].forEach(function(value, index, array) {
	let l = document.createElement('link');
	l.href = chrome.runtime.getURL(value);
	l.rel = "stylesheet";
	console.log(`attempting to append ${value}`);
	(document.head || document.documentElement).appendChild(l);
});


// load scripts
let scripts = [
	// External Dependencies
	{ src: "jquery-3.6.0.min.js" },
	{ src: "main.js" }
	// Files that execute when loaded
]

// Too many of our scripts depend on each other. 
// This ensures that they are loaded sequentially to avoid any race conditions.

function injectScript() {
	if (scripts.length === 0) {
		return;
	}
	let nextScript = scripts.shift();
	let s = document.createElement('script');
	s.src = chrome.runtime.getURL(nextScript.src);
	if (nextScript.type !== undefined) {
		s.setAttribute('type', nextScript.type);
	}
	console.log(`attempting to append ${nextScript.src}`);
	s.onload = function() {
		console.log(`finished injecting ${nextScript.src}`);
		injectScript();
	};
	(document.head || document.documentElement).appendChild(s);
}

injectScript();
