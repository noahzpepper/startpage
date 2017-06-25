/*

Startpage.

Features to add?

-Code as clean as possible, seriously clean up code
-Timer
-Calendar
-Show the time on the screen
-CSS updates?
*/

const UPDATE_NOTES_TIMER = 3000; //3 seconds

const HELP_INFO_TEXT = "Type /help for a list of all commands.";
const NOTES_DEFAULT_TEXT = "Your notes are saved as you write, so start writing!";
const NOTES_ERROR_TEXT = "Uh-oh! It seems your browser doesn't support local storage, so unfortunately notes will not be saved " + 
						 "when you close or navigate away from this page. You can still write notes here, they just won't save.";
const IMPORT_ERROR_TEXT = "Error while importing.";
const EXPORT_ERROR_TEXT = "Error while exporting.";
const ERROR_TEXT = "An error occurred.";

const HOW_TO_USE_TEXT = "This is a startpage. Typing into the searchbar will search Google. You can also use shortcuts to " + 
						"search other websites and quickly open links. Shown below are a few examples of searches:<br><br>" +
						"<span style='color:firebrick'>amazon wireless headphones</span>: search Amazon for 'wireless headphones'<br>" +
						"<span style='color:firebrick'>facebook</span>: open Facebook<br><span style='color:firebrick'>images beagle</span>: search Google Images for 'beagle'<br>" +
						"<span style='color:firebrick'>youtube</span>: open Youtube<br><span style='color:firebrick'>youtube bruno mars</span>: search Youtube for 'bruno mars'<br><br>" +
						"20 commands are built-in by default. See the full list of built-in shortcuts using <span style='color:firebrick'>/help</span>. " +
						"You can also add your own using <span style='color:firebrick'>/edit</span>, <span style='color:firebrick'>/alias</span>, and <span style='color:firebrick'>/delete</span>.<br><br>" + 
						"To exit a display, such as this one, use the Escape key, or type <span style='color:firebrick'>/hide</span>. You can always return to this introduction with <span style='color:firebrick'>/intro</span>.";

var highlightColor = 'firebrick';

//Some standard url regex 
const URL_PATTERN = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)?/i;

var box = document.getElementById("search-box");
var notes_container = document.getElementById("notes-container");
var display_container = document.getElementById("display-container");
var notes = document.getElementById("notes");
var bg = document.getElementById("bg");

function log(contents){
	setActiveContainer(display_container);
	setDisplayContainerContents(contents);
}

function setActiveContainer(container){
	display_container.style.visibility = "hidden";
	notes_container.style.visibility = "hidden";
	if (container != null){
		container.style.visibility = "visible";
		fade(bg);
	} else {
		unfade(bg);
	}
}

function setDisplayContainerContents(contents){
	display_container.innerHTML = contents;
}

function getHelpText(){
	var allcs = [];
	for (var i=0; i<commands.length; i++){
		allcs.push(((commands[i].alias != null) ? "<em>" : "") + commands[i].name + ((commands[i].alias != null) ? "</em>" : ""));
	}
	sorted = allcs.sort().join(", ");
	return "HELP MANUAL<br><br>Valid commands will highlight red in the search bar<br>" +
	"Type /help [command] for details of a specific command<br><br>Command list (aliases are italicized)<br><br>" + sorted + 
	"<br><br>Hold Shift to force Google search<br>Hold Option to force Google \"I'm Feeling Lucky\" search" + 
	"<br>Search multiple commands at once using a semicolon to separate them";
}

function getHelp(c){
	//c is a dictionary representation of a command
	if (c.iscmd != null) {
		return c.iscmd;
	}
	if (c.alias != null) {
		return "HELP MANUAL<br><br>SHORTCUT<br>&emsp;&emsp;&emsp;&emsp;" + c.name + "<br><br>ALIAS TO<br>&emsp;&emsp;&emsp;&emsp;" +c.alias;
	}
	return "HELP MANUAL<br><br>SHORTCUT<br>&emsp;&emsp;&emsp;&emsp;" + c.name + "<br><br>OPEN<br>&emsp;&emsp;&emsp;&emsp;" +
			((c.url != null) ? c.url : "(no open link)") + "<br><br>SEARCH<br>&emsp;&emsp;&emsp;&emsp;" + 
			((c.search != null) ? c.search : "(no search link)");
}

// Navigates to an address
function nav(address, openInNewTab) {
	if (!URL_PATTERN.test(address)) {
		address = "http://" + address;
	}
	if (openInNewTab) {
		window.open(address);
	} else {
		document.location.href = address;
	}
}

// Handle key presses in terminal input field
function checkCommandsKeyPress(e) {
	e = e || window.event;
	var modifier = false;
	if (e.keyCode == 13) { //enter key
		if (e.shiftKey){
			modifier = "shift";
		} else if (e.altKey){
			modifier = "option";
		}
		parseCommand(box.value, modifier, false);
	} else if (e.keyCode == 27) { //escape key
		box.focus();
		box.value = "";
		setActiveContainer(null);
	}
}

