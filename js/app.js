mapboxgl.accessToken = 'pk.eyJ1Ijoia2FyaW1pZmFyIiwiYSI6ImNqOGtnaWp4OTBjemsyd211ZDV4bThkNmIifQ.Xg-Td2FFJso83Mmmc87NDA';


var bounds = [
    [-113.983901, 20.833183], // Southwest coordinates
    [-86.097884,40.646082]  // Northeast coordinates
];
var firstSymbolId;
var hoveredInstId = null;

var COLORS = ['#4899D5','#2C3C7E','#0085CF','#BFAD83','#EAAB00','#EFB666','#D7A3B3','#90313E','#BF3B3B','#DA2B1F','#497B59', "#719B50"]
var outlines = ["#005782", "#ED8C00", "#C7362D", "#00973A"]
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/karimifar/ck2ey2mad1rtp1cmppck4wq2d',
    center: [-99.113241, 31.079125],
    zoom: 4.5,
    maxBounds: bounds,
});
map.getCanvas().style.cursor = "auto"

map.on('load', function () {
    var layers = map.getStyle().layers;
    for (var i = 0; i < layers.length; i++) {
        if (layers[i].type === 'symbol') {
            firstSymbolId = layers[i].id;
            break;
        }
    }

    map.addSource("institutions", {
        type: "geojson",
        data: "https://texashealthdata.com/CPAN/inst",
        generateId: true,
    })
    map.addSource("regions", {
        type: "geojson",
        data: "https://texashealthdata.com/CPAN/region",
        generateId: true,
    })

    map.addLayer({
        'id': 'region_fill',
        'type': 'fill',
        'source':'regions',
        // 'minzoom': zoomThreshold,
        'paint':{
            "fill-color": ["match",
                ["get", "id"], 
                "1",outlines[0],
                "2",outlines[1],
                "3",outlines[2],
                outlines[3]
            ],
            "fill-opacity": 0.2
        }
    }, firstSymbolId);
    
    map.addLayer({
        'id': 'inst_fills',
        'type': 'fill',
        'source':'institutions',
        'layout': {
            'visibility':'visible'
        },
        // 'minzoom': zoomThreshold,
        'paint':{
            'fill-color':[
                'match',
                ['get','id'],
                'UTHSCSA',COLORS[7],
                'TTUHSCEP',COLORS[11],
                'UTRGV',COLORS[8],
                'DELL',COLORS[6],
                'TAMU',COLORS[9],
                'UTMB',COLORS[5],
                'BCM',COLORS[3],
                'UTHSCT',COLORS[2],
                'UTSMC',COLORS[1],
                'UNTHSC',COLORS[0],
                'TTUHSC',COLORS[10],
                COLORS[4],
            ],
            'fill-opacity': 0.75
        }
    },firstSymbolId);

    map.addLayer({
        'id': 'region_outline',
        'type': 'line',
        'source':'regions',
        // 'minzoom': zoomThreshold,
        'paint':{
            "line-color": ["match",
                ["get", "id"], 
                "1",outlines[0],
                "2",outlines[1],
                "3",outlines[2],
                outlines[3]
            ],
            "line-width": 4,
            "line-opacity": 0.5
        }
    }, firstSymbolId);

    map.addLayer({
        'id': 'inst_outline',
        'type': 'line',
        'source':'institutions',
        // 'minzoom': zoomThreshold,
        'paint':{
            "line-color": ["case",
                ["boolean", ["feature-state", "hover"], false],
                "#111",
                "#999"
            ],
            "line-width": ["case",
                ["boolean", ["feature-state", "hover"], false],
                1,
                0.1
            ],
        }
    }, firstSymbolId);


    map.on('mousemove', 'inst_fills', function (e) {
        if (e.features.length > 0) {
            if (hoveredInstId>=0) {
                
                map.setFeatureState(
                    { source: 'institutions', id: hoveredInstId },
                    { hover: false }
                );
            }

            var inst = e.features[0].properties.name
            var region_num = e.features[0].properties.region_num
            var inst_num = e.features[0].properties.dial_num
            $("#popup1").css("display","block")
            $("#popup1").html("<p>This area is covered by</p><p class='inst-name'>"+inst+"</p>")
            $("#popup2").html("<p>If you are in this region, dial <span>" + region_num+"</span> first, then <span>" + inst_num+"</span></p>")

            map.getCanvas().style.cursor = "pointer"
            hoveredInstId = e.features[0].id;
            map.setFeatureState(
                { source: 'institutions', id: hoveredInstId },
                { hover: true }
            );
        }
    });
    map.on('mouseleave', 'inst_fills', function () {
        if (hoveredInstId>=0) {
            map.setFeatureState(
                { source: 'institutions', id: hoveredInstId },
                { hover: false }
            );
        }
        $("#popup1").css("display","none")
        hoveredInstId = null;
        map.getCanvas().style.cursor = "auto"
    });

});

$("#mapwrap").on("mousemove", function(e){
    var position = $("#mapwrap")[0].getBoundingClientRect();
    var divX = position.x
    var divY = position.y

    var mouseX=e.clientX
    var mouseY=e.clientY
    $("#popup1").css("top", mouseY-divY+18)
    $("#popup1").css("left", mouseX-divX-125)
})


