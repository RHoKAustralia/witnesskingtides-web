var debugMessage = function(msg) {
	$("#debug").html(msg);
}

Modernizr.addTest('formdata', 'FormData' in window);
Modernizr.addTest('xhr2', 'FormData' in window && 'ProgressEvent' in window);

var EventAggregator = _.extend({}, Backbone.Events);
var SERVICE_URL = "https://shielded-sea-6230.herokuapp.com";
SERVICE_URL = "http://localhost:3000"; // for local testing

var PROJ_LL84        = new OpenLayers.Projection("EPSG:4326");
var PROJ_WEBMERCATOR = new OpenLayers.Projection("EPSG:900913");

var LAYER_USER_POSITION = "User Position";
var LAYER_TIDES = "Tides";
var LAYER_PHOTOS = "Flickr Photos";

var BLUEIMP_GALLERY_OPTIONS = {
    stretchImages: true,
    useBootstrapModal: false
};

function RollupNavbar() {
    var el = $("button.navbar-toggle");
    if (el.is(":visible"))
        el[0].click();
}

var LAYER_GOOG_PHYS = "goog-phys";
var LAYER_GOOG_STREET = "goog-street";
var LAYER_GOOG_HYBRID = "goog-hybrid";
var LAYER_GOOG_SATELLITE = "goog-satellite";
var LAYER_OSM = "osm";

var MAX_INTERACTION_SCALE = 60000;

/**
 * An in-memory cache of flickr photo data, from which the layer markers are rendered
 * and a thumbnail gallery is created from
 */
var FlickrPhotoCache = OpenLayers.Class({
    photosPerPage: 50,
    page: -1,
    pages: 0,
    total: 0,
    _dataByPage: [],
    _map: null,
    initialize: function (options) {
        this._map = options.map;
        if (_.has(options, "photosPerPage"))
            this.photosPerPage = options.photosPerPage;
        EventAggregator.on("getPhotoPageBounds", _.bind(this.onGetPhotoPageBounds, this));
        EventAggregator.on("resetPhotoFilter", _.bind(this.onResetPhotoFilter, this));
        EventAggregator.on("applyPhotoFilter", _.bind(this.onApplyPhotoFilter, this));
        EventAggregator.on("getCurrentPhotoFilter", _.bind(this.onCurrentPhotoFilterRequest, this));
    },
    getZoomLevel: function() {
        return this._map.getZoom();
    },
    getMapBounds: function() {
        var bounds = this._map.getExtent();
        bounds.transform(this._map.getProjectionObject(), PROJ_LL84);
        return [
            bounds.left,
            bounds.bottom,
            bounds.right,
            bounds.top
        ];
    },
    getCurrentPageData: function() {
        return this._dataByPage[this.page];
    },
    getPageData: function (pageIndex) {
        return this._dataByPage[pageIndex];
    },
    fetchPage: function (pageIndex) {
        this.page = pageIndex;
        EventAggregator.trigger("flickrPageLoading");
        var that = this;
        var promise = $.getJSON(
            SERVICE_URL + "/flickr/search",
            this.getRequestParams()
        );
        promise.done(function (data) {
            if (data.photos.page == that._dataByPage.length)
                that._dataByPage.push(data.photos);
            else
                that._dataByPage[data.photos.page - 1] = data.photos;
            that.page = data.photos.page - 1;
            that.pages = data.photos.pages;
            that.total = parseInt(data.photos.total, 10);
            EventAggregator.trigger("flickrPageLoaded", { cache: that, firstLoad: true });
        }).fail(function() {
            //debugger;
        });
    },
    loadCurrentPage: function() {
        if (typeof (this._dataByPage[this.page]) == 'undefined') {
            this.fetchPage(this.page);
        } else { //Already fetched, just raise the necessary events
            EventAggregator.trigger("flickrPageLoading");
            EventAggregator.trigger("flickrPageLoaded", { cache: this, firstLoad: false });
        }
    },
    loadNextPage: function() {
        if (this.page < this.pages) {
            this.page++;
            if (typeof(this._dataByPage[this.page]) == 'undefined') {
                this.fetchPage(this.page);
            } else { //Already fetched, just raise the necessary events
                EventAggregator.trigger("flickrPageLoading");
                EventAggregator.trigger("flickrPageLoaded", { cache: this, firstLoad: false });
            }
        }
    },
    loadPrevPage: function() {
        if (this.page > 0) {
            this.page--;
            if (typeof (this._dataByPage[this.page]) == 'undefined') { //Shouldn't happen, but just in case
                this.fetchPage(this.page);
            } else { //Already fetched, just raise the necessary events
                EventAggregator.trigger("flickrPageLoading");
                EventAggregator.trigger("flickrPageLoaded", { cache: this, firstLoad: false });
            }
        }
    },
    onGetPhotoPageBounds: function (e) {
        if (typeof (this._dataByPage[this.page]) == 'undefined') {
            e.callback(null);
        } else {
            var bounds = new OpenLayers.Bounds();
            var photoset = this._dataByPage[this.page];
            for (var i = 0; i < photoset.photo.length; i++) {
                var photo = photoset.photo[i];
                bounds.extendXY(photo.longitude, photo.latitude);
            }
            e.callback(bounds);
        }
    },
    onCurrentPhotoFilterRequest: function(args) {
        if (typeof(args.callback) == 'function')
            args.callback(this.args || {});
    },
    onResetPhotoFilter: function() {
        this.args = null;
        this.reset();
    },
    onApplyPhotoFilter: function(args) {
        this.args = args;
        this.reset();
    },
    getRequestParams: function() {
        var params = {
            format: 'json',
            method: 'flickr.photos.search',
            extras: 'geo,url_s,url_c,url_o,date_taken,date_upload,owner_name,original_format,o_dims,views',
            per_page: this.photosPerPage,
            page: (this.page + 1)
        };

        if (this.args && this.args.year) {
            logger.logi("Filtering by year: " + this.args.year);
            var dtStart = moment.utc([this.args.year, 0, 1]);
            var dtEnd = moment.utc([this.args.year, 11, 31]);
            logger.logi("Flickr date range: " + dtStart.unix() + " to " + dtEnd.unix());
            params.min_taken_date = dtStart.unix();
            params.max_taken_date = dtEnd.unix();
        }

        if (this.args && this.args.bbox) {
            params.bbox = this.getMapBounds().join(",");
            params.zoom = this.getZoomLevel();
            logger.logi("Filtering by bbox: " + params.bbox);
        }
        return params;
    },
    /**
     * Clears the cache and re-requests the first "page" of photos from flickr using the
     * new extents
     */
    updateExtents: function() {
        this.reset();
    },
    reset: function () {
        this._dataByPage = [];
        this.page = -1,
        this.pages = 0;
        this.total = 0;
        EventAggregator.trigger("flickrCacheReset");
        this.fetchPage(0);
    }
});
var PhotoCache = OpenLayers.Class({
    photosPerPage: 50,
    page: -1,
    pages: 0,
    total: 0,
    _dataByPage: [],
    _map: null,
    initialize: function (options) {
        this._map = options.map;
        if (_.has(options, "photosPerPage"))
            this.photosPerPage = options.photosPerPage;
        //EventAggregator.on("getPhotoPageBounds", _.bind(this.onGetPhotoPageBounds, this));
        // EventAggregator.on("resetPhotoFilter", _.bind(this.onResetPhotoFilter, this));
        EventAggregator.on("applyPhotoFilter", _.bind(this.onApplyPhotoFilter, this));
        // EventAggregator.on("getCurrentPhotoFilter", _.bind(this.onCurrentPhotoFilterRequest, this));
    },
    getZoomLevel: function() {
        return this._map.getZoom();
    },
    getMapBounds: function() {
        var bounds = this._map.getExtent();
        bounds.transform(this._map.getProjectionObject(), PROJ_LL84);
        return [
            bounds.left,
            bounds.bottom,
            bounds.right,
            bounds.top
        ];
    },
    getCurrentPageData: function() {
        return this._dataByPage[this.page];
    },
    getPageData: function (pageIndex) {
        return this._dataByPage[pageIndex];
    },
    fetchPage: function (pageIndex) {
        this.page = pageIndex;
        
        var that = this;
        var promise = $.getJSON(
            SERVICE_URL + "/photos/search",
            this.getRequestParams()
        );
        promise.done(function (data) {
            var photos = [];
            for(var key in data){
                for(var i = 0; i < data[key].cnt; i++){
                    photos.push({
                        latitude: data[key].pos[0]
                        ,longitude: data[key].pos[1]
                    });
                }
            }
            that._dataByPage[0] = photos;
            that.page = 0;
            that.pages = 1;
            that.total = parseInt(photos.length, 10);
            EventAggregator.trigger("photoPageLoaded", { cache: that, firstLoad: true });
        }).fail(function() {
            //debugger;
        });
    },
    onGetPhotoPageBounds: function (e) {
        if (typeof (this._dataByPage[this.page]) == 'undefined') {
            e.callback(null);
        } else {
            var bounds = new OpenLayers.Bounds();
            var photoset = this._dataByPage[this.page];
            for (var i = 0; i < photoset.photo.length; i++) {
                var photo = photoset.photo[i];
                bounds.extendXY(photo.longitude, photo.latitude);
            }
            e.callback(bounds);
        }
    },
    onCurrentPhotoFilterRequest: function(args) {
        if (typeof(args.callback) == 'function')
            args.callback(this.args || {});
    },
    onResetPhotoFilter: function() {
        this.args = null;
        this.reset();
    },
    onApplyPhotoFilter: function(args) {
        this.args = args;
        this.reset();
    },
    getRequestParams: function() {
        var params = {
            format: 'json',
            method: 'flickr.photos.search',
            extras: 'geo,url_s,url_c,url_o,date_taken,date_upload,owner_name,original_format,o_dims,views',
            per_page: this.photosPerPage,
            page: (this.page + 1)
        };

        if (this.args && this.args.year) {
            logger.logi("Filtering by year: " + this.args.year);
            var dtStart = moment.utc([this.args.year, 0, 1]);
            var dtEnd = moment.utc([this.args.year, 11, 31]);
            logger.logi("Flickr date range: " + dtStart.unix() + " to " + dtEnd.unix());
            params.min_taken_date = dtStart.unix();
            params.max_taken_date = dtEnd.unix();
        }

        if (this.args && this.args.bbox) {
            params.bbox = this.getMapBounds().join(",");
            params.zoom = this.getZoomLevel();
            logger.logi("Filtering by bbox photocache: " + params.bbox);
        }
        return params;
    },
    /**
     * Clears the cache and re-requests the first "page" of photos from flickr using the
     * new extents
     */
    updateExtents: function() {
        this.reset();
    },
    reset: function () {
        this._dataByPage = [];
        this.page = -1,
        this.pages = 0;
        this.total = 0;
        this.fetchPage(0);
    }
});

/* Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/Control/Panel.js
 */

/**
 * Class: OpenLayers.Control.TextButtonPanel
 * The TextButtonPanel is a panel designed primarily to hold TextButton
 * controls.  By default it has a displayClass of olControlTextButtonPanel,
 * which hooks it to a set of text-appropriate styles in the default stylesheet.
 *
 * Inherits from:
 *  - <OpenLayers.Control.Panel>
 */
OpenLayers.Control.TextButtonPanel = OpenLayers.Class(OpenLayers.Control.Panel, {

    /**
    * APIProperty: vertical
    * {Boolean} Whether the button strip should appear vertically on the map.
    */
    vertical: false,

    /**
    * APIProperty: additionalClass
    * {String} An additional class to be applied in addition to
    * .olControlTextButtonPanel to allow for non-default positioning.
    */
    additionalClass: null,

    /**
    * Constructor: OpenLayers.Control.TextButtonPanel
    * Create a panel for holding text-based button controls
    *
    * Parameters:
    * options - {Object}
    */

    /**
    * Method: draw
    * Overrides the draw method in <OpenLayers.Control.Panel> by applying
    * up to two additional CSS classes
    * Returns:
    * {DOMElement}
    */
    draw: function () {
        OpenLayers.Control.Panel.prototype.draw.apply(this, arguments);
        this.setOrientationClass();
        this.setAdditionalClass();
        return this.div;
    },

    /**
    * Method: redraw
    * Overrides the redraw method in <OpenLayers.Control.Panel> by setting
    * the orientation class.
    */
    redraw: function () {
        OpenLayers.Control.Panel.prototype.redraw.apply(this, arguments);
        this.setOrientationClass();
    },

    /**
    * Method: setOrientationClass
    * Adds the "vertical" class if this TextButtonPanel should have a vertical,
    * rather than horizontal, layout.
    */
    setOrientationClass: function () {
        if (this.vertical) {
            OpenLayers.Element.addClass(this.div, "vertical");
        }
        else {
            OpenLayers.Element.removeClass(this.div, "vertical");
        }
    },

    /**
    * APIMethod: setAdditionalClass
    * Sets an additional CSS class for this TextButtonPanel
    * (for example, to override the default placement).  This
    * allows more than one TextButtonPanel to exist on the map
    * at once.
    */
    setAdditionalClass: function () {
        if (!!this.additionalClass) {
            OpenLayers.Element.addClass(this.div, this.additionalClass);
        }
    },

    CLASS_NAME: "OpenLayers.Control.TextButtonPanel"
});