function checkCommandsKeyDown(e) {
	e = e || window.event;
	if (e.altKey || e.shiftKey) {
		box.style.color = 'black';
	}
}

function checkCommandsKeyUp(e) {
	e = e || window.event;
	if (box.value.indexOf(';') != -1) {
		box.style.color = highlightColor;
		return;
	}
	for (var i = 0; i < searching_cmds.length; i += 1) {
		if (!e.altKey && !e.shiftKey && box.value.startsWith(searching_cmds[i] + " ") && box.value.length > searching_cmds[i].length || box.value == searching_cmds[i]) {
			box.style.color = highlightColor;
			return;
		}
	}
	for (var i = 0; i < non_searching_cmds.length; i += 1) {
		if (!e.altKey && !e.shiftKey && box.value == non_searching_cmds[i]) {
			box.style.color = highlightColor;
			return;
		}
	}
	box.style.color = 'black';
}

function handleEscapeKey(e) {
	e = e || window.event;
	if (e.keyCode == 27){ //escape key
		box.focus();
		setActiveContainer(null);
	}
}
//Handle key presses in notes textarea
function notesKeyPress(e){
	handleEscapeKey(e);
}

// focus the search box on load, escape key works
window.onload = function() {
	box.focus();
	box.value = "";
	document.onkeypress = handleEscapeKey;
	if (storageAvailable && localStorage["intro"] == null) {
		box.placeholder = "/intro";
	}
};

// parse the user's command
function parseCommand(com, keydown, inNewTab) {
	//don't search an empty terminal
	if (com == ""){
	}
	//option means a lucky search
	else if (keydown == "option"){
		com = com.replace('&','%26');
		nav("https://www.google.com/search?btnI=I%27m+Feeling+Lucky&q=" + com, inNewTab);
	}
	//shift means a google search
	else if (keydown == "shift"){
		com = com.replace('&','%26');
		nav("https://www.google.com/search?q=" + com, inNewTab);
	}
	//semicolon means multiple commands
	else if (com.includes(";")) {
		var comArray = com.split(";");
		for (var i = 1; i < comArray.length; i++) {
			parseCommand(comArray[i].trim(), false, true);
		}
		parseCommand(comArray[0], false, false);
	}
	//if it starts with a /, it must be a command
	else if (com.startsWith("/")){
		var comArray = com.slice(1, com.length).split(" ");
		var comName = comArray[0];
		var comArg = false;
		if (comArray[1] != null){
			comArg = comArray.slice(1, comArray.length).join(" ");
		}
		switch (comName) {
			case "help":
				found_command = false;
				if (comArg){
					for (var i=0; i<commands.length; i++){
						if (commands[i].name == comArg || commands[i].name.substring(1) == comArg) {
							found_command = true;
							log(getHelp(commands[i]));
						}
					}
					if (!found_command){
						log(getHelpText());
					}
				} else {
					log(getHelpText());
				}
				break;
			case "notes":
				setActiveContainer(notes_container);
				break;
			case "hide":
				setActiveContainer(null);
				break;
			case "export":
				if (storageAvailable) {
					log("Copy this text and save it somewhere safe:<br><br>" + export_storage(comArg));
				} else {
					log(EXPORT_ERROR_TEXT);
				}
				break;
			case "import":
				if (storageAvailable && comArg && import_storage(comArray[1], comArray[2])) {
					log("Successfully imported settings. Refresh for all changes to take effect.");
				} else {
					log(IMPORT_ERROR_TEXT);
				}
				break;
			case "alias":
				if (comArray.length == 3) { //check that exactly 2 args
					new_index = -1;
					existing_index = -1;
					for (var i=0; i < commands.length; i++) { //loop through commands
						if (commands[i].name == comArray[1]) {
							new_index = i;
						}
						if (commands[i].name == comArray[2]) {
							existing_index = i;
						}
					}
					if (existing_index == -1 || new_index == existing_index || (new_index > -1 && commands[new_index].alias == null) || commands[existing_index].alias != null || comArray[1].indexOf("/") > -1) {
						log(ERROR_TEXT);
					} else {
						if (new_index == -1) {
							commands.push({name: comArray[1], alias: comArray[2], url: null, search: commands[existing_index].search == null ? null : "", iscmd: null});
						} else {
							commands[new_index] = {name: comArray[1], alias: comArray[2], url: null, search: commands[existing_index].search == null ? null : "", iscmd: null};
						}
						refreshCommandList();
						log("Updated alias. " + comArray[1] + " now points to " + comArray[2] + ".");
						localStorage["commands"] = JSON.stringify(commands);
					}
				} else {
					log(ERROR_TEXT);
				}
				break;
			case "delete":
				for (var i=0; i < commands.length; i++) {
					if (commands[i].name == comArray[1] && commands[i].iscmd == null) {
						commands.splice(i, 1);
						refreshCommandList();
						log("Deleted " + comArray[1] + ". This cannot be undone.");
						localStorage["commands"] = JSON.stringify(commands);
						break;
					}
				}
				log(ERROR_TEXT);
				break;
			case "edit":
				if (comArray.length < 4) {
					log(ERROR_TEXT);
					break;
				}
				url = null;
				search = null;
				if (comArray[2] == "-o") {
					url = comArray[3];
				} else if (comArray[2] == "-s") {
					search = comArray[3];
				}
				if (comArray.length > 5) {
					if (comArray[4] == "-o") {
						url = comArray[5];
					} else if (comArray[4] == "-s") {
						search = comArray[5];
					}
				}
				if (url == null && search == null) {
					log(ERROR_TEXT);
					break;
				}
				index = -1;
				for (var i=0; i < commands.length; i++) {
					if (commands[i].name == comArray[1]) {
						index = i;
					}
				}
				if (index > -1) {
					commands[index].url = url;
					commands[index].search = search;
				} else {
					commands.push({name: comArray[1], alias: null, url: url, search: search, iscmd: null});
				}
				refreshCommandList();
				log("Updated command information for " + comArray[1] + ".");
				localStorage["commands"] = JSON.stringify(commands);
				break;
			case "reset":
				if (confirm("Are you sure you want to reset the startpage to the default state?\nYou will lose ALL custom shortcuts, aliases, and notes.\nExporting your save data before resetting is highly recommended.")) {
					localStorage.clear();
					box.placeholder = "/intro";
					box.style.color = "black";
				}
				break;
			case "intro":
				log(HOW_TO_USE_TEXT);
				localStorage["intro"] = "seen";
				box.placeholder = "";
				break;
			default:
				log(HELP_INFO_TEXT);
		}
		box.value = "";
	}
	//if it doesn't start with a / then run a search
	else {
		var args = com.split(" ");
		comName = args[0];
		comArg = args.slice(1, args.length).join(" ");
		for (var i=0; i<commands.length; i++){
			if (commands[i].name == args[0]){
				if (commands[i].alias != null) {
					parseCommand(commands[i].alias + (args.length > 1 ? (" " + comArg) : ""), keydown, inNewTab);
					return;
				} else if (args.length > 1 && commands[i].search != null){
					nav(commands[i].search + comArg, inNewTab);
					return;
				} else if (args.length <= 1) {
					nav(commands[i].url, inNewTab);
					return;
				}
			}
		}
		if (URL_PATTERN.test(com)){
			nav(com, inNewTab);
		} else {
			com = com.replace('&','%26');
			nav("https://www.google.com/search?q=" + com, inNewTab);
		}
	}
}

