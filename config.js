var ffmapConf = {
	name: "Freifunk Kassel",
	website: "http://gotham.freifunk.net",
	// Interval for Updating the JSON files
	interval: 30,
	api: {
		// Raw data from alfred-json -z -r 159
		statistic: "/statistics.json",
		// Raw data from alfred-json -z -r 158
		nodeinfo: "/nodeinfo.json",
		// graph informations
		batadv_vis: "/batadv_vis.json",
		// Information produced by ffmap-backend
		// not implemented yet
		//nodes: "http://api.ffks.de/nodes.json"
	},
	lang: 'de',
	map: {
		zoom: 15,
		lat: 51.315747,
		lon: 9.497960
	}
};
