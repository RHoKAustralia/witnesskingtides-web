var debugMessage = function(msg) {
	$("#debug").html(msg);
}

var EventAggregator = _.extend({}, Backbone.Events);

/* 2014 tide data from original site */

var TIDE_DATA = {
    qld: {
        areaInfo: [{"name":"Abbot Point","encodedName":"Abbot+Point","dateTime":"2 January, 9.47AM","dateRange":"1–3 January","tide":[],"latLng":"-19.9078861, 148.08467259999998"},{"name":"Brisbane  Bar","encodedName":"Brisbane++Bar","dateTime":"2 January, 10.16AM","dateRange":"1–3 January","tide":[],"latLng":"-27.477819, 153.01889119999998"},{"name":"Booby Island","encodedName":"Booby+Island","dateTime":"2 January, 3.49PM","dateRange":"1–3 January","tide":[],"latLng":"-10.6, 141.91666669999995"},{"name":"Bowen","encodedName":"Bowen","dateTime":"2 January, 10.31AM","dateRange":"1–3 January","tide":[],"latLng":"-20.012989496249062, 148.24161529541016"},{"name":"Bundaberg (Burnett Heads)","encodedName":"Bundaberg+(Burnett+Heads)","dateTime":"2 January, 9.08AM","dateRange":"1–3 January","tide":[],"latLng":"-24.875493983465375, 152.34981536865234"},{"name":"Cairns","encodedName":"Cairns","dateTime":"2 January, 9.57AM","dateRange":"1–3 January","tide":[],"latLng":"-16.928219873986436, 145.75647354125977"},{"name":"Gladstone","encodedName":"Gladstone","dateTime":"2 January, 9.45AM","dateRange":"1–3 January","tide":[],"latLng":"-23.862249813222824, 151.2484359741211"},{"name":"Gold Coast Seaway","encodedName":"Gold+Coast+Seaway","dateTime":"2 January, 8.50AM","dateRange":"1–3 January","tide":[],"latLng":"-27.934645, 153.43017429999998"},{"name":"Hay Point","encodedName":"Hay+Point","dateTime":"2 January, 11.20AM","dateRange":"1–3 January","tide":[],"latLng":"-21.3055785, 149.2921629"},{"name":"Lucinda","encodedName":"Lucinda","dateTime":"2 January, 9.44AM","dateRange":"1–3 January","tide":[],"latLng":"-18.5281158, 146.33142079999993"},{"name":"Mackay Outer Harbour","encodedName":"Mackay+Outer+Harbour","dateTime":"2 January, 11.22AM","dateRange":"1–3 January","tide":[],"latLng":"-21.1166667, 149.23333330000003"},{"name":"Mooloolaba","encodedName":"Mooloolaba","dateTime":"2 January, 8.39AM","dateRange":"1–3 January","tide":[],"latLng":"-26.6778695, 153.117347"},{"name":"Mourilyan Harbour","encodedName":"Mourilyan+Harbour","dateTime":"2 January, 9.43AM","dateRange":"1–3 January","tide":[],"latLng":"-17.5964692, 146.1184002"},{"name":"Noosa Head","encodedName":"Noosa+Head","dateTime":"2 January, 8.36AM","dateRange":"1–3 January","tide":[],"latLng":"-26.397933176477725, 153.08993339538574"},{"name":"Port Alma","encodedName":"Port+Alma","dateTime":"2 January, 9.47AM","dateRange":"1–3 January","tide":[],"latLng":"-23.6220066, 150.7327272"},{"name":"Port Douglas","encodedName":"Port+Douglas","dateTime":"2 January, 9.45AM","dateRange":"1–3 January","tide":[],"latLng":"-16.4839785, 145.46583269999996"},{"name":"Rosslyn Bay","encodedName":"Rosslyn+Bay","dateTime":"2 January, 9.36AM","dateRange":"1–3 January","tide":[],"latLng":"-23.165461, 150.79087800000002"},{"name":"Shute Harbour","encodedName":"Shute+Harbour","dateTime":"2 January, 11.17AM","dateRange":"1–3 January","tide":[],"latLng":"-20.2909865, 148.78480590000004"},{"name":"Townsville","encodedName":"Townsville","dateTime":"2 January, 9.40AM","dateRange":"1–3 January","tide":[],"latLng":"-19.26008280877702, 146.81459426879883"},{"name":"Urangan","encodedName":"Urangan","dateTime":"2 January, 9.15AM","dateRange":"1–3 January","tide":[],"latLng":"-25.2815385, 152.9007788"},{"name":"Waddy Point (Fraser Island)","encodedName":"Waddy+Point+(Fraser+Island)","dateTime":"2 January, 8.26AM","dateRange":"1–3 January","tide":[],"latLng":"-24.9657049, 153.34970799999996"},{"name":"Karumba","encodedName":"Karumba","dateTime":"14 January, 6.48PM","dateRange":"13–15 January","tide":[],"latLng":"-17.4871222, 140.84385309999993"},{"name":"Mornington Island","encodedName":"Mornington+Island","dateTime":"9 February, 6.17PM","dateRange":"8–10 February","tide":[],"latLng":"-16.5174872, 139.40594350000003"},{"name":"Weipa (Humbug Point)","encodedName":"Weipa+(Humbug+Point)","dateTime":"2 January, 4.23PM","dateRange":"1–3 January","tide":[],"latLng":"-12.6591475, 141.83840639999994"},{"name":"Goods Island","encodedName":"Goods+Island","dateTime":"2 January, 3.33PM","dateRange":"1–3 January","tide":[],"latLng":"-10.5631623, 142.15672870000003"},{"name":"Thursday Island","encodedName":"Thursday+Island","dateTime":"2 January, 1.31PM","dateRange":"1–3 January","tide":[],"latLng":"-10.579887, 142.21849180000004"},{"name":"Twin Island","encodedName":"Twin+Island","dateTime":"2 January, 12.49PM","dateRange":"1–3 January","tide":[],"latLng":"-10.462299094860645, 142.44742155075073"}],
        centre: [-19.864214743046055, 144.1076254882812],
        polygon: [
            [-15.467640980318691, 138.0211997070312],
            [-26.050056008354655, 137.8893637695312],
            [-26.010568421566955, 140.9655356445312],
            [-29.088033941334867, 140.9215903320312],
            [-29.011200006345323, 155.0280356445312],
            [-24.099812281950037, 153.5338950195312],
            [-12.868770392806363, 144.6129965820312],
            [-10.177817575762617, 143.1188559570312],
            [-10.069664835628357, 141.6247153320312]
        ]
    },
    nsw: {
        areaInfo: [{"name":"Botany Bay","encodedName":"Botany+Bay","dateTime":"2 January, 9.37AM","dateRange":"1–3 January","tide":[],"latLng":"-33.9894153, 151.18110520000005"},{"name":"Eden","encodedName":"Eden","dateTime":"2 January, 9.29AM","dateRange":"1–3 January","tide":[],"latLng":"-37.0637713, 149.90208719999998"},{"name":"Lord Howe Island","encodedName":"Lord+Howe+Island","dateTime":"2 January, 9.30AM","dateRange":"1–3 January","tide":[],"latLng":"-31.5314822, 159.07019949999994"},{"name":"Newcastle","encodedName":"Newcastle","dateTime":"2 January, 9.39AM","dateRange":"1–3 January","tide":[],"latLng":"-32.937070535144855, 151.76599502563477"},{"name":"Port Kembla","encodedName":"Port+Kembla","dateTime":"2 January, 9.31AM","dateRange":"1–3 January","tide":[],"latLng":"-34.4800735, 150.90049499999998"},{"name":"Sydney (Fort Denison)","encodedName":"Sydney+(Fort+Denison)","dateTime":"2 January, 9.34AM","dateRange":"1–3 January","tide":[],"latLng":"-33.90429307746067, 151.20723724365234"},{"name":"Yamba","encodedName":"Yamba","dateTime":"2 January, 9.45AM","dateRange":"1–3 January","tide":[],"latLng":"-29.437827, 153.36027220000005"},{"name":"Norfolk Island","encodedName":"Norfolk+Island","dateTime":"2 January, 8.59AM","dateRange":"1–3 January","tide":[],"latLng":"-29.028385453132888, 167.95366287231445"}],
        centre: [-32.6411645257494, 146.0961508789062],
        polygon: [
            [-29.12642943573516, 140.9215903320312],
            [-29.12642943573516, 153.9733481445312],
            [-37.62570457972075, 150.3698325195312],
            [-34.1374374871612, 140.9655356445312]
        ]
    },
    vic: {
        areaInfo: [{"name":"Lakes Entrance","encodedName":"Lakes+Entrance","dateTime":"2 January, 9.55AM","dateRange":"1–3 January","tide":[],"latLng":"-37.8795844, 147.99160470000004"},{"name":"Corio Bay","encodedName":"Corio+Bay","dateTime":"5 January, 6.53AM","dateRange":"4–6 January","tide":[],"latLng":"-38.1126262, 144.40139069999998"},{"name":"Lorne","encodedName":"Lorne","dateTime":"5 January, 3.21PM","dateRange":"4–6 January","tide":[],"latLng":"-38.5408943, 143.97515199999998"},{"name":"Melbourne (Williamstown)","encodedName":"Melbourne+(Williamstown)","dateTime":"2 January, 3.08PM","dateRange":"1–3 January","tide":[],"latLng":"-37.86543543539307, 144.8913860321045"},{"name":"Port Phillip Heads (Pt. Lonsdale)","encodedName":"Port+Phillip+Heads+(Pt.+Lonsdale)","dateTime":"5 January, 3.36PM","dateRange":"4–6 January","tide":[],"latLng":"-38.28831976627922, 144.6123504638672"},{"name":"Port Welshpool Pier","encodedName":"Port+Welshpool+Pier","dateTime":"2 January, 1.00PM","dateRange":"1–3 January","tide":[],"latLng":"-38.702927236289305, 146.46697998046875"},{"name":"Portland","encodedName":"Portland","dateTime":"5 January, 2.37PM","dateRange":"4–6 January","tide":[],"latLng":"-38.3459644936538, 141.62338256835938"},{"name":"Western Port (Stony Point)","encodedName":"Western+Port+(Stony+Point)","dateTime":"5 January, 6.10PM","dateRange":"4–6 January","tide":[],"latLng":"-38.4604358, 145.33647029999997"},{"name":"Queenscliff","encodedName":"Queenscliff","dateTime":"2 January, 1.08PM","dateRange":"1–3 January","tide":[],"latLng":"-38.2674447, 144.66145030000007"}],
        centre: [-37.039336153896414, 143.9812827148437],
        polygon: [
            [-34.24648679299879, 140.8776450195312],
            [-39.31150724749879, 140.9215903320312],
            [-39.00482907557522, 148.7878012695312],
            [-37.62570457972075, 149.9743247070312]
        ]
    },
    tas: {
        areaInfo: [{"name":"Hobart","encodedName":"Hobart","dateTime":"2 January, 8.51AM","dateRange":"1–3 January","tide":[],"latLng":"-42.88904574206035, 147.3486328125"},{"name":"Spring Bay","encodedName":"Spring+Bay","dateTime":"2 January, 9.14AM","dateRange":"1–3 January","tide":[],"latLng":"-42.5119347, 147.91379589999997"},{"name":"Burnie","encodedName":"Burnie","dateTime":"5 January, 3.37PM","dateRange":"4–6 January","tide":[],"latLng":"-41.0753348, 145.8975881"},{"name":"Low Head","encodedName":"Low+Head","dateTime":"2 January, 12.16PM","dateRange":"1–3 January","tide":[],"latLng":"-41.080404, 146.80794330000003"},{"name":"Mersey River","encodedName":"Mersey+River","dateTime":"2 January, 12.14PM","dateRange":"1–3 January","tide":[],"latLng":"-41.2164604, 146.37222410000004"},{"name":"Stanley","encodedName":"Stanley","dateTime":"5 January, 3.58PM","dateRange":"4–6 January","tide":[],"latLng":"-40.75740009012924, 145.29796600341797"}],
        centre: [-42.05087079481745, 146.7718100585937],
        polygon: [
            [-40.457969274363855, 143.2946372070312],
            [-44.192590565125606, 145.1842856445312],
            [-44.12953922881023, 147.9528403320312],
            [-40.08915391402296, 149.2272543945312]
        ]
    },
    sa: {
        areaInfo: [{"name":"Wallaroo","encodedName":"Wallaroo","dateTime":"1 February, 6.39AM","dateRange":"31 January–2 February","tide":[],"latLng":"-33.93212316661666, 137.62595557956956"},{"name":"Port Giles","encodedName":"Port+Giles","dateTime":"20 March, 6.55PM","dateRange":"19–21 March","tide":[],"latLng":"-35.09069797301508, 137.76031494140625"},{"name":"Port Adelaide (Outer Harbour)","encodedName":"Port+Adelaide+(Outer+Harbour)","dateTime":"20 March, 7.27PM","dateRange":"19–21 March","tide":[],"latLng":"-34.8477448, 138.50736159999997"},{"name":"Thevenard","encodedName":"Thevenard","dateTime":"18 March, 2.48PM","dateRange":"17–19 March","tide":[],"latLng":"-32.1460098, 133.65003230000002"},{"name":"Victor Harbor","encodedName":"Victor+Harbor","dateTime":"20 March, 3.43PM","dateRange":"19–21 March","tide":[],"latLng":"-35.56574628576277, 138.6309814453125"},{"name":"Port Lincoln","encodedName":"Port+Lincoln","dateTime":"20 March, 4.46PM","dateRange":"19–21 March","tide":[],"latLng":"-34.7195321, 135.85746229999995"},{"name":"Port Pirie","encodedName":"Port+Pirie","dateTime":"1 February, 9.10AM","dateRange":"31 January–2 February","tide":[],"latLng":"-33.177215147756435, 138.01437377929688"},{"name":"Whyalla","encodedName":"Whyalla","dateTime":"1 February, 8.33AM","dateRange":"31 January–2 February","tide":[],"latLng":"-33.0343994, 137.58491479999998"}],
        centre: [-33.04716128893536, 134.8022055664062],
        polygon: [
            [-26.0895302968355, 129.0124106445312],
            [-32.03898579228225, 129.0124106445312],
            [-38.76537829325686, 140.8336997070312],
            [-26.168438921898414, 140.8336997070312]
        ]
    },
    wa: {
        areaInfo: [{"name":"Wyndham","encodedName":"Wyndham","dateTime":"4 March, 9.09AM","dateRange":"3–5 March","tide":[],"latLng":"-15.46691621458645, 128.10333251953125"},{"name":"Albany","encodedName":"Albany","dateTime":"7 March, 12.40PM","dateRange":"6–8 March","tide":[],"latLng":"-35.021702, 117.88110400000005"},{"name":"Esperance","encodedName":"Esperance","dateTime":"5 March, 12.41PM","dateRange":"4–6 March","tide":[],"latLng":"-33.8594128, 121.89324839999995"},{"name":"Carnarvon","encodedName":"Carnarvon","dateTime":"5 March, 1.31PM","dateRange":"4–6 March","tide":[],"latLng":"-24.8826946, 113.65702039999996"},{"name":"Barrow Island (Tanker Mooring)","encodedName":"Barrow+Island+(Tanker+Mooring)","dateTime":"4 March, 1.13PM","dateRange":"3–5 March","tide":[],"latLng":"-20.7804342, 115.40227060000007"},{"name":"Barrow Island (Wapet Landing)","encodedName":"Barrow+Island+(Wapet+Landing)","dateTime":"4 March, 12.46PM","dateRange":"3–5 March","tide":[],"latLng":"-20.7804342, 115.40227060000007"},{"name":"Broome","encodedName":"Broome","dateTime":"4 March, 12.25PM","dateRange":"3–5 March","tide":[],"latLng":"-17.9512214, 122.24432720000004"},{"name":"Cape Voltaire (Krait Bay)","encodedName":"Cape+Voltaire+(Krait+Bay)","dateTime":"4 March, 12.31PM","dateRange":"3–5 March","tide":[],"latLng":"-14.2666667, 125.58333330000005"},{"name":"Cape Domett","encodedName":"Cape+Domett","dateTime":"2 March, 6.44PM","dateRange":"1–3 March","tide":[],"latLng":"-14.8333333, 128.3833333"},{"name":"Thevenard Island","encodedName":"Thevenard+Island","dateTime":"4 March, 1.02PM","dateRange":"3–5 March","tide":[],"latLng":"-21.460737306938082, 115.0048828125"},{"name":"Dampier (King Bay)","encodedName":"Dampier+(King+Bay)","dateTime":"4 March, 12.38PM","dateRange":"3–5 March","tide":[],"latLng":"-20.6637988, 116.70846040000004"},{"name":"Denham","encodedName":"Denham","dateTime":"5 March, 3.34PM","dateRange":"4–6 March","tide":[],"latLng":"-25.928723, 113.53538900000001"},{"name":"Derby","encodedName":"Derby","dateTime":"5 March, 4.33PM","dateRange":"4–6 March","tide":[],"latLng":"-17.290331535947793, 123.59619140625"},{"name":"Exmouth","encodedName":"Exmouth","dateTime":"5 March, 1.47PM","dateRange":"4–6 March","tide":[],"latLng":"-21.9307242, 114.12238879999995"},{"name":"Onslow (Beadon Creek)","encodedName":"Onslow+(Beadon+Creek)","dateTime":"4 March, 1.23PM","dateRange":"3–5 March","tide":[],"latLng":"-21.637849, 115.11338720000003"},{"name":"Port Hedland","encodedName":"Port+Hedland","dateTime":"4 March, 12.59PM","dateRange":"3–5 March","tide":[],"latLng":"-20.3116266, 118.57525770000007"},{"name":"Port Walcott (Cape Lambert)","encodedName":"Port+Walcott+(Cape+Lambert)","dateTime":"4 March, 12.39PM","dateRange":"3–5 March","tide":[],"latLng":"-20.59807974803205, 117.17330932617188"},{"name":"Yampi Sound (Koolan Island)","encodedName":"Yampi+Sound+(Koolan+Island)","dateTime":"4 March, 1.21PM","dateRange":"3–5 March","tide":[],"latLng":"-16.124985029560996, 123.760986328125"},{"name":"Bunbury","encodedName":"Bunbury","dateTime":"7 March, 12.40PM","dateRange":"6–8 March","tide":[],"latLng":"-33.34, 115.64200000000005"},{"name":"Fremantle","encodedName":"Fremantle","dateTime":"7 March, 2.08PM","dateRange":"6–8 March","tide":[],"latLng":"-32.0560399, 115.74717970000006"},{"name":"Geraldton","encodedName":"Geraldton","dateTime":"6 March, 1.32PM","dateRange":"5–7 March","tide":[],"latLng":"-28.7791667, 114.61444440000002"},{"name":"Hillarys","encodedName":"Hillarys","dateTime":"7 March, 1.56PM","dateRange":"6–8 March","tide":[],"latLng":"-31.7982298, 115.74544519999995"}],
        centre: [-25.211806348580123, 123.2173666992187],
        polygon: [
            [-11.92452626166107, 128.8805747070312],
            [-32.89175095971917, 128.9245200195312],
            [-36.07856985697885, 114.1588950195312],
            [-22.037972814601616, 110.9069418945312]
        ]
    },
    nt: {
        areaInfo: [{"name":"Melville Bay (Gove Harbour, Gunyangara)","encodedName":"Melville+Bay+(Gove+Harbour%2c+Gunyangara)","dateTime":"2 February, 10.15AM","dateRange":"1–3 February","tide":[],"latLng":"-12.18164971017173, 136.6644287109375"},{"name":"Centre Island","encodedName":"Centre+Island","dateTime":"31 January, 3.53PM","dateRange":"30 January–1 February","tide":[],"latLng":"-15.6860155, 136.75752209999996"},{"name":"Darwin","encodedName":"Darwin","dateTime":"31 January, 7.09PM","dateRange":"30 January–1 February","tide":[],"latLng":"-12.466748786417785, 130.8313751220703"},{"name":"Milner Bay (Groote Eylandt)","encodedName":"Milner+Bay+(Groote+Eylandt)","dateTime":"25 February, 6.31PM","dateRange":"24–26 February","tide":[],"latLng":"-13.68601918691519, 136.593017578125"}],
        centre: [-19.5410870271295, 133.6101889648437],
        polygon: [
            [-25.93155341022971, 128.9684653320312],
            [-10.63165465677275, 129.1881918945312],
            [-11.063254413822584, 137.8893637695312],
            [-25.892026014334608, 137.9333090820312]
        ]
    }
};

