const storageAvailable = typeof(Storage) !== "undefined";

//Define all the commands help text separately because they aren't as formulaic

const alias_text = "HELP MANUAL<br><br>COMMAND<br>&emsp;&emsp;&emsp;&emsp;/alias - link a shortcut to another shortcut<br><br>USAGE<br>&emsp;&emsp;&emsp;&emsp;" +
			"/alias <u>new</u> <u>existing</u><br><br>DESCRIPTION<br>&emsp;&emsp;&emsp;&emsp;/alias links a shortcut to another shortcut. " + 
			"<u>existing</u> must be an existing shortcut that is not an alias. <u>new</u> must be not be an existing shortcut. The end result will be a link from <u>new</u>, the new alias, " +
			"to <u>existing</u>, the existing shortcut.";

const delete_text = "HELP MANUAL<br><br>COMMAND<br>&emsp;&emsp;&emsp;&emsp;/delete - delete a shortcut<br><br>USAGE<br>&emsp;&emsp;&emsp;&emsp;" +
			"/delete <u>name</u><br><br>DESCRIPTION<br>&emsp;&emsp;&emsp;&emsp;/delete deletes an existing shortcut with the given <u>name</u>. " + 
			"This happens without any prompt, so please use this command carefully.";

const edit_text = "HELP MANUAL<br><br>COMMAND<br>&emsp;&emsp;&emsp;&emsp;/edit - edit a shortcut<br><br>USAGE<br>&emsp;&emsp;&emsp;&emsp;" +
			"/edit <u>name</u> [-o <u>open</u>] [-s <u>search</u>]<br><br>DESCRIPTION<br>&emsp;&emsp;&emsp;&emsp;/edit edits an existing shortcut with the given <u>name</u>, " + 
			"or creates the shortcut if it does not yet exist." +
			" The -o flag links the shortcut to the given <u>open</u> link. The -s flag links the shortcut to the given <u>search</u> link." +
			" Providing text instead of a link for <u>open</u> or <u>search</u> will lead to unexpected results when the command is used."
			" Both <u>open</u> and <u>search</u> must not have any spaces in them.";

const export_text = "HELP MANUAL<br><br>COMMAND<br>&emsp;&emsp;&emsp;&emsp;/export - export startpage settings to text<br><br>USAGE<br>&emsp;&emsp;&emsp;&emsp;" +
			"/export [<u>password</u>]<br><br>DESCRIPTION<br>&emsp;&emsp;&emsp;&emsp;/export displays text to the screen that can be copied " + 
			"and imported at a later time. Providing a <u>password</u> encrypts the data with it, and must be provided along with the text " +
			"when imported."; 

const help_text = "HELP MANUAL<br><br>COMMAND<br>&emsp;&emsp;&emsp;&emsp;/help - display help pages<br><br>USAGE<br>&emsp;&emsp;&emsp;&emsp;" +
			"/help [<u>command</u>]<br><br>DESCRIPTION<br>&emsp;&emsp;&emsp;&emsp;/help displays the help pages for all startpage commands. " + 
			"If you specify a <u>command</u>, the help pages for that specific command are shown.";

const hide_text = "HELP MANUAL<br><br>COMMAND<br>&emsp;&emsp;&emsp;&emsp;/hide - hide displays<br><br>USAGE<br>&emsp;&emsp;&emsp;&emsp;" +
			"/hide, &lt;ESC&gt;<br><br>DESCRIPTION<br>&emsp;&emsp;&emsp;&emsp;/hide hides all displays.";

const notes_text = "HELP MANUAL<br><br>COMMAND<br>&emsp;&emsp;&emsp;&emsp;/notes - display notepad<br><br>USAGE<br>&emsp;&emsp;&emsp;&emsp;" +
			"/notes<br><br>DESCRIPTION<br>&emsp;&emsp;&emsp;&emsp;/notes displays the notepad. Notes typed in the notepad will save " + 
			"automatically.";

const import_text = "HELP MANUAL<br><br>COMMAND<br>&emsp;&emsp;&emsp;&emsp;/import - import startpage settings from text<br><br>USAGE<br>&emsp;&emsp;&emsp;&emsp;" +
			"/import <u>text</u> [<u>password</u>]<br><br>DESCRIPTION<br>&emsp;&emsp;&emsp;&emsp;/import changes the global settings for the startpage " + 
			"based on the given import <u>text</u>, provided from an export. Providing a <u>password</u> decrypts the data using that password."; 

const intro_text = "HELP MANUAL<br><br>COMMAND<br>&emsp;&emsp;&emsp;&emsp;/intro - display introduction<br><br>USAGE<br>&emsp;&emsp;&emsp;&emsp;" +
			"/intro<br><br>DESCRIPTION<br>&emsp;&emsp;&emsp;&emsp;/intro displays the introduction text for the startpage.";

