/* eslint-disable no-undef */

const searchBox = document.getElementById("search-box");
const getLink = document.getElementById("get-link");
const getBtn = document.getElementById("get-btn");
const getForm = document.getElementById("get-form");
const results = document.getElementById("results");
const resultsCount = document.getElementById("results-count");
const routeActive = document.getElementById("route-active");
let routeText = routeActive.innerHTML;

const allLink = document.getElementById("all-link");
allLink.onclick = (e) => {
	if (e) e.preventDefault();
	changeRoute("/disc");
	underlineLink(allLink);
	getBtn.focus();
};

const nameLink = document.getElementById("name-link");
nameLink.onclick = (e) => {
	e.preventDefault();
	changeRoute("/disc/name");
	underlineLink(nameLink);
};

const brandLink = document.getElementById("brand-link");
brandLink.onclick = (e) => {
	e.preventDefault();
	changeRoute("/disc/brand");
	underlineLink(brandLink);
};

const categoryLink = document.getElementById("category-link");
categoryLink.onclick = (e) => {
	e.preventDefault();
	changeRoute("/disc/category");
	underlineLink(categoryLink);
};

const speedLink = document.getElementById("speed-link");
speedLink.onclick = (e) => {
	e.preventDefault();
	changeRoute("/disc/speed");
	underlineLink(speedLink);
};

const glideLink = document.getElementById("glide-link");
glideLink.onclick = (e) => {
	e.preventDefault();
	changeRoute("/disc/glide");
	underlineLink(glideLink);
};

const turnLink = document.getElementById("turn-link");
turnLink.onclick = (e) => {
	e.preventDefault();
	changeRoute("/disc/turn");
	underlineLink(turnLink);
};

const fadeLink = document.getElementById("fade-link");
fadeLink.onclick = (e) => {
	e.preventDefault();
	changeRoute("/disc/fade");
	underlineLink(fadeLink);
};

const stabilityLink = document.getElementById("stability-link");
stabilityLink.onclick = (e) => {
	e.preventDefault();
	changeRoute("/disc/stability");
	searchBox.disabled = false;
	underlineLink(stabilityLink);
};

const queryLink = document.getElementById("query-link");
queryLink.onclick = (e) => {
	e.preventDefault();
	changeRoute("/disc?");
	searchBox.disabled = false;
	underlineLink(queryLink);
};

const changeRoute = (newRouteText) => {
	routeText = newRouteText;
	routeActive.innerHTML = newRouteText;
	routeActive.href = newRouteText;
	getLink.href = newRouteText;
	searchBox.value = "";

	if (routeText === "/disc") {
		searchBox.disabled = true;
	} else {
		searchBox.disabled = false;
		searchBox.focus();
	}
};

searchBox.oninput = () => {
	if (searchBox.value) {
		const inputText = slugify(searchBox.value);
		routeActive.innerHTML = `${routeText}${routeText === "/disc?" || !inputText ? "" : "/"}${inputText}`;
		routeActive.href = routeActive.innerHTML;
		getLink.href = routeActive.innerHTML;
	} else routeActive.innerHTML = routeText;

	setSearchBoxWidth();
};

const slugify = (text) => {
	let slug = text.toLowerCase()
		.replace(/[/\\#,+()$~%!@^|`.'":;*?<>{}[\]]/g, "")
		.replace(/[ ]/g, "-");
	return slug;
};

let ghostInput = document.createElement("div");
const setUpGhostInput = () => {
	ghostInput.style.position = "absolute";
	ghostInput.style.top = "0";
	ghostInput.style.left = "-9999px";
	ghostInput.style.overflow = "hidden";
	ghostInput.style.visibility = "hidden";
	ghostInput.style.whiteSpace = "nowrap";
	ghostInput.style.height = "0";

	const styles = window.getComputedStyle(searchBox);

	ghostInput.style.fontFamily = styles.fontFamily;
	ghostInput.style.fontSize = styles.fontSize;
	ghostInput.style.fontStyle = styles.fontStyle;
	ghostInput.style.fontWeight = styles.fontWeight;
	ghostInput.style.letterSpacing = styles.letterSpacing;
	ghostInput.style.textTransform = styles.textTransform;

	ghostInput.style.borderLeftWidth = styles.borderLeftWidth;
	ghostInput.style.borderRightWidth = styles.borderRightWidth;
	ghostInput.style.paddingLeft = styles.paddingLeft;
	ghostInput.style.paddingRight = styles.paddingRight;

	document.body.appendChild(ghostInput);
};

const setSearchBoxWidth = () => {
    const string = searchBox.value || searchBox.getAttribute("placeholder") || "";
    ghostInput.innerHTML = string.replace(/\s/g, "&" + "nbsp;");

    const ghostInputStyles = window.getComputedStyle(ghostInput);
    searchBox.style.width = ghostInputStyles.width;
};

const underlineLink = (link) => {
	allLink.style.textDecoration = "none";
	nameLink.style.textDecoration = "none";
	brandLink.style.textDecoration = "none";
	categoryLink.style.textDecoration = "none";
	speedLink.style.textDecoration = "none";
	glideLink.style.textDecoration = "none";
	turnLink.style.textDecoration = "none";
	fadeLink.style.textDecoration = "none";
	stabilityLink.style.textDecoration = "none";
	queryLink.style.textDecoration = "none";
	link.style.textDecoration = "underline";
};

let start, resTime;
getForm.addEventListener("submit", (e) => {
	start = Date.now();
	e.preventDefault();
	const headers = {
		"Content-Type": "application/json"
	};
	const method = "GET", route = routeActive.innerHTML;
	request(method, route, headers, null).then(res => {
		resTime = Date.now() - start;
		if (res) {
			resultsCount.innerHTML = `${res.length} result${res.length === 1 ? "" : "s"} • ${resTime} ms`;
			results.innerHTML = JSON.stringify(res, null, 2);
			results.style.visibility = "visible";
			resizeResults();
		}
	}).catch(err => console.log(err));
});

const request = (method, uri, headers, body) => {
	return new Promise((resolve, reject) => {
		fetch(uri, { method, headers, body }
		).then(r => r.json()).then(data => {
			return resolve(data);
		}).catch(e => {
			return reject(e);
		});
	});
};

window.addEventListener("resize", () => {
	resizeResults();
});

const resizeResults = () => {
	let widthNum = 600;
	if (window.innerWidth * 0.95 < 600 ) {
		widthNum = Math.floor(window.innerWidth * 0.95);
		results.style.width = `${widthNum}px`;
	} else {
		results.style.width = "600px";
	}
	results.style.height = `${window.innerHeight - results.offsetTop - 48}px`;
};

setUpGhostInput();
changeRoute("/disc");
underlineLink(allLink);
getBtn.focus();