var FLICKR_USER_ID = '69841693@N07'; //witnesskingtides
var FLICKR_API_KEY = '3e35f603d86b21583ad77509dd9fd597';

var LAYER_GOOG_PHYS = "goog-phys";
var LAYER_GOOG_STREET = "goog-street";
var LAYER_GOOG_HYBRID = "goog-hybrid";
var LAYER_GOOG_SATELLITE = "goog-satellite";
var LAYER_OSM = "osm";

var MAX_INTERACTION_SCALE = 60000;

/**
 * A specific format for parsing Flickr API JSON responses.
 */
OpenLayers.Format.Flickr = OpenLayers.Class(OpenLayers.Format, {
    read: function(obj) {
        if(obj.stat === 'fail') {
            throw new Error(
                ['Flickr failure response (',
                 obj.code,
                 '): ',
                 obj.message].join(''));
        }
        if(!obj || !obj.photos ||
           !OpenLayers.Util.isArray(obj.photos.photo)) {
            throw new Error(
                'Unexpected Flickr response');
        }
        var photos = obj.photos.photo, photo,
            x, y, point,
            feature, features = [];
        for(var i=0,l=photos.length; i<l; i++) {
            photo = photos[i];
            x = photo.longitude;
            y = photo.latitude;
            point = new OpenLayers.Geometry.Point(x, y);
            feature = new OpenLayers.Feature.Vector(point, {
                title: photo.title,
                img_url: photo.url_s
            });
            features.push(feature);
        }
        return features;
    }
});