function updateNotes(){
	notes.addEventListener('input', function() {
		localStorage["notes"] = notes.value;

		this.style.height = "auto";
		this.style.height = (this.scrollHeight) + "px";
	});
}
function writeNotes(){
	if (storageAvailable) {
		content = localStorage["notes"];

		if (content) {
			notes.value = content;
			notes.setAttribute("style", "height:" + (notes.scrollHeight) + "px;overflow-y:hidden;");
		}
		else {
			notes.value = NOTES_DEFAULT_TEXT;
		}

	} else {
		log(NOTES_ERROR_TEXT);
	}
}

writeNotes();
updateNotes();

function export_storage(password){
	export_string = JSON.stringify(localStorage);
	if (!password) {
		password = "";
	}
	return CryptoJS.AES.encrypt(export_string, password);
}

function import_storage(encrypted, password){
	if (!password) {
		password = "";
	}
	decrypted = CryptoJS.AES.decrypt(encrypted, password);
	try {
		str = decrypted.toString(CryptoJS.enc.Utf8);
		var data = JSON.parse(str);
		localStorage.clear();
		for (var key in data) {
			localStorage.setItem(key, data[key]);
		}
		return true;
	} catch (e) {
		return false;
	}
}

/* The below functions came from StackOverflow:
		https://stackoverflow.com/questions/6121203/how-to-do-fade-in-and-fade-out-with-javascript-and-css
*/

function fade(element) {
	var op = 1;  // initial opacity
	var timer = setInterval(function () {
		if (op <= 0.1){
			clearInterval(timer);
			element.style.display = 'none';
		}
		element.style.opacity = op;
		element.style.filter = 'alpha(opacity=' + op * 100 + ")";
		op -= op * 0.1;
	}, 5);
}

function unfade(element) {
	if (!element.style.opacity || element.style.opacity >= 1) {
		return;
	}
	var op = 0.1;  // initial opacity
	element.style.display = 'block';
	var timer = setInterval(function () {
		if (op >= 1){
			clearInterval(timer);
		}
		element.style.opacity = op;
		element.style.filter = 'alpha(opacity=' + op * 100 + ")";
		op += op * 0.1;
	}, 5);
}