var MapView = Backbone.View.extend({
    map: null,
    userLayers: [],
    tideEvents: [],
    activeModal: null,
    tideModalTemplate: null,
    photoModalTemplate: null,
    selectControl: null,
    bManualLocationRecording: false,
    pointsOnMap: null,
	initialize: function(options) {
        this.tideModalTemplate = _.template($("#tideModal").html());
        this.photoModalTemplate = _.template($("#photoModal").html());
        this.lightboxTemplate = _.template($("#lightbox").html());
        EventAggregator.on("mapZoomToBounds", _.bind(this.onMapZoomToBounds, this));
        EventAggregator.on("requestLegendUpdate", _.bind(this.onRequestLegendUpdate, this));
        EventAggregator.on("resizeMapDomElement", _.bind(function() {
            this.map.updateSize();
        }, this));

        var that = this;
        $(document).on("change", "#layer-toggle-tides input[type='checkbox']", function (e) {
            for (var i = 0; i < that.userLayers.length; i++) {
                if (that.userLayers[i].name == LAYER_TIDES) {
                    that.userLayers[i].setVisibility($(e.target).is(":checked"));
                }
            }
        });
        $(document).on("change", "#layer-toggle-photos input[type='checkbox']", function (e) {
            for (var i = 0; i < that.userLayers.length; i++) {
                if (that.userLayers[i].name == LAYER_PHOTOS) {
                    that.userLayers[i].setVisibility($(e.target).is(":checked"));
                }
            }
        });
        $(document).on("change", "#layer-toggle-gps input[type='checkbox']", function (e) {
            for (var i = 0; i < that.userLayers.length; i++) {
                if (that.userLayers[i].name == LAYER_USER_POSITION) {
                    that.userLayers[i].setVisibility($(e.target).is(":checked"));
                }
            }
        });
	},
	render: function() {
        this.layers = {};
        this.layers[LAYER_GOOG_PHYS] = new OpenLayers.Layer.Google(
            "Google Physical",
            {type: google.maps.MapTypeId.TERRAIN}
        );
        this.layers[LAYER_GOOG_STREET] = new OpenLayers.Layer.Google(
            "Google Streets", // the default
            {numZoomLevels: 20}
        );
        this.layers[LAYER_GOOG_HYBRID] = new OpenLayers.Layer.Google(
            "Google Hybrid",
            {type: google.maps.MapTypeId.HYBRID, numZoomLevels: 20}
        );
        this.layers[LAYER_GOOG_SATELLITE] = new OpenLayers.Layer.Google(
            "Google Satellite",
            {type: google.maps.MapTypeId.SATELLITE, numZoomLevels: 22}
        );
        this.layers[LAYER_OSM] = new OpenLayers.Layer.OSM("OpenStreetMap");
        //TODO: Cap extent to Australia only?
		this.map = new OpenLayers.Map("map", {
            projection: "EPSG:3857",
            layers: [
                this.layers[LAYER_GOOG_PHYS],
                this.layers[LAYER_GOOG_STREET],
                this.layers[LAYER_GOOG_HYBRID],
                this.layers[LAYER_GOOG_SATELLITE],
                this.layers[LAYER_OSM]
            ]
		});
        this.cache = new FlickrPhotoCache({ map: this.map, photosPerPage: 100 });
        this.photoCache = new PhotoCache({ map: this.map, photosPerPage: 100 });

		var that = this;

		EventAggregator.on("loadCurrentFlickrPage", function () {
		    that.cache.loadCurrentPage();
		});
		EventAggregator.on("loadNextFlickrPage", function () {
		    that.cache.loadNextPage();
		});
		EventAggregator.on("loadPrevFlickrPage", function () {
		    that.cache.loadPrevPage();
		});
		EventAggregator.on("showPhotos", _.bind(this.onShowPhotos, this));
		EventAggregator.on("showModal", _.bind(function (e) {
		    this.showModal(e.template);
		}, this));

        this.map.addControl(new OpenLayers.Control.Scale());
        this.map.addControl(new OpenLayers.Control.MousePosition({ displayProjection: "EPSG:4326" }));

        var panel = new OpenLayers.Control.TextButtonPanel({
            vertical: true,
            additionalClass: "vpanel"
        });

        panel.addControls([
            new OpenLayers.Control.Button({
                trigger: function() {
                    that.zoomToMylocation();
                },
                displayClass: 'wkt-btn-locate'
            }),
            new OpenLayers.Control.Button({
                trigger: function() {
                    that.initialView();
                },
                displayClass: 'wkt-btn-initialzoom'
            })
        ]);

        this.map.addControl(panel);

        //HACK: Have to insert this content at runtime
        $("div.wkt-btn-locateItemInactive").html("<i class='fa fa-location-arrow'></i>");
        $("div.wkt-btn-initialzoomItemInactive").html("<i class='fa fa-arrows-alt'></i>");

        this.map.updateSize();

        this.createPositionLayer();
        this.createFlickrPhotoLayer();
        this.map.events.register("moveend", this, this.onMoveEnd);
        this.map.events.register("changebaselayer", this, this.onBaseLayerChange);
        this.setActiveBaseLayer($("a.base-layer-item[data-layer-name='goog-satellite']"));
        //Initial view is Australia
        this.initialView();
        EventAggregator.on("addNewPhotoMarker", _.bind(this.onAddNewPhotoMarker, this));
        EventAggregator.on("showPositionOnMap", _.bind(this.onShowPositionOnMap, this));
        EventAggregator.on("toggleManualLocationRecording", _.bind(this.onToggleManualLocationRecording, this));
        EventAggregator.trigger("requestLegendUpdate");

        //This bit can fail if running on a domain that's not white-listed by the backend, so do it last
        $.getJSON(SERVICE_URL + "/tide_events", _.bind(function (tides) {
            this.tideEvents = tides;
            this.createTideLayer();
            EventAggregator.trigger("requestLegendUpdate");
        }, this));


	},
	initialView: function() {
	    var bounds = new OpenLayers.Bounds(10470115.700925, -5508791.4417243, 19060414.686531, -812500.42453675);
	    this.map.zoomToExtent(bounds, false);
	    //this.cache.updateExtents(bounds);
        this.photoCache.updateExtents(bounds);
    },
    zoomToMylocation: function() {
        if (typeof(navigator.geolocation) != 'undefined') {
            navigator.geolocation.getCurrentPosition(_.bind(function(pos) { //Success
                this.zoomLonLat(pos.coords.longitude, pos.coords.latitude, 14);
            }, this), _.bind(function(pos) { //Failure
                alert("Could not get your location");
            }, this), { //Options
                enableHighAccuracy: true,
                maximumAge: 0,
                timeout: 7000
            });
        } else {
            alert("Your browser does not support geolocation");
        }
    },
    zoomLonLat: function(lon, lat, level) {
        var point = new OpenLayers.Geometry.Point(lon, lat);
        point.transform(PROJ_LL84, PROJ_WEBMERCATOR);
        this.map.moveTo(new OpenLayers.LonLat(point.x, point.y), level);
    },
    onMapZoomToBounds: function(bounds) {
        if (bounds != null) {
            this.map.zoomToExtent(bounds);
        }
    },
    onRequestLegendUpdate: function() {
        EventAggregator.trigger("updateLegend", { layers: this.userLayers });
    },
    onShowPositionOnMap: function(e) {
        if (this.positionLayer) {
            this.positionLayer.removeAllFeatures();

            var point = new OpenLayers.Geometry.Point(e.lon, e.lat);
            point.transform(PROJ_LL84, PROJ_WEBMERCATOR);
            var feat = new OpenLayers.Feature.Vector(point);

            this.positionLayer.addFeatures([ feat ]);

            var zoomLevel = 14;
            this.zoomLonLat(e.lon, e.lat, zoomLevel);
        }
    },
    onToggleManualLocationRecording: function() {
        if (this.bManualLocationRecording === true) {
            this.endManualRecordingMode();
        } else {
            this.beginManualRecordingMode();
        }
    },
    beginManualRecordingMode: function() {
        this.bManualLocationRecording = true;
        alert("You are now manually recording your location. A marker has been placed on the centre of the map. Pan/Zoom to your correct location");
        this.positionLayer.removeAllFeatures();
        var cent = this.map.getExtent().getCenterLonLat();
        this.positionLayer.addFeatures([
            new OpenLayers.Feature.Vector(
                new OpenLayers.Geometry.Point(cent.lon, cent.lat))
        ]);
    },
    endManualRecordingMode: function() {
        this.bManualLocationRecording = false;
        alert("You have stopped manual recording of your location. Your photo location field has been updated");
        var center = this.map.getExtent().getCenterLonLat();
        center.transform(PROJ_WEBMERCATOR, PROJ_LL84);
        EventAggregator.trigger("updatePhotoLocationField", { lon: center.lon, lat: center.lat });
    },
    setActiveBaseLayer: function(el) {
        if (this.map != null) {
            var layerName = el.attr("data-layer-name");
            if (_.has(this.layers, layerName)) {
                //Clear active state first
                $("#map-layer-switcher").find("li.active").removeClass("active");

                this.map.setBaseLayer(this.layers[layerName]);
                el.parent().addClass("active");

                //Twiddle the text color so that scale/coordinates are more legible against these backdrops
                var mouseEl = $(".olControlMousePosition");
                var scaleEl = $(".olControlScale").find("div");
                if (layerName == LAYER_GOOG_HYBRID || layerName == LAYER_GOOG_SATELLITE) {
                    mouseEl.addClass("goog-sat-text");
                    scaleEl.addClass("goog-sat-text");
                } else {
                    mouseEl.removeClass("goog-sat-text");
                    scaleEl.removeClass("goog-sat-text");
                }
            }
        }
    },
    showModal: function(html, callback) {
        var that = this;
        if (this.activeModal) {
            this.activeModal.remove();
            //You'd think boostrap modal would've removed this for you?
            $(".modal-backdrop").remove();
        }
        this.activeModal = $(html);
        $("body").append(this.activeModal);
        this.activeModal.modal('show').on("hidden.bs.modal", function(e) {
            //You'd think boostrap modal would've removed this for you?
            $(".modal-backdrop").remove();
        }).on("shown.bs.modal", function(e) {
            console.log("hello: " + typeof(callback));
            if(callback)
                callback(that.activeModal);
        });

    },
    onBaseLayerChange: function(e) {

    },
	onMoveEnd: function(e) {
		//logger.logi(this.map.getExtent());
        if (this.bManualLocationRecording === true) {
            this.positionLayer.removeAllFeatures();
            var cent = this.map.getExtent().getCenterLonLat();
            this.positionLayer.addFeatures([
                new OpenLayers.Feature.Vector(
                    new OpenLayers.Geometry.Point(cent.lon, cent.lat))
            ]);
        }
	},
    createPositionLayer: function() {
        var style = new OpenLayers.Style({
            fillColor: "#ffcc66",
            fillOpacity: 0.8,
            strokeColor: "#cc6633",
            externalGraphic: "images/marker.png",
            graphicWidth: 16,
            graphicHeight: 16
        });
        this.positionLayer = new OpenLayers.Layer.Vector(LAYER_USER_POSITION, {
            projection: "EPSG:3857",
            styleMap: new OpenLayers.StyleMap({
                "default": style,
                "select": {
                    fillColor: "#8aeeef",
                    strokeColor: "#32a8a9"
                }
            })
        });
        this.addUserLayer(this.positionLayer);
    },
    addUserLayer: function(layer) {
        this.map.addLayer(layer);
        this.userLayers.push(layer);
    },
	createUserUploadedPhotoLayer: function() {

	},
    createTideLayer: function() {
        var style = new OpenLayers.Style({
            fillColor: "#ffcc66",
            fillOpacity: 0.8,
            strokeColor: "#cc6633",
            externalGraphic: "images/water.png",
            graphicWidth: 16,
            graphicHeight: 16
        });

        this.tidesLayer = new OpenLayers.Layer.Vector(LAYER_TIDES, {
            projection: "EPSG:3857",
            styleMap: new OpenLayers.StyleMap({
                "default": style,
                "select": {
                    fillColor: "#8aeeef",
                    strokeColor: "#32a8a9"
                }
            })
        });

        //Populate layer. Need to manually re-project to spherical mercator
        var srcProj = PROJ_LL84;
        var dstProj = PROJ_WEBMERCATOR;
        var features = [];
        for (var i = 0; i < this.tideEvents.length; i++) {
            var tideEvent = this.tideEvents[i];
            var pt = new OpenLayers.Geometry.Point(tideEvent.event.longitude, tideEvent.event.latitude);
            pt.transform(srcProj, dstProj);
            var feat = new OpenLayers.Feature.Vector(pt, tideEvent);
            features.push(feat);
        }
        this.tidesLayer.addFeatures(features);

        this.addUserLayer(this.tidesLayer);
        this.updateSelectControl();
        this.tidesLayer.events.on({"featureselected": _.bind(this.onTideSelected, this)});
    },
    /**
     * Updates the SelectFeature control based on the available selectable layers
     */
    updateSelectControl: function() {
        var layers = [];
        if (this.photosLayer)
            layers.push(this.photosLayer);
        if (this.tidesLayer)
            layers.push(this.tidesLayer);

        if (!this.selectControl) {
            this.selectControl = new OpenLayers.Control.SelectFeature(layers, {hover: false});
            this.map.addControl(this.selectControl);
        } else {
            this.selectControl.setLayer(layers);
        }
        this.selectControl.activate();
    },
    onAddNewPhotoMarker: function (data) {
        var features = [];
        for (var i = 0; this.pointsOnMap && i < this.pointsOnMap.length; i++) {
            var photo = this.pointsOnMap[i];
            var geom = new OpenLayers.Geometry.Point(photo.longitude, photo.latitude);
            geom.transform(PROJ_LL84, this.map.getProjectionObject());
            features.push(
                new OpenLayers.Feature.Vector(
                    geom,
                    photo
                )
            );
        }
        var pt = new OpenLayers.Geometry.Point(data.lon, data.lat);
        pt.transform(PROJ_LL84, PROJ_WEBMERCATOR);
        features.push(
            new OpenLayers.Feature.Vector(
                pt, { flickrId: data.flickrId, latitude: data.lat, longitude: data.lon })
        );
        this.photosLayer.addFeatures(features);

        this.photosLayer.redraw();
    },
	createFlickrPhotoLayer: function() {
		var style = new OpenLayers.Style({
            pointRadius: "${radius}",
            fillColor: "#ffcc66",
            fillOpacity: 0.8,
            strokeColor: "#cc6633",
            //externalGraphic: "${thumbnail}",
            //graphicWidth: 80,
            //graphicHeight: 80,
            //externalGraphic: "images/camera.png",
            //graphicWidth: 16,
            //graphicHeight: 16,
            labelXOffset: 16,
            strokeWidth: 2,
            strokeOpacity: 0.8,
            label: "${label}",
            labelOutlineColor: "white",
            labelOutlineWidth: 3
        }, {
            context: {
                radius: function(feature) {
                    return Math.min(feature.attributes.count, 7) + 10;
                },
                label: function(feature) {
                	return feature.cluster.length;
                		1
                },
                thumbnail: function(feature) {
                	if (feature.cluster.length <= 1) {
                		return feature.cluster[0].attributes.img_url;
                	}
                	return "";
                }
            }
        });

		this.flickrCluster = new OpenLayers.Strategy.Cluster();
		this.photosLayer = new OpenLayers.Layer.Vector(LAYER_PHOTOS, {
            projection: "EPSG:900913",
            strategies: [
                this.flickrCluster
            ],
            styleMap: new OpenLayers.StyleMap({
                "default": style,
                "select": {
                    fillColor: "#8aeeef",
                    strokeColor: "#32a8a9"
                }
            })
        });

		this.addUserLayer(this.photosLayer);
		this.updateSelectControl();
		this.photosLayer.events.on({ "featureselected": _.bind(this.onPhotoFeatureSelected, this) });

		// EventAggregator.on("flickrCacheReset", _.bind(this.onFlickrCacheReset, this));
		// EventAggregator.on("flickrPageLoaded", _.bind(this.onFlickrPageLoaded, this));
        EventAggregator.on("photoPageLoaded", _.bind(this.onPhotoPageLoaded, this));
	},
	onFlickrCacheReset: function() {
	    this.photosLayer.removeAllFeatures();
	},
    onFlickrPageLoaded: function(e) {
        var cache = e.cache;
        var data = cache.getCurrentPageData();
        var features = [];

        // for (var i = 0; i < data.photo.length; i++) {
        //     var photo = data.photo[i];
        //     var geom = new OpenLayers.Geometry.Point(photo.longitude, photo.latitude);
        //     geom.transform(PROJ_LL84, this.map.getProjectionObject());
        //     features.push(
        //         new OpenLayers.Feature.Vector(
        //             geom,
        //             photo
        //         )
        //     );
        // }

        //this.photosLayer.addFeatures(features);

        //Force re-clustering
        // this.flickrCluster.clusters = null;
        // this.flickrCluster.cluster();
    },
    onPhotoPageLoaded: function(e) {
        var cache = e.cache;
        var data = cache.getCurrentPageData();
        var features = [];
        this.pointsOnMap = data;
        for (var i = 0; i < data.length; i++) {
            var photo = data[i];
            var geom = new OpenLayers.Geometry.Point(photo.longitude, photo.latitude);
            geom.transform(PROJ_LL84, this.map.getProjectionObject());
            features.push(
                new OpenLayers.Feature.Vector(
                    geom,
                    photo
                )
            );
        }

        this.photosLayer.addFeatures(features);

        //Force re-clustering
        this.flickrCluster.clusters = null;
        this.flickrCluster.cluster();
    },
	onShowPhotos: function (e) {
        var that = this;
        if(!e.photos[0].attributes.url_s)
        {
            this.showLightbox({
                photos: e.photos,
            }, true);

            var params = {
                format: 'json',
                method: 'flickr.photos.search',
                extras: 'geo,url_s,url_c,url_o,date_taken,date_upload,owner_name,original_format,o_dims,views',
                per_page: 100,
                page: 1
            };

            var bottom, top, left, right;
            for(var j = 0; j < e.photos.length; j++){
                if(!bottom || Number.parseFloat(e.photos[j].attributes.latitude) < bottom) bottom = Number.parseFloat(e.photos[j].attributes.latitude);
                if(!top || Number.parseFloat(e.photos[j].attributes.latitude) > top) top = Number.parseFloat(e.photos[j].attributes.latitude);
                if(!left || Number.parseFloat(e.photos[j].attributes.longitude) < left) left = Number.parseFloat(e.photos[j].attributes.longitude);
                if(!right || Number.parseFloat(e.photos[j].attributes.longitude) > right) right = Number.parseFloat(e.photos[j].attributes.longitude);
            }
            params.bbox =  left + ',' + bottom + ',' + right + ',' + top;
            params.zoom = 10;
            logger.logi("Filtering by bbox: " + params.bbox);

            var promise = $.getJSON(
                SERVICE_URL + "/flickr/search",
                params
            );
            promise.done(function (data) {
                var foundPhotos = false;
                for(var i = 0; i < data.photos.photo.length; i++){
                    for(var j = 0; j < e.photos.length; j++){
                        var photo = data.photos.photo[i];

                        // comment out cause inconsistent GPS coordinates (an instance where we truncate 1 sig fig vs Flickr? so this is not consistent)
                        // if(Number.parseFloat(e.photos[j].attributes.latitude) == Number.parseFloat(photo.latitude) 
                        //     && Number.parseFloat(e.photos[j].attributes.longitude) == Number.parseFloat(photo.longitude)
                        if(!e.photos[j].attributes.url_s)
                        {
                            e.photos[j].attributes.title = photo.title;
                            e.photos[j].attributes.url_c = photo.url_c;
                            e.photos[j].attributes.url_s = photo.url_s;
                            foundPhotos = true;
                            break;
                        }
                    }
                }
                if(foundPhotos)
                    that.onShowPhotos(e);
                else{
                    alert("Could not find photo on Flickr (probably deleted)");
                    that.removeLightbox();
                }
            }).fail(function() {
                //debugger;
                alert("Could not retrieve photo from Flickr");
                that.removeLightbox();
            });

            return;
        }
	    var getPhotoUrlFunc = function (photo) {
	        return photo.attributes.url_c || photo.attributes.url_s;
	    };
	    var getThumbnailFunc = function (photo) {
	        return photo.attributes.url_s;
	    };
	    this.showLightbox({
	        photos: e.photos,
	        getPhotoUrl: getPhotoUrlFunc,
	        getThumbnailUrl: getThumbnailFunc
	    });
	},
    removeLightbox: function(){
        if (this.activeModal) {
            this.activeModal.remove();
            //You'd think boostrap modal would've removed this for you?
            $(".modal-backdrop").remove();
        }
    },
	showLightbox: function (args, showLoading) {
	    if (this.activeModal) {
	        this.activeModal.remove();
	        //You'd think boostrap modal would've removed this for you?
	        $(".modal-backdrop").remove();
	    }
	    this.activeModal = $(this.lightboxTemplate(args));
	    $("body").append(this.activeModal);
	    this.activeModal.toggleClass('blueimp-gallery-controls', true);
	    var links = [];
	    for (var i = 0; i < args.photos.length; i++) {
	        links.push({
	            title: args.photos[i].attributes.title,
	            href: (showLoading ? '/images/loading.gif' : args.getPhotoUrl(args.photos[i])),
	            thumbnail: (showLoading ? '/images/loading.gif' : args.getThumbnailUrl(args.photos[i]))
	        });
	    }
        BLUEIMP_GALLERY_OPTIONS.stretchImages = !showLoading;
        
	    blueimp.Gallery(links, BLUEIMP_GALLERY_OPTIONS);

	},
	onPhotoFeatureSelected: function(event) {
	    this.selectControl.unselect(event.feature);

        if (event.feature.cluster.length == 1) {
            this.onShowPhotos({ photos: event.feature.cluster });
        } else {
            if (this.map.getScale() < MAX_INTERACTION_SCALE) {
                this.onShowPhotos({ photos: event.feature.cluster });
            } else {
                if (event.feature.cluster.length > 1) {
                    var bounds = new OpenLayers.Bounds();
                    for (var i = 0; i < event.feature.cluster.length; i++) {
                        bounds.extend(event.feature.cluster[i].geometry.getBounds());
                    }
                    this.map.zoomToExtent(bounds);
                } else {
                    this.onShowPhotos({ photos: event.feature.cluster });
                }
            }
        }
    },
    onTideSelected: function(event) {
        this.selectControl.unselect(event.feature);
        this.showTideModal(event.feature.attributes.event, true);
        this.getTideDetails(event.feature.attributes.id);
    },
    formatTime: function(end, start){
        if(!start) start = moment();
        var days = moment(end).diff(start, 'days');
        var hours = moment(end).diff(start, 'hours') % 24;
        var minutes = moment(end).diff(start, 'minutes') % 60;

        var duration = ((days > 0) ? days + ' days ' : '') + ((hours > 1) ? hours + ' hrs ' : (hours > 0) ? '1 hr ' : '') + ((minutes > 0) ? minutes + ' min' : '');
        return duration;
    },
    populateModal: function(modal, event, populateData){
        modal.find(".showStartDate").toggle(event.startDate ? true : false);
        modal.find(".showHighTide").toggle(event.highTideOccurs ? true : false);
        modal.find(".showLowTide").toggle(event.lowTideOccurs ? true : false);

        if(populateData){
            modal.find(".startDate").text(moment(event.eventStart).format("Do MMM H:mm A") + " (in " + this.formatTime(event.eventStart) + ")");
            modal.find(".highTide").text(moment(event.highTideOccurs).format("Do MMM H:mm A") + " (in " + this.formatTime(event.highTideOccurs) + ")");
            modal.find(".lowTide").text(moment(event.lowTideOccurs).format("Do MMM H:mm A") + " (in " + this.formatTime(event.lowTideOccurs) + ")");
            modal.find(".dateRange").text(this.rangeText(event));
        }
    },
    rangeText: function(event){
        var start = moment(event.eventStart);
        var end = moment(event.eventEnd);
        return start.format("Do MMM") + " to " + end.format("Do MMM");
    },
    getUrlFragment: function(event){
        return ((event.state + "-" + event.location).toLowerCase().replace(/ /gi,'-'));
    },
    showTideModal: function(event){
        var now = new Date();
        var that = this;
        this.showModal(this.tideModalTemplate({
           location: event.location,
            startDate: moment(event.eventStart).format("Do MMM H:mm A") + " (in " + this.formatTime(event.eventStart) + ")",
            endDate: moment(event.eventEnd).format("Do MMM H:mm A") + " (in " + this.formatTime(event.eventEnd) + ")",
            highTideDate: moment(event.highTideOccurs).format("Do MMM H:mm A") + " (in " + this.formatTime(event.highTideOccurs) + ")",
            lowTideDate: moment(event.lowTideOccurs).format("Do MMM H:mm A") + " (in " + this.formatTime(event.lowTideOccurs) + ")",
            range: function () {
                var start = moment(event.eventStart);
                var end = moment(event.eventEnd);
                return start.format("Do MMM") + " to " + end.format("Do MMM");
           },
            urlfragment: this.getUrlFragment(event)
        }), function(modal){
            that.populateModal(modal, event);
        });
    },
    getTideDetails: function(event_id){
        var that = this;
        return $.ajax({
            url: SERVICE_URL + "/tide_events/" + event_id,
            type: 'GET',
            success: function (event) {
                that.activeModal.off('shown.bs.modal').on("shown.bs.modal", function(e) {
                    that.activeModal.find(".loading").hide();
                    that.populateModal(that.activeModal, event, true);
                }).trigger('shown.bs.modal');
            },
            error: function(){
                console.log("Error getting data");
            },
            cache: false
        });

    },
    getTideEvents: function(){
        return this.tideEvents;
    },
    getTideEvent: function(id){
        var d = _.filter(this.tideEvents,function(item){ return item.id == id;});
        if(d.length == 1)
            return d[0];
        return d;
    }
});