var MapView = Backbone.View.extend({
	map: null,
    activeModal: null,
    tideModalTemplate: null,
    photoModalTemplate: null,
    selectControl: null,
    bManualLocationRecording: false,
	initialize: function(options) {
        this.tideModalTemplate = _.template($("#tideModal").html());
        this.photoModalTemplate = _.template($("#photoModal").html());
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
        this.map.addControl(new OpenLayers.Control.Scale());
        this.map.addControl(new OpenLayers.Control.MousePosition({ displayProjection: "EPSG:4326" }));
		this.map.updateSize();
        this.createPositionLayer();
		this.createFlickrPhotoLayer();
        this.createTideLayer();
		this.map.events.register("moveend", this, this.onMoveEnd);
        this.map.events.register("changebaselayer", this, this.onBaseLayerChange);
        this.setActiveBaseLayer($("a.base-layer-item[data-layer-name='goog-hybrid']"));
		//Initial view is Australia
		this.initialView();
        EventAggregator.on("showPositionOnMap", _.bind(this.onShowPositionOnMap, this));
        EventAggregator.on("toggleManualLocationRecording", _.bind(this.onToggleManualLocationRecording, this));
	},
    initialView: function() {
        this.map.zoomToExtent(new OpenLayers.Bounds(10470115.700925, -5508791.4417243, 19060414.686531, -812500.42453675), false);
    },
    onShowPositionOnMap: function(e) {
        if (this.positionLayer) {
            this.positionLayer.removeAllFeatures();

            var point = new OpenLayers.Geometry.Point(e.lon, e.lat);
            point.transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:3857"));
            var feat = new OpenLayers.Feature.Vector(point);

            this.positionLayer.addFeatures([ feat ]);

            var zoomLevel = 16;
            this.map.moveTo(new OpenLayers.LonLat(point.x, point.y), zoomLevel);
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
        center.transform(new OpenLayers.Projection("EPSG:3857"), new OpenLayers.Projection("EPSG:4326"));
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
    showModal: function(html) {
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
        this.positionLayer = new OpenLayers.Layer.Vector("User Position", {
            projection: "EPSG:3857",
            styleMap: new OpenLayers.StyleMap({
                "default": style,
                "select": {
                    fillColor: "#8aeeef",
                    strokeColor: "#32a8a9"
                }
            })
        });
        this.map.addLayer(this.positionLayer);
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

        this.tidesLayer = new OpenLayers.Layer.Vector("Tides", {
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
        var srcProj = new OpenLayers.Projection("EPSG:4326");
        var dstProj = new OpenLayers.Projection("EPSG:3857");
        var features = [];
        for (var state in TIDE_DATA) {
            var ai = TIDE_DATA[state].areaInfo;
            for (var i = 0; i < ai.length; i++) {
                var item = ai[i];
                var latLng = item.latLng.split(",");
                //OL is lon/lat. Always!
                var pt = new OpenLayers.Geometry.Point(parseFloat($.trim(latLng[1])), parseFloat($.trim(latLng[0])));
                pt.transform(srcProj, dstProj)
                var feat = new OpenLayers.Feature.Vector(
                    pt,
                    item);
                features.push(feat);
            }
        }
        this.tidesLayer.addFeatures(features);

        this.map.addLayer(this.tidesLayer);
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
                    return Math.min(feature.attributes.count, 7) + 3;
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

		this.photosLayer = new OpenLayers.Layer.Vector("Flickr Photos", {
            projection: "EPSG:4326",
            strategies: [
                new OpenLayers.Strategy.Fixed(),
                new OpenLayers.Strategy.Cluster()
            ],
            protocol: new OpenLayers.Protocol.Script({
                url: "http://api.flickr.com/services/rest",
                params: {
                    api_key: FLICKR_API_KEY,
                    format: 'json',
                    user_id: FLICKR_USER_ID,
                    method: 'flickr.photos.search',
                    extras: 'geo,url_s',
                    per_page: 250,
                    page: 1,
                    bbox: [-180, -90, 180, 90]
                },
                callbackKey: 'jsoncallback',
                format: new OpenLayers.Format.Flickr()
            }),
            styleMap: new OpenLayers.StyleMap({
                "default": style,
                "select": {
                    fillColor: "#8aeeef",
                    strokeColor: "#32a8a9"
                }
            })
        });

		this.map.addLayer(this.photosLayer);
		this.updateSelectControl();
        this.photosLayer.events.on({"featureselected": _.bind(this.onPhotoFeatureSelected, this)});
	},
	onPhotoFeatureSelected: function(event) {
        this.selectControl.unselect(event.feature);
        if (event.feature.cluster.length == 1) {
            this.showModal(this.photoModalTemplate({ photos: event.feature.cluster }));
        } else {
            if (this.map.getScale() < MAX_INTERACTION_SCALE) {
                this.showModal(this.photoModalTemplate({ photos: event.feature.cluster }));
                /*
                if (event.feature.cluster.length > 1) {
                    alert("Selected multiple photos");
                } else {
                    alert("Selected photo");
                }*/
            } else {
                if (event.feature.cluster.length > 1) {
                    var bounds = new OpenLayers.Bounds();
                    for (var i = 0; i < event.feature.cluster.length; i++) {
                        bounds.extend(event.feature.cluster[i].geometry.getBounds());
                    }
                    this.map.zoomToExtent(bounds);
                } else {
                    //alert("Selected photo");
                    this.showModal(this.photoModalTemplate({ photos: event.feature.cluster }));
                }
            }
        }
    },
    onTideSelected: function(event) {
        this.selectControl.unselect(event.feature);
        //alert("Selected tide");
        this.showModal(this.tideModalTemplate({ tide: event.feature }));
    }
});

var HomeSidebarView = Backbone.View.extend({
	template: null,
	el: $("#sidebar"),
    title: "About",
    icon: "fa fa-info-circle",
	initialize: function(options) {
		this.template = _.template($("#homeSidebar").html());
	},
	render: function() {
		$(this.el).html(this.template({ title: this.title, icon: this.icon }));
	},
	teardown: function() {

	}
});

var UploadPhotoView = Backbone.View.extend({
	template: null,
	el: $("#sidebar"),
    title: "Upload Photo",
    icon: "fa fa-camera",
	initialize: function(options) {
		this.template = _.template($("#uploadSidebar").html());
	},
	render: function() {
		$(this.el).html(this.template({ title: this.title, icon: this.icon }));
        $("#dtDate").val(moment().format("YYYY-MM-DD hh:mm"))
                    .datetimepicker();
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
        $("#uploadForm").on("submit", _.bind(this.onFormSubmit, this));
        var validator = new FormValidator("uploadForm", [
            { name: "txtEmail", display: "Email", rules: "valid_email" },
            { name: "txtEmail", display: "Email", rules: "required" },
            { name: "txtFirstName", display: "First Name", rules: "required" },
            { name: "photoFile", display: "Photo", rules: "required" }
        ], function(errors, event) {
            $("div.control-group").removeClass("has-error")
                                  .removeClass("has-warning");
            if (errors.length > 0) {
                var errorString = '<strong><i class="fa fa-exclamation-triangle"></i>The following validation errors were found</strong><br/>';
                for (var i = 0, errorLength = errors.length; i < errorLength; i++) {
                    $("#" + errors[i].id).parent().addClass("has-error");
                    errorString += errors[i].message + '<br />';
                }
                
                $("#errorSummary").html(errorString).show();
                $("#btnSubmitUpload").removeClass("disabled");
                $("#btnCancelUpload").removeClass("disabled");
            } else {
                $("#errorSummary").html("").hide();
            }
        });

        EventAggregator.on("updatePhotoLocationField", _.bind(this.onUpdatePhotoLocationField, this));
	},
    onUploadCompleted: function(e) {
        alert("Upload complete");
    },
    onFormSubmit: function(e) {
        $("#btnSubmitUpload").addClass("disabled");
        $("#btnCancelUpload").addClass("disabled");
        $("#formStatus").html("")
    },
    onUpdatePhotoLocationField: function(e) {
        $("#photoLocation").val(e.lon + " " + e.lat);
    },
    onManualRecordToggle: function(e) {
        EventAggregator.trigger("toggleManualLocationRecording");
        var el = $("#manualLocationToggle");
        var text = el.html();
        if (text == "(Manually change)") {
            el.html("(Update field)");
        } else {
            el.html("(Manually change)");
        }
    },
    onPhotoFileChanged: function(e) {
        $("#photoFileButton").addClass("btn-success");
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
        $("#sidebarTogglerButton").html("<i class='"+ view.icon + "'></i>&nbsp;" + view.title);
	},
	home: function() {
		logger.logi("route: home");
        $("li.navbar-link").removeClass("active");
        $("li.home-link").addClass("active");
		this.setMapView();
		this.setSidebar(new HomeSidebarView());
	},
	upload: function() {
		logger.logi("route: upload");
        $("li.navbar-link").removeClass("active");
        $("li.upload-link").addClass("active");
		this.setMapView();
		this.setSidebar(new UploadPhotoView());
	},
	defaultRoute: function() {
		logger.logi("unknown route. Going home");
		this.home();
	}
});

var app = {
	initialize: function() {
		$('[data-toggle=offcanvas]').click(function() {
		    $('.row-offcanvas').toggleClass('active');
		});
		this.router = new AppRouter();
        $("a.base-layer-item").click(_.bind(function(e) {
            this.router.setMapView();
            this.router.mapView.setActiveBaseLayer($(e.target));
        }, this));
		Backbone.history.start();
	}
};

$(document).ready(function() {
	app.initialize();
});