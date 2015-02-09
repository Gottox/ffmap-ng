var ffmapConf = {
	name: "Freifunk Kassel",
	website: "http://gotham.freifunk.net",
	// Interval for Updating the JSON files
	interval: 30,
	api: {
		// Raw data from alfred-json -z -r 159
		statistic: "http://api.ffks.de/statistic.json",
		// Raw data from alfred-json -z -r 158
		nodeinfo: "http://api.ffks.de/nodeinfo.json"
		// Information produced by ffmap-backend 
		nodes: "http://api.ffks.de/nodes.json"
	}
};
