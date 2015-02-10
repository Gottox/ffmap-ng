(function(d3, oboe, document, JSON, window) {
	"use strict";

	function Batadv(urls) {
		this.urls = urls;
		this.reset();
	}

	Batadv.prototype = {
		// events
		onUpdate: function() {
			throw new Error("Not listening to onUpdate event!");
		},

		reset: function() {
			this.nodes = [];
			this.nodesObj = {};
			this.meshNodes = {};
			this.links = [];
		},

		update: function() {
			this.reset();
			this.updateNodes();
		},

		updateNodes: function() {
			var self = this;
			oboe(this.urls.nodeinfo)
			.node("!.*", function(src) {
				self.nodes.push(src);
				self.nodesObj[src.node_id] = src;
				src.network.mesh_interfaces.forEach(function(e) {
					self.meshNodes[e] = src;
				});
			})
			.done(function() {
				console.log(self.nodes);
				self.updateLinks();
			})
			.fail(function(e) {
				throw e;
			});
		},

		updateLinks: function() {
			var self = this;
			oboe(this.urls.batadv_vis)
			.node("!.vis.*.neighbors.*", function(src) {
				self.links.push({
					from: self.meshNodes[src.router],
					to: self.meshNodes[src.neighbor],
					metric: src.metric
				});
			})
			.done(function() {
				self.updateStatistics();
			})
			.fail(function() {
			});
		},

		updateStatistics: function() {
			var self = this;
			oboe(this.urls.statistic)
			.node("!.*", function(src) {
				self.nodesObj[src.node_id].statistic = src;
			})
			.done(function() {
				self.onUpdate(self.nodes, self.links);
			})
			.fail(function(e) {
				throw e.thrown;
			});
		}

	};

	function FFMapNG(target, config) {
		this.target = target;

		this.map = new OpenLayers.Map(target.id);
		var mapnik = new OpenLayers.Layer.OSM("Umgebung");
		this.linkLayer = new OpenLayers.Layer.Vector("Links");
		this.nodeLayer = new OpenLayers.Layer.Markers("Nodes");
		this.map.addLayers([ mapnik, this.linkLayer, this.nodeLayer ]);
		this.map.setCenter(new OpenLayers.LonLat(config.map.lon, config.map.lat) // Center of the map
			.transform(
				  new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
				  new OpenLayers.Projection("EPSG:900913") // to Spherical Mercator Projection
			), config.map.zoom
		);
	}

	FFMapNG.init = function(target, config) {
		var map = new FFMapNG(target, config);

		// poor mans deep copy
		config = JSON.parse(JSON.stringify(config));
		var modelLoader;

		if(config.api.statistic && config.api.nodeinfo, config.api.batadv_vis) {
			modelLoader = new Batadv(config.api);
		} else {
			throw new Error("No valid datasource in config!\n"+
				"Either set config.api.statistic and config.api.nodeinfo or "+
				"config.api.nodes.");
		}
		modelLoader.onUpdate = map.redraw.bind(map);
		modelLoader.update();

		OpenLayers.Lang.setCode(config.lang);
	};

	FFMapNG.prototype = {
		redraw: function(nodes, links) {
			this.drawNodes(nodes);
			this.drawLinks(links);
		},
		drawLinks: function(links) {
			var self = this;
			this.linkLayer.destroyFeatures();
			links.forEach(function(link) {
				if(!link.from || !link.from.location || !link.to || !link.to.location)
					return;
				var points = new Array(
					new OpenLayers.Geometry.Point(link.from.location.longitude, link.from.location.latitude)
					.transform(
						  new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
						  new OpenLayers.Projection("EPSG:900913") // to Spherical Mercator Projection
					),
					new OpenLayers.Geometry.Point(link.to.location.longitude, link.to.location.latitude)
					.transform(
						  new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
						  new OpenLayers.Projection("EPSG:900913") // to Spherical Mercator Projection
					)
				);
				var style = {
					strokeColor: '#0000ff',
					strokeOpacity: 0.5,
					strokeWidth: 5
				};
				var line = new OpenLayers.Geometry.LineString(points);
				var lineFeature = new OpenLayers.Feature.Vector(line, null, style);
				self.linkLayer.addFeatures([lineFeature]);
			});
		},
		drawNodes: function(nodes) {
			var self = this;

			this.nodeLayer.clearMarkers();
			nodes.forEach(function(node) {
				if(!node.location) return;
				var icon = new OpenLayers.Icon('img/wifi.png', {w:48,h:48}, {x:-24,y:-24});
				self.nodeLayer.addMarker(new OpenLayers.Marker(new OpenLayers.LonLat(node.location.longitude, node.location.latitude)
				.transform(
					  new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
					  new OpenLayers.Projection("EPSG:900913") // to Spherical Mercator Projection
				), icon));
			});
		},
		update: function() {
			this.modelFactory.update();
		}

	};

	window.FFMapNG = FFMapNG;
})(d3, oboe, document, JSON, window);
