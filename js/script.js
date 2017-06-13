/*

Startpage.

Still working on:

-Users can add own commands
-Better localstorage handling
-Code as clean as possible

*/

const UPDATE_NOTES_TIMER = 3000; //3 seconds

const HELP_INFO_TEXT = "Type /help for a list of all commands.";
const NOTES_DEFAULT_TEXT = "Your notes are saved as you write, so start writing!";
const NOTES_ERROR_TEXT = "Uh-oh! It seems your browser doesn't support local storage, so unfortunately notes will not be saved " + 
						 "when you close or navigate away from this page. You can still write notes here, they just won't save.";
const IMPORT_ERROR_TEXT = "Error while importing.";
const EXPORT_ERROR_TEXT = "Error while exporting.";
const HELP_TEXT = "HELP MANUAL<br><br>Valid commands will highlight red in the search bar<br>" +
	"Type /help [command] for details of a specific command<br><br>Command list<br><br>" + getAllCommands() + 
	"<br><br>Hold Shift to force Google search<br>Hold Option to force Google \"I'm Feeling Lucky\" search" + 
	"<br>Search multiple commands at once using a semicolon to separate them";

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

function getAllCommands(){
	var allcs = [];
	for (var i=0; i<commands.length; i++){
		allcs.push(commands[i].name);
	}
	return allcs.sort().join(", ");
}

function getHelp(c){
	//c is a dictionary representation of a command
	return "HELP MANUAL<br><br>NAME<br>&emsp;&emsp;" + c.name + " - " + c.desc + "<br><br>COMMANDS<br>&emsp;&emsp;" +
		c.cmd.join(", ") + ((c.url != null) ? ("<br><br>OPEN<br>&emsp;&emsp;" + c.url) : "") + 
		((c.search != null) ? ("<br><br>SEARCH<br>&emsp;&emsp;" + c.url+c.search) : "");
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
	document.onkeypress = handleEscapeKey;
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
						for (var j=0; j<commands[i].cmd.length; j++){
							if (commands[i].cmd[j] == comArg){
								found_command = true;
								log(getHelp(commands[i]));
							}
						}
					}
					if (!found_command){
						log(HELP_TEXT);
					}
				} else {
					log(HELP_TEXT);
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
			default:
				log(HELP_INFO_TEXT);
		}
		box.value = "";
	}
	//if it doesn't start with a / then run a search
	else {
		var args = com.split(" ");
		for (var i=0; i<commands.length; i++){
			for (var j=0; j<commands[i].cmd.length; j++){
				if (commands[i].cmd[j] == args[0]){
					if (args.length > 1 && commands[i].search != null){
						nav(commands[i].url+commands[i].search+args.slice(1, args.length).join(" "), inNewTab);
						return;
					} else if (args.length <= 1) {
						nav(commands[i].url, inNewTab);
						return;
					}
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
	console.log(password);
	if (!password) {
		password = "public";
	}
	return CryptoJS.AES.encrypt(export_string, password);
}

function import_storage(encrypted, password){
	if (!password) {
		password = "public";
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
