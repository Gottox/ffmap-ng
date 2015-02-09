(function(d3, oboe, document, JSON) {
	function ModelNodesJson(map) {
		
	}
	function ModelBatadv(map) {
		
	}

	function FFMapNG(destination, config) {
		// poor mens copy
		this.config = JSON.parse(JSON.stringify(config));
		if(config.api.statistic && config.api.nodeinfo)
			this.model = new ModelBatadv(this);
		else if(config.api.nodes)
			this.model = new ModelNodesJson(this);
		else {
			throw new Error("No valid datasource in config!\n"+
				"Either set config.api.statistic and config.api.nodeinfo or "+
				"config.api.nodes.");
		}

	}
	FFMapNG.prototype.
	window.FFMap = FFMapNG
})(d3, oboe, document, JSON)