var BaseSidebarView = Backbone.View.extend({
    template: null,
    el: $("#sidebarBody"),
    renderBase: function() {
        $(this.el).html(this.template({ title: this.title, icon: this.icon }));
        this.updateTitle(this.title);
        this.updateIcon(this.icon);
    },
    updateTitle: function(title) {
        $("#sidebarTitle").text(title);
    },
    updateIcon: function(classes) {
        $("#sidebarIcon").attr("class", classes);
        $("#sidebarTogglerIcon").attr("class", classes);
    }
});

var HomeSidebarView = BaseSidebarView.extend({
    title: "Home",
    icon: "fa fa-home",
	initialize: function(options) {
	    this.template = _.template($("#homeSidebar").html());
	    this.updateLegendHandler = _.bind(this.onUpdateLegend, this);
	    EventAggregator.on("updateLegend", this.updateLegendHandler);
	},
	render: function() {
	    BaseSidebarView.prototype.renderBase.apply(this, arguments);
	    EventAggregator.trigger("requestLegendUpdate");
	},
	onUpdateLegend: function(e) {
	    for (var i = 0; i < e.layers.length; i++) {
	        var layer = e.layers[i];
	        switch (layer.name) {
	            case LAYER_PHOTOS:
	                $("#layer-toggle-photos input[type='checkbox']").prop('checked', layer.getVisibility());
	                break;
	            case LAYER_TIDES:
	                $("#layer-toggle-tides input[type='checkbox']").prop('checked', layer.getVisibility());
	                break;
	            case LAYER_USER_POSITION:
	                $("#layer-toggle-gps input[type='checkbox']").prop('checked', layer.getVisibility());
	                break;
	        }
	    }
	},
	teardown: function() {
	    EventAggregator.off("updateLegend", this.updateLegendHandler);
	}
});