const reset_text = "HELP MANUAL<br><br>COMMAND<br>&emsp;&emsp;&emsp;&emsp;/reset - reset startpage settings to default<br><br>USAGE<br>&emsp;&emsp;&emsp;&emsp;" +
			"/reset<br><br>DESCRIPTION<br>&emsp;&emsp;&emsp;&emsp;/reset resets the global settings for the startpage " + 
			"to the default state. This cannot be undone, and it is highly recommended to export data using /export before resetting."; 


//All commands

var commands = "";

if (storageAvailable && localStorage["commands"] != null) {
	commands = JSON.parse(localStorage["commands"]);
} else {
	commands = [
		//Base suite
		{name: "google", alias: null, url: "https://www.google.com/", search: "https://www.google.com/search?q=", iscmd: null},
		{name: "amazon", alias: null, url: "https://smile.amazon.com/", search: "https://smile.amazon.com/s/?field-keywords=", iscmd: null},
		{name: "wikipedia", alias: null, url: "https://www.wikipedia.org/", search: "https://www.wikipedia.org/wiki/", iscmd: null},
		{name: "youtube", alias: null, url: "https://youtube.com/", search: "https://youtube.com/results?search_query=", iscmd: null},

		//Educational suite
		{name: "thesaurus", alias: null, url: "http://www.thesaurus.com/", search: "http://www.thesaurus.com/browse/", iscmd: null},
		{name: "wolframalpha", alias: null, url: "https://www.wolframalpha.com/", search: "https://www.wolframalpha.com/input/?i=", iscmd: null},
		{name: "translate", alias: null, url: "https://www.translate.google.com/", search: "https://www.translate.google.com/?text=", iscmd: null},

		//G-suite
		{name: "lucky", alias: null, url: "https://www.google.com/", search: "search?btnI=I%27m+Feeling+Lucky&q=", iscmd: null},
		{name: "images", alias: null, url: "https://www.google.com/search?tbm=isch", search: "https://www.google.com/search?tbm=isch&q=", iscmd: null},
		{name: "gnews", alias: null, url: "https://www.google.com/search?tbm=nws", search: "https://www.google.com/search?tbm=nws&q=", iscmd: null},
		{name: "gmaps", alias: null, url: "https://www.google.com/maps", search: "https://www.google.com/maps?q=", iscmd: null},
		{name: "gplay", alias: null, url: "https:/play.google.com/", search: "https:/play.google.com/store/search?q=", iscmd: null},
		{name: "gdrive", alias: null, url: "https://www.drive.google.com/", search: null, iscmd: null},
		{name: "gmail", alias: null, url: "https://www.mail.google.com/", search: null, iscmd: null},

		//Entertainment suite

		{name: "imdb", alias: null, url: "http://imdb.com/", search: "http://imdb.com/find?q=", iscmd: null},
		{name: "reddit", alias: null, url: "https://www.reddit.com/", search: "https://www.reddit.com/search?q=", iscmd: null},
		{name: "twitter", alias: null, url: "https://www.twitter.com/", search: "https://www.twitter.com/search?q=", iscmd: null},
		{name: "ebay", alias: null, url: "http://www.ebay.com/", search: "http://www.ebay.com/sch/?_nkw=", iscmd: null},
		{name: "netflix", alias: null, url: "https://www.netflix.com/", search: "https://www.netflix.com/search?q=", iscmd: null},
		{name: "facebook", alias: null, url: "https://www.facebook.com/", search: null, iscmd: null},

		//Commands
		{name: "/alias", alias: null, url: null, search: null, iscmd: alias_text},
		{name: "/delete", alias: null, url: null, search: null, iscmd: delete_text},
		{name: "/edit", alias: null, url: null, search: null, iscmd: edit_text},
		{name: "/export", alias: null, url: null, search: null, iscmd: export_text},
		{name: "/help", alias: null, url: null, search: null, iscmd: help_text},
		{name: "/hide", alias: null, url: null, search: null, iscmd: hide_text},
		{name: "/notes", alias: null, url: null, search: null, iscmd: notes_text},
		{name: "/import", alias: null, url: null, search: null, iscmd: import_text},
		{name: "/intro", alias: null, url: null, search: null, iscmd: intro_text},
		{name: "/reset", alias: null, url: null, search: null, iscmd: reset_text}
	];
}

searching_cmds = [];
non_searching_cmds = [];

function refreshCommandList() {
	// Collect searching and non searching commands into appropriate lists
	for (var i = 0; i < commands.length; i += 1) {
		if (commands[i].search != null) {
			searching_cmds.push(commands[i].name);
		} else {
			non_searching_cmds.push(commands[i].name);
		}
	}
	searching_cmds = searching_cmds.concat(["/alias", "/delete", "/edit", "/export", "/help", "/import"]);
}
refreshCommandList();



