const storageAvailable = typeof(Storage) !== "undefined";

const commands = [
	//Base suite
	{name: "google", cmd: ["google"], url: "https://www.google.com/", search: "search?q=", desc: "search Google"},
	{name: "amazon", cmd: ["amazon"], url: "https://smile.amazon.com/", search: "s/?field-keywords=", desc: "search Amazon"},
	{name: "wikipedia", cmd: ["wikipedia", "wiki"], url: "https://www.wikipedia.org/", search: "wiki/", desc: "search Wikipedia"},
	{name: "youtube", cmd: ["youtube"], url: "https://youtube.com/", search: "/results?search_query=", desc: "search YouTube"},

	//Educational suite
	{name: "thesaurus", cmd: ["thesaurus"], url: "http://www.thesaurus.com/", search: "browse/", desc: "search Thesaurus"},
	{name: "wolframalpha", cmd: ["wolframalpha"], url: "https://www.wolframalpha.com/", search: "input/?i=", desc: "search WolframAlpha"},
	{name: "translate", cmd: ["translate"], url: "https://www.translate.google.com/", search: "?text=", desc: "search Google Translate"},

	//G-suite
	{name: "lucky", cmd: ["lucky"], url: "https://www.google.com/", search: "search?btnI=I%27m+Feeling+Lucky&q=", desc: "search Google 'I'm Feeling Lucky'"},
	{name: "images", cmd: ["images"], url: "https://www.google.com/search?tbm=isch", search: "&q=", desc: "search Google Images"},
	{name: "news", cmd: ["news"], url: "https://www.google.com/search?tbm=nws", search: "&q=", desc: "search Google News"},
	{name: "maps", cmd: ["maps"], url: "https://www.google.com/maps", search: "?q=", desc: "search Google Maps"},
	{name: "play", cmd: ["play"], url: "https:/play.google.com/", search: "store/search?q=", desc: "search Google Play"},
	{name: "drive", cmd: ["drive"], url: "https://www.drive.google.com/", search: null, desc: "open Google Drive"},
	{name: "gmail", cmd: ["gmail", "mail"], url: "https://www.mail.google.com/", search: null, desc: "open Gmail"},

	//Entertainment suite
	{name: "imdb", cmd: ["imdb"], url: "http://imdb.com/", search: "find?q=", desc: "search IMDB, the Internet Movie Database"},
	{name: "reddit", cmd: ["reddit"], url: "https://www.reddit.com/", search: "search?q=", desc: "search reddit"},
	{name: "twitter", cmd: ["twitter"], url: "https://www.twitter.com/", search: "search?q=", desc: "search Twitter"},
	{name: "ebay", cmd: ["ebay"], url: "http://www.ebay.com/", search: "sch/?_nkw=", desc: "search eBay"},
	{name: "netflix", cmd: ["netflix"], url: "https://www.netflix.com/", search: "search?q=", desc: "search Netflix"},
	{name: "imgur", cmd: ["imgur"], url: "http://www.imgur.com/", search: null, desc: "open Imgur"},
	{name: "facebook", cmd: ["facebook"], url: "https://www.facebook.com/", search: null, desc: "open Facebook"},

	//Commands
	{name: "/help", cmd: ["/help"], url: null, search: null, desc: "search startpage help manual"},
	{name: "/notes", cmd: ["/notes"], url: null, search: null, desc: "display notepad"},
	{name: "/hide", cmd: ["/hide", "(ESC)"], url: null, search: null, desc: "hide startpage windows"},
	{name: "/import", cmd: ["/import"], url: null, search: null, desc: "import startpage settings from string"},
	{name: "/export", cmd: ["/export"], url: null, search: null, desc: "export startpage settings to string"},
];

// Collect searching and non searching commands into appropriate lists
var searching_cmds = [];
var non_searching_cmds = [];
for (var i = 0; i < commands.length; i += 1) {
	for (var j = 0; j < commands[i].cmd.length; j += 1) {
		if (commands[i].search != null) {
			searching_cmds.push(commands[i].cmd[j]);
		} else {
			non_searching_cmds.push(commands[i].cmd[j]);
		}
	}
}
searching_cmds = searching_cmds.concat(["/help", "/import", "/export"]);