var PhotosView = BaseSidebarView.extend({
    pagerTemplate: null,
    title: "Photos",
    icon: "fa fa-picture-o",
    initialize: function(options) {
        this.template = _.template($("#photosSidebar").html());
        this.legendTemplate = _.template($("#photosLegend").html());
        this.pagerTemplate = _.template($("#albumPager").html());
    },
    render: function () {
        BaseSidebarView.prototype.renderBase.apply(this, arguments);
        EventAggregator.on("flickrCacheReset", _.bind(this.onFlickrCacheReset, this));
        EventAggregator.on("flickrPageLoading", _.bind(this.onFlickrPageLoading, this));
        EventAggregator.on("flickrPageLoaded", _.bind(this.onFlickrPageLoaded, this));
        EventAggregator.trigger("loadCurrentFlickrPage");
    },
    teardown: function () {

    },
    onFlickrCacheReset: function () {
        $("div.album-pager").empty();
        $(".flickr-thumbnail-grid", this.el).empty();
    },
    onFlickrPageLoading: function () {
        $("div.album-pager").empty();
        $(".flickr-thumbnail-grid", this.el).html("<div class='well'><i class='fa fa-spinner fa-spin'></i>&nbsp;Loading Page</div>");
    },
    onFlickrPageLoaded: function (e) {
        $(".flickr-thumbnail-grid", this.el).empty();
        var cache = e.cache;
        var data = cache.getCurrentPageData();
        this.loadData(data, cache);
    },
    loadData: function (data, cache) {
        var pageNo = (cache.page + 1);
        var pages = cache.pages;
        var total = cache.total;
        var html = this.legendTemplate();
        var escape = function (str) {
            return str.replace(/'/g, "&apos;").replace(/"/g, "&quot;");
        };
        for (var i = 0; i < data.photo.length; i++) {
            var photo = data.photo[i];
            var escapedTitle = escape(photo.title);
            var extraClasses = "";
            if (photo.latitude && photo.longitude) {
                extraClasses = "flickr-thumbnail-with-geo";
            } else {
                extraClasses = "flickr-thumbnail-without-geo";
            }
            var url = photo.url_s || "images/error.png";
            html += "<a href='javascript:void(0)' class='photo-link' data-photo-page-index='" + (pageNo - 1) + "' data-photo-id='" + photo.id + "'><img class='thumbnail flickr-thumbnail " + extraClasses + "' title='" + escapedTitle + "' alt='" + escapedTitle + "' width='64' height='64' src='" + url + "' /></a>";
        }
        $("div.album-pager").html(this.pagerTemplate({ pageNo: pageNo, pages: pages }));
        $("a.next-album-page").on("click", _.bind(this.onNextAlbumPage, this));
        $("a.prev-album-page").on("click", _.bind(this.onPrevAlbumPage, this));
        $("a.zoom-photo-page-bounds").on("click", _.bind(this.onZoomPhotoPageBounds, this));
        $("a.filter-photostream").on("click", _.bind(this.onFilterPhotoStream, this));
        $(".flickr-thumbnail-grid", this.el).append(html);
        $("a.photo-link").on("click", _.bind(function (e) {
            var lnk = $(e.delegateTarget);
            var pageIndex = lnk.attr("data-photo-page-index");
            var id = lnk.attr("data-photo-id");
            var data = cache.getPageData(pageIndex);
            for (var j = 0; j < data.photo.length; j++) {
                if (data.photo[j].id == id) {
                    EventAggregator.trigger("showPhotos", {
                        photos: [
                            { attributes: data.photo[j] }
                        ]
                    })
                    break;
                }
            }
        }, this));
        $("#photoStreamInfo").html("(" + total + " photos)");
    },
    onNextAlbumPage: function (e) {
        EventAggregator.trigger("loadNextFlickrPage");
    },
    onPrevAlbumPage: function (e) {
        EventAggregator.trigger("loadPrevFlickrPage");
    },
    onZoomPhotoPageBounds: function (e) {
        EventAggregator.trigger("getPhotoPageBounds", {
            callback: function (bounds) {
                //Map is in web mercator so our ll bounds must be transformed to it
                if (bounds != null)
                    bounds.transform(PROJ_LL84, PROJ_WEBMERCATOR);
                EventAggregator.trigger("mapZoomToBounds", bounds);
            }
        });
    },
    onFilterPhotoStream: function (e) {
        var templ = _.template($("#filterDialog").html());
        //You'd think boostrap modal would've removed this for you?
        $(".modal-backdrop").remove();
        var dt = new Date();
        var collectFilter = function(modal) {
            var p = {};
            var elYear = modal.find("input.filter-year");
            var elBBOX = modal.find("input.filter-bbox");
            if (elYear.is(":checked"))
                p.year = $("#filterYear").val();
            if (elBBOX.is(":checked"))
                p.bbox = true;
            return p;
        };
        
        EventAggregator.trigger("getCurrentPhotoFilter", {
            callback: function(args) {
                var filterModal = $(templ({ bbox: args.bbox, year: args.year, fromYear: 2011, toYear: dt.getFullYear() }));
                $("body").append(filterModal);
                
                filterModal.modal('show').on("hidden.bs.modal", function (e) {
                    filterModal.remove();
                    //You'd think boostrap modal would've removed this for you?
                    $(".modal-backdrop").remove();
                });
                filterModal.find("a.apply-filter").on("click", _.bind(function (e) {
                    EventAggregator.trigger("applyPhotoFilter", collectFilter(filterModal));
                    filterModal.modal("hide");
                }, this));
                filterModal.find("a.reset-filter").on("click", _.bind(function (e) {
                    EventAggregator.trigger("resetPhotoFilter");
                    filterModal.modal("hide");
                }, this));
                filterModal.find("a.cancel-btn").on("click", _.bind(function (e) {
                    filterModal.modal("hide");
                }, this));
            }
        });
    }
});

var UploadPhotoView = BaseSidebarView.extend({
    title: "Upload Photo",
    icon: "fa fa-camera",
	initialize: function(options) {
		this.template = _.template($("#uploadSidebar").html());
	},
	render: function() {
		BaseSidebarView.prototype.renderBase.apply(this, arguments);
        var dtPicker = $("#dtDate");
        dtPicker.val(moment().format("YYYY-MM-DD hh:mm"));
        if (!Modernizr.inputtypes.datetime)
            dtPicker.datetimepicker();
        $("#photoLocationButton").click(_.bind(this.onPhotoLocationClick, this));
        $("#photoFile").change(_.bind(this.onPhotoFileChanged, this));
        $("#manualLocationToggle").click(_.bind(this.onManualRecordToggle, this));
        if (typeof(navigator.geolocation) != 'undefined') {
            navigator.geolocation.getCurrentPosition(_.bind(function(pos) { //Success
                $("#photoLocation").val(pos.coords.longitude + " " + pos.coords.latitude);
            }, this), _.bind(function(pos) { //Failure
                $("#photoLocation")
                    .val("")
                    .attr("placeholder", "Could not get your location");
            }, this), { //Options
                enableHighAccuracy: true,
                maximumAge: 0,
                timeout: 7000
            });
        }
        $("#uploadTarget").on("load", _.bind(this.onUploadCompleted, this));
        $("#errorSummary").hide();
        $("#formStatus").html("");
        $("#btnSubmitUpload").on("click", _.bind(this.onFormSubmit, this));
        $("#chkAcceptTerms").change(_.bind(this.onAgreementChanged, this));
        $("#chkAcceptCC").change(_.bind(this.onAgreementChanged, this));
        $("a[data-wkt-role='terms']").on("click", _.bind(this.onShowTerms, this));

        $("#uploadForm").validate({
            rules: {
                "Email": {
                    required: true,
                    email: true
                },
                "FirstName": {
                    required: true
                },
                "PhotoFile": {
                    required: true
                }
            },
            messages: {
                "Email": {
                    required: "Email is required",
                    email: "Email is an invalid email address"
                },
                "FirstName": {
                    required: "First Name is required"
                },
                "PhotoFile": {
                    required: "Please attach a photo"
                }
            },
            focusInvalid: true,
            showErrors: function (errorMap, errorList) {
                $("div.control-group").removeClass("has-error")
                                      .removeClass("has-warning");
                var errors = errorList;
                if (errorList.length > 0) {
                    var errorString = '<strong><i class="fa fa-exclamation-triangle"></i>The following validation errors were found</strong><br/><ul>';
                    for (var i = 0, errorLength = errors.length; i < errorLength; i++) {
                        var el = $(errors[i].element);
                        if (el.hasClass("fileButton"))
                            el.parent().addClass("btn-danger");
                        else
                            el.parent().addClass("has-error");

                        errorString += "<li>" + errors[i].message + '</li>';
                    }
                    errorString += "</ul>";
                    $("#errorSummary").html(errorString).show();
                } else {
                    $("#errorSummary").hide();
                }
            }
        });
        EventAggregator.on("updatePhotoLocationField", _.bind(this.onUpdatePhotoLocationField, this));
	},
	showLightbox: function(args) {
	    if (this.activeModal) {
	        this.activeModal.remove();
	        //You'd think boostrap modal would've removed this for you?
	        $(".modal-backdrop").remove();
	    }
	    this.activeModal = $(this.lightboxTemplate(args));
	    $("body").append(this.activeModal);
	    this.activeModal.toggleClass('blueimp-gallery-controls', true);
	    var links = [];
	    for (var i = 0; i < args.photos.length; i++) {
	        links.push({
	            title: args.photos[i].attributes.title,
	            href: args.getPhotoUrl(args.photos[i]),
	            thumbnail: args.getPhotoUrl(args.photos[i])
	        });
	    }
	    blueimp.Gallery(links, BLUEIMP_GALLERY_OPTIONS);
	},
	showModal: function (html) {
	    if (this.activeModal) {
	        this.activeModal.remove();
	        //You'd think boostrap modal would've removed this for you?
	        $(".modal-backdrop").remove();
	    }
	    this.activeModal = $(html);
	    $("body").append(this.activeModal);
	    this.activeModal.modal('show').on("hidden.bs.modal", function (e) {
	        //You'd think boostrap modal would've removed this for you?
	        $(".modal-backdrop").remove();
	    });
	},
	onShowTerms: function(e) {
	    var tpl = _.template($("#termsModal").html());
	    EventAggregator.trigger("showModal", { template: tpl() });
	},
	onAgreementChanged: function(e) {
	    if ($("#chkAcceptTerms").is(":checked") && $("#chkAcceptCC").is(":checked"))
	        $("#btnSubmitUpload").removeClass("disabled");
	    else
	        $("#btnSubmitUpload").addClass("disabled");
	},
    onUploadCompleted: function(e) {
        alert("Upload complete");
    },
    insertPhotoMarker: function(lon, lat, flickrId) {
        EventAggregator.trigger("addNewPhotoMarker", { lon: lon, lat: lat, flickrId: flickrId });
    },
    validateForm: function(callback) {
        callback($("#uploadForm").valid());
    },
    xhr2upload: function (url, formData, fnProgress) {
        return $.ajax({
            url: url,
            type: 'POST',
            data: formData,
            xhr: function () {
                myXhr = $.ajaxSettings.xhr();
                if (myXhr.upload && fnProgress) {
                    myXhr.upload.addEventListener('progress', function (prog) {
                        var value = ~~((prog.loaded / prog.total) * 100);

                        // if we passed a progress function
                        if (fnProgress && typeof fnProgress == "function") {
                            fnProgress(prog, value);

                            // if we passed a progress element
                        } else if (fnProgress) {
                            $(fnProgress).val(value);
                        }
                    }, false);
                }
                return myXhr;
            },
            cache: false,
            contentType: false,
            processData: false
        });
    },
    onFormSubmit: function (e) {

        var btnUp = $("#btnSubmitUpload");
        var btnCancel = $("#btnCancelUpload");

        btnUp.addClass("disabled");
        btnCancel.addClass("disabled");

        this.validateForm(_.bind(function (bResult) {
            if (bResult) {
                var formData = new FormData();
                formData.append("Email", $("#txtEmail").val());
                formData.append("FirstName", $("#txtFirstName").val());
                formData.append("LastName", $("#txtSurname").val());
                formData.append("PhotoLocation", $("#photoLocation").val());
                formData.append("CreationDate", $("#dtDate").val());
                formData.append("Photofile", $("#photoFile")[0].files[0]);
                formData.append("Description", $("#txtDescription").val());
                e.preventDefault();

                var promise = null;
                var progressModal = _.template($("#progressModal").html());
                this.showModal(progressModal({}));
                if (Modernizr.xhr2) {
                    promise = this.xhr2upload(SERVICE_URL + "/photos", formData, function (prog, value) {
                        console.log("Progress: " + prog + ", Value: " + value);
                        $("#progress").val(value);
                        if (value == 100) {
                            $("#progressMessage").text("Awaiting server response");
                            //debugger;
                        }
                    });
                } else {
                    console.log('using $.ajax');
                    promise = $.ajax({
                        url: SERVICE_URL + "/photos",
                        type: 'POST',
                        data: formData,
                        cache: false,
                        contentType: false,
                        processData: false
                    });
                }

                promise.success(_.bind(function (data) {
                    alert("Photo has been uploaded");
                    if (this.activeModal) {
                        this.activeModal.remove();
                        //You'd think boostrap modal would've removed this for you?
                        $(".modal-backdrop").remove();
                        EventAggregator.trigger("resetPhotoFilter");
                    }
                    var value = $("#photoLocation").val();
                    if (value != "") {
                        var coords = value.split(" ");
                        data.Longitude = coords[0];
                        data.Latitude = coords[1];
                    }
                    data.FlickrId = data.photoId;
                    this.insertPhotoMarker(data.Longitude, data.Latitude, data.FlickrId);
                    //Go home on completion
                    window.location.hash = "#home";
                }, this)).fail(_.bind(function (jqXHR, textStatus, errorThrown) {
                    alert("Failed to upload photo. Error: " + (errorThrown || "unknown") + ", status: " + textStatus);
                    if (this.activeModal) {
                        this.activeModal.remove();
                        //You'd think boostrap modal would've removed this for you?
                        $(".modal-backdrop").remove();
                    }
                    //console.error("Ajax failed");
                    btnUp.removeClass("disabled");
                    btnCancel.removeClass("disabled");
                }, this));
            } else {
                btnUp.removeClass("disabled");
                btnCancel.removeClass("disabled");
            }
        }, this));
    },
    onUpdatePhotoLocationField: function(e) {
        $("#photoLocation").val(e.lon + " " + e.lat);
    },
    onManualRecordToggle: function(e) {
        EventAggregator.trigger("toggleManualLocationRecording");
        closeSidebar();
        this.floatingMsg = $("<div class='floating-map-message alert alert-info'><p><i class='fa fa-info-circle'></i>&nbsp;Drag and zoom to your location. Click/tap here to finish</p></div>");
        $("body").append(this.floatingMsg);
        this.floatingMsg.click(_.bind(function() {
            this.onManualRecordToggle();
            $("div.floating-map-message").remove();
            openSidebar();
        } , this));
        var el = $("#manualLocationToggle");
        var text = el.html();
        if (text == "(Manually change)") {
            el.html("(Update field)");
        } else {
            el.html("(Manually change)");
        }
    },
    updateLocationFromExif: function(exif) {
        var ddLon = exif.GPSLongitude[0] + (exif.GPSLongitude[1] / 60) + (exif.GPSLatitude[2] / 3600);
        var ddLat = exif.GPSLatitude[0] + (exif.GPSLatitude[1] / 60) + (exif.GPSLatitude[2] / 3600);
        if (exif.GPSLongitudeRef == "W")
            ddLon = ddLon * -1;
        if (exif.GPSLatitudeRef == "S")
            ddLat = ddLat * -1;
        $("#photoLocation").val(ddLon + " " + ddLat);
        alert("We found geographic information in your photo, the location field has been updated with this information");
    },
    onPhotoFileChanged: function(e) {
        var _self = this;
        EXIF.getData(e.currentTarget.files[0], function() {
            if (this.exifdata.GPSLatitude && this.exifdata.GPSLongitude && this.exifdata.GPSLatitudeRef && this.exifdata.GPSLongitudeRef) {
                _self.updateLocationFromExif(this.exifdata);
            } else {
                logger.logi("Missing or Insufficient EXIF GeoTag metadata");
            }
        });
        $("#photoFileButton").removeClass("btn-danger").addClass("btn-success");
        $("#photoFileButtonText").html("Photo Selected");
    },
    onPhotoLocationClick: function(e) {
        var value = $("#photoLocation").val();
        if (value != "") {
            var coords = value.split(" ");
            EventAggregator.trigger("showPositionOnMap", { lon: parseFloat(coords[0]), lat: parseFloat(coords[1]) });
        }
    },
	teardown: function() {

	}
});

var logger = {
	logi: function(msg) {
		if (typeof(console) != 'undefined')
			console.log(msg);
	},
	logw: function(msg) {
		if (typeof(console) != 'undefined')
			console.warn(msg);
	},
	loge: function(msg) {
		if (typeof(console) != 'undefined')
			console.error(msg);
	}
}

var AppRouter = Backbone.Router.extend({
	mapView: null,
	sidebarView: null,
	routes: {
		"home": "home",
		"upload": "upload",
        "photos": "photos",
		"*path": "defaultRoute"
	},
	setMapView: function() {
		if (this.mapView == null) {
			this.mapView = new MapView();
			this.mapView.render();
		}
	},
	setSidebar: function(view) {
		if (this.sidebarView != null)
			this.sidebarView.teardown();
		this.sidebarView = view;
		this.sidebarView.render();
        openSidebar();
	},
	home: function() {
		logger.logi("route: home");
        $("li.navbar-link").removeClass("active");
        $("li.home-link").addClass("active");
        $("li.photos-link").removeClass("active");
		this.setMapView();
		this.setSidebar(new HomeSidebarView());
	},
	upload: function() {
		logger.logi("route: upload");
        $("li.navbar-link").removeClass("active");
        $("li.upload-link").addClass("active");
        $("li.photos-link").removeClass("active");
		this.setMapView();
		this.setSidebar(new UploadPhotoView());
	},
	photos: function() {
	    logger.logi("route: photos");
	    $("li.navbar-link").removeClass("active");
	    $("li.upload-link").removeClass("active");
	    $("li.photos-link").addClass("active");
	    this.setMapView();
	    this.setSidebar(new PhotosView());
	},
	defaultRoute: function() {
		logger.logi("unknown route. Going home");
		this.home();
	}
});

var app = {
    initialize: function () {
        $("body").on("click", ".slide-submenu", function() {
            closeSidebar();
        });
        $("body").on("click", ".close-sidebar", function() {
            closeSidebar();
        });
        $("body").on('click', '.mini-submenu-left', function() {
            openSidebar();
        });

		this.router = new AppRouter();
        $("a.base-layer-item").click(_.bind(function(e) {
            this.router.setMapView();
            this.router.mapView.setActiveBaseLayer($(e.target));
        }, this));
        $(document).on("click", "ul.navbar-nav a", function (e) {
            var el = $(this);
            if (el.closest("li.active").length == 1 && !el.hasClass("base-layer-item")) {
                RollupNavbar();
            } else if (el.hasClass("base-layer-item")) {
                RollupNavbar();
            } else if (el.hasClass("map-command")) {
                RollupNavbar();
                closeSidebar();
            } else if (!el.hasClass("dropdown-toggle")) {
                RollupNavbar();
            }
        });
        $(document).on("click", "a.refresh-album", function (e) {
            EventAggregator.trigger("resetPhotoFilter");
        });
		Backbone.history.start();
	}
};

function openSidebar() {
    var thisEl = $('.mini-submenu-left');
    if (thisEl.is(":visible")) {
        $('.sidebar-left .sidebar-body').toggle('slide', function() {
            thisEl.hide();
            applyMargins();
        });
    }
}

function closeSidebar() {
    var thisEl = $('.sidebar-left .slide-submenu');
    if (thisEl.is(":visible")) {
        thisEl.closest('.sidebar-body').fadeOut('slide', function() {
            $('.mini-submenu-left').fadeIn();
            applyMargins();
        });
    }
}

function getDesiredHeight(el) {
    var outerHeight = $(window).height() - el.offset().top;
    return outerHeight - (el.outerHeight(true) - el.innerHeight());
}

function applyMargins() {
    var leftToggler = $(".mini-submenu-left");
    var mapCtrl = $("#map");
    var zoomCtrl = $("#map .olControlZoom");
    var toolbarCtrl = $("#map .olControlTextButtonPanel");
    var sidebar = $("#sidebarBody");
    if (leftToggler.is(":visible")) { //Left sidebar collapsed
        zoomCtrl
            .css("margin-left", 0)
            .removeClass("zoom-top-opened-sidebar")
            .addClass("zoom-top-collapsed");
        toolbarCtrl
            .css("margin-left", 0);
        mapCtrl.css("left", "0px");
    } else {
        var el = $("button.navbar-toggle");
        //let the sidebar "slide-over" the map in mobile display
        //instead of "shrinking" it.
        if (el.is(":visible")) {
            mapCtrl.css("left", "0px");
            zoomCtrl
                .css("margin-left", 0)
                .removeClass("zoom-top-opened-sidebar")
                .addClass("zoom-top-collapsed");
            toolbarCtrl
                .css("margin-left", 0);
        } else {
            mapCtrl.css("left", sidebar.width() + "px");
            zoomCtrl
                .css("margin-left", 30)
                .addClass("zoom-top-opened-sidebar")
                .removeClass("zoom-top-collapsed");
            toolbarCtrl
                .css("margin-left", 30);
        }
        sidebar.height(getDesiredHeight(sidebar));
    }
    EventAggregator.trigger("resizeMapDomElement");
}

$(document).ready(function() {
	app.initialize();
    applyMargins();
    $(window).on("resize", applyMargins);
});
