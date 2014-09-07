var debugMessage = function(msg) {
	$("#debug").html(msg);
}

Modernizr.addTest('formdata', 'FormData' in window);
Modernizr.addTest('xhr2', 'FormData' in window && 'ProgressEvent' in window);

var EventAggregator = _.extend({}, Backbone.Events);
var SERVICE_URL = "http://kingtides-api-env-fubbpjhd29.elasticbeanstalk.com";

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

/* 2014 tide data from original site */
/*
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
*/

//var FLICKR_USER_ID = '69841693@N07'; //witnesskingtides
//var FLICKR_API_KEY = '3e35f603d86b21583ad77509dd9fd597';

//Test account settings
var FLICKR_USER_ID = '110846737@N06';
var FLICKR_API_KEY = 'affd35180d0689ad7ca999c1619d0e6d';

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
            "https://api.flickr.com/services/rest?jsoncallback=?",
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
        }).fail(function () {
            debugger;
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
            api_key: FLICKR_API_KEY,
            format: 'json',
            user_id: FLICKR_USER_ID,
            method: 'flickr.photos.search',
            extras: 'geo,url_s,url_c,url_o,date_taken,date_upload,owner_name,original_format,o_dims,views',
            per_page: this.photosPerPage,
            page: (this.page + 1)/*,
            bbox: this.getMapBounds()
            */
        };

        if (this.args && this.args.year) {
            console.log("Filtering by year: " + this.args.year);
            var dtStart = moment.utc([this.args.year, 0, 1]);
            var dtEnd = moment.utc([this.args.year, 11, 31]);
            console.log("Flickr date range: " + dtStart.unix() + " to " + dtEnd.unix());
            params.min_taken_date = dtStart.unix();
            params.max_taken_date = dtEnd.unix();
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
/*

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

*/

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
	initialize: function(options) {
        this.tideModalTemplate = _.template($("#tideModal").html());
        this.photoModalTemplate = _.template($("#photoModal").html());
        this.lightboxTemplate = _.template($("#lightbox").html());
        EventAggregator.on("mapZoomToBounds", _.bind(this.onMapZoomToBounds, this));
        EventAggregator.on("requestLegendUpdate", _.bind(this.onRequestLegendUpdate, this));

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
            /*
            new OpenLayers.Control.Button({
                trigger: function () {
                    window.location.hash = "#home";
                },
                displayClass: 'wkt-btn-about'
            }),
            new OpenLayers.Control.Button({
                trigger: function () {
                    window.location.hash = "#upload";
                },
                displayClass: 'wkt-btn-upload'
            }),
            new OpenLayers.Control.Button({
                trigger: function () {
                    window.location.hash = "#photos";
                },
                displayClass: 'wkt-btn-photos'
            }),
            */
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
        $("div.wkt-btn-aboutItemInactive").html("<i class='fa fa-home'></i>");
        $("div.wkt-btn-uploadItemInactive").html("<i class='fa fa-camera'></i>");
        $("div.wkt-btn-photosItemInactive").html("<i class='fa fa-picture-o'></i>");
        $("div.wkt-btn-locateItemInactive").html("<i class='fa fa-location-arrow'></i>");
        $("div.wkt-btn-initialzoomItemInactive").html("<i class='fa fa-arrows-alt'></i>");

        this.map.updateSize();

        this.createPositionLayer();
        this.createFlickrPhotoLayer();
        this.map.events.register("moveend", this, this.onMoveEnd);
        this.map.events.register("changebaselayer", this, this.onBaseLayerChange);
        this.setActiveBaseLayer($("a.base-layer-item[data-layer-name='goog-phys']"));
        //Initial view is Australia
        this.initialView();
        EventAggregator.on("addNewPhotoMarker", _.bind(this.onAddNewPhotoMarker, this));
        EventAggregator.on("showPositionOnMap", _.bind(this.onShowPositionOnMap, this));
        EventAggregator.on("toggleManualLocationRecording", _.bind(this.onToggleManualLocationRecording, this));
        EventAggregator.trigger("requestLegendUpdate");

        //This bit can fail if running on a domain that's not white-listed by the backend, so do it last
        $.getJSON(SERVICE_URL + "/tides", _.bind(function (tides) {
            this.tideEvents = tides;
            this.createTideLayer();
        }, this));

		
	},
	initialView: function() {
	    var bounds = new OpenLayers.Bounds(10470115.700925, -5508791.4417243, 19060414.686531, -812500.42453675);
	    this.map.zoomToExtent(bounds, false);
	    this.cache.updateExtents(bounds);
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
            /*
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
             */
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
        var pt = new OpenLayers.Geometry.Point(data.lon, data.lat);
        pt.transform(PROJ_LL84, PROJ_WEBMERCATOR);
        this.photosLayer.addFeatures([
            new OpenLayers.Feature.Vector(
                pt, { flickrId: data.flickrId })
        ]);
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

		EventAggregator.on("flickrCacheReset", _.bind(this.onFlickrCacheReset, this));
		EventAggregator.on("flickrPageLoaded", _.bind(this.onFlickrPageLoaded, this));
	},
	onFlickrCacheReset: function() {
	    this.photosLayer.removeAllFeatures();
	},
	onFlickrPageLoaded: function(e) {
	    var cache = e.cache;
	    var data = cache.getCurrentPageData();
	    var features = [];

	    for (var i = 0; i < data.photo.length; i++) {
	        var photo = data.photo[i];
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
	    var getPhotoUrlFunc = function (photo) {
	        return photo.attributes.url_c || photo.attributes.url_s;
	        /*
	        return OpenLayers.String.format("http://farm${farmid}.staticflickr.com/${serverid}/${id}_${secret}_o.${imgformat}", {
	            farmid: photo.attributes.farm,
	            serverid: photo.attributes.server,
	            id: photo.attributes.id,
	            secret: photo.attributes.secret,
	            imgformat: photo.attributes.originalformat
	        });*/
	    };
	    var getThumbnailFunc = function (photo) {
	        return photo.attributes.url_s;
	    };
        /*
	    this.showModal(this.photoModalTemplate({
	        photos: e.photos,
	        getPhotoUrl: getPhotoUrlFunc
	    }));
        */
	    this.showLightbox({
	        photos: e.photos,
	        getPhotoUrl: getPhotoUrlFunc,
	        getThumbnailUrl: getThumbnailFunc
	    });
	},
	showLightbox: function (args) {
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
	            thumbnail: args.getThumbnailUrl(args.photos[i])
	        });
	    }
	    blueimp.Gallery(links, BLUEIMP_GALLERY_OPTIONS);
	},
	onPhotoFeatureSelected: function(event) {
	    this.selectControl.unselect(event.feature);
	    
        if (event.feature.cluster.length == 1) {
            this.onShowPhotos({ photos: event.feature.cluster });
        } else {
            if (this.map.getScale() < MAX_INTERACTION_SCALE) {
                this.onShowPhotos({ photos: event.feature.cluster });
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
                    this.onShowPhotos({ photos: event.feature.cluster });
                }
            }
        }
    },
    onTideSelected: function(event) {
        this.selectControl.unselect(event.feature);
        //alert("Selected tide");
        this.showModal(this.tideModalTemplate({
            location: event.feature.attributes.event.location,
            startDate: moment(event.feature.attributes.event.eventStart).format("Do MMM H:mm A"),
            range: function () {
                var start = moment(event.feature.attributes.event.eventStart);
                var end = moment(event.feature.attributes.event.eventEnd);
                return start.format("Do MMM") + " to " + end.format("Do MMM");
            }
        }));
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
        var html = "";
        var escape = function (str) {
            return str.replace(/'/g, "&apos;").replace(/"/g, "&quot;");
        };
        for (var i = 0; i < data.photo.length; i++) {
            var photo = data.photo[i];
            var escapedTitle = escape(photo.title);
            html += "<a href='javascript:void(0)' class='photo-link' data-photo-page-index='" + (pageNo - 1) + "' data-photo-id='" + photo.id + "'><img class='thumbnail flickr-thumbnail' title='" + escapedTitle + "' alt='" + escapedTitle + "' width='64' height='64' src='" + photo.url_s + "' /></a>";
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
        var filterModal = $(templ({ year: this.filterYear || dt.getFullYear(), fromYear: 2011, toYear: dt.getFullYear() }));
        $("body").append(filterModal);
        filterModal.modal('show').on("hidden.bs.modal", function (e) {
            filterModal.remove();
            //You'd think boostrap modal would've removed this for you?
            $(".modal-backdrop").remove();
        });
        filterModal.find("a.apply-filter").on("click", _.bind(function (e) {
            EventAggregator.trigger("applyPhotoFilter", { year: $("#filterYear").val() });
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

        /*
        var validator = new FormValidator("uploadForm", [
            { name: "Email", display: "Email", rules: "valid_email" },
            { name: "Email", display: "Email", rules: "required" },
            { name: "FirstName", display: "First Name", rules: "required" },
            { name: "PhotoFile", display: "Photo", rules: "required" }
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
        */
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
                        //console.log("Progress: " + prog + ", Value: " + value);
                        $("#progress").val(value);
                        if (value == 100) {
                            $("#progressMessage").text("Awaiting server response");
                            //debugger;
                        }
                    });
                } else {
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
    onPhotoFileChanged: function(e) {
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
            var el = $(e.target);
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
    var zoomCtrl = $("#map .olControlZoom");
    var toolbarCtrl = $("#map .olControlTextButtonPanel");
    if (leftToggler.is(":visible")) { //Right sidebar collapsed
        zoomCtrl
            .css("margin-left", 0)
            .removeClass("zoom-top-opened-sidebar")
            .addClass("zoom-top-collapsed");
        toolbarCtrl
            .css("margin-left", 0);
    } else {
        var el = $("#sidebarBody");
        zoomCtrl
            .css("margin-left", el.width() + 30)
            .addClass("zoom-top-opened-sidebar")
            .removeClass("zoom-top-collapsed");
        toolbarCtrl
            .css("margin-left", el.width() + 30);
        el.height(getDesiredHeight(el));
    }
}

$(document).ready(function() {
	app.initialize();
    applyMargins();
    $(window).on("resize", applyMargins);
});