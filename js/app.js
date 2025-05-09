mapboxgl.accessToken =
  "pk.eyJ1Ijoia2FyaW1pZmFyIiwiYSI6ImNqOGtnaWp4OTBjemsyd211ZDV4bThkNmIifQ.Xg-Td2FFJso83Mmmc87NDA";

var bounds = [
  [-113.983901, 20.833183], // Southwest coordinates
  [-86.097884, 40.646082], // Northeast coordinates
];
var firstSymbolId;
var hoveredInstId = null;
var zoomThreshold = 5.5;
var COLORS = [
  "#4899D5",
  "#2C3C7E",
  "#0085CF",
  "#BFAD83",
  "#EAAB00",
  "#EFB666",
  "#D7A3B3",
  "#90313E",
  "#BF3B3B",
  "#DA2B1F",
  "#497B59",
  "#719B50",
];
var outlines = ["#005782", "#ED8C00", "#C7362D", "#00973A"];
var APIroot = "https://txhealth-uts-d171ec3cfebb.herokuapp.com";

var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/karimifar/ck2ey2mad1rtp1cmppck4wq2d",
  center: [-100.113241, 31.079125],
  zoom: 4.8,
  maxZoom: 9,
  minZoom: 3.5,
  // maxBounds: bounds,
});
map.getCanvas().style.cursor = "auto";
var nav = new mapboxgl.NavigationControl();
map.addControl(nav, "top-right");

map.on("load", function () {
  var layers = map.getStyle().layers;
  for (var i = 0; i < layers.length; i++) {
    if (layers[i].type === "symbol") {
      firstSymbolId = layers[i].id;
      break;
    }
  }

  map.addSource("institutions", {
    type: "geojson",
    data: APIroot + "/CPAN/inst",
    generateId: true,
  });
  map.addSource("regions", {
    type: "geojson",
    data: APIroot + "/CPAN/region",
    generateId: true,
  });
  map.addSource("counties", {
    type: "geojson",
    data: "https://texashealthdata.com/NAS/counties",
    generateId: true,
  });
  map.addSource("regions-points", {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      name: "points",
      crs: {
        type: "name",
        properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" },
      },
      features: [
        {
          type: "Feature",
          properties: { id: 4, region_num: 4, name: "West Region" },
          geometry: {
            type: "Point",
            coordinates: [-101.593537621890576, 32.5],
          },
        },
        {
          type: "Feature",
          properties: {
            id: 1,
            region_num: 1,
            name: "North and Northeast Regions",
          },
          geometry: {
            type: "Point",
            coordinates: [-95.846314200881622, 32.964545198723101],
          },
        },
        {
          type: "Feature",
          properties: {
            id: 3,
            region_num: 3,
            name: "Valley and Central Regions",
          },
          geometry: {
            type: "Point",
            coordinates: [-98.586269671249539, 29.809672353613244],
          },
        },
        {
          type: "Feature",
          properties: {
            id: 2,
            region_num: 2,
            name: "South and Southeast Regions",
          },
          geometry: {
            type: "Point",
            coordinates: [-94.85879539213235, 30.331518752689654],
          },
        },
      ],
    },

    generateId: true,
  });

  map.addLayer(
    {
      id: "counties-outline",
      type: "line",
      source: "counties",
      minzoom: zoomThreshold,
      paint: {
        "line-color": "#000",
        "line-width": 1,
        "line-opacity": 0.5,
      },
    },
    firstSymbolId
  );

  map.addLayer(
    {
      id: "region_fill",
      type: "fill",
      source: "regions",
      maxzoom: zoomThreshold,
      paint: {
        "fill-color": [
          "match",
          ["get", "id"],
          "1",
          outlines[0],
          "2",
          outlines[1],
          "3",
          outlines[2],
          outlines[3],
        ],
        "fill-opacity": 0.2,
      },
    },
    firstSymbolId
  );

  map.addLayer(
    {
      id: "inst_fills",
      type: "fill",
      source: "institutions",
      layout: {
        visibility: "visible",
      },
      minzoom: zoomThreshold,
      paint: {
        "fill-color": [
          "match",
          ["get", "id"],
          "UTHSCSA",
          COLORS[7],
          "TTUHSCEP",
          COLORS[11],
          "UTRGV",
          COLORS[8],
          "DELL",
          COLORS[6],
          "TAMU",
          COLORS[9],
          "UTMB",
          COLORS[5],
          "BCM",
          COLORS[3],
          "UTHSCT",
          COLORS[2],
          "UTSMC",
          COLORS[1],
          "UNTHSC",
          COLORS[0],
          "TTUHSC",
          COLORS[10],
          COLORS[4],
        ],
        "fill-opacity": 0.75,
      },
    },
    firstSymbolId
  );

  map.addLayer(
    {
      id: "counties-text",
      type: "symbol",
      source: "counties",
      minzoom: zoomThreshold,
      layout: {
        // get the title name from the source's "title" property
        "text-field": ["get", "countyName"],
        "text-font": ["Halyard Text Book", "Arial Unicode MS Bold"],
        "text-size": 10,
        "text-offset": [0, 0],
        // 'text-anchor': 'center'
      },
      paint: {
        "text-color": "#222",
        // 'text-halo-color': "#fff",
        // 'text-halo-width': 0.1,
      },
    },
    firstSymbolId
  );

  map.addLayer(
    {
      id: "region_outline",
      type: "line",
      source: "regions",
      // 'minzoom': zoomThreshold,
      paint: {
        "line-color": [
          "match",
          ["get", "id"],
          "1",
          outlines[0],
          "2",
          outlines[1],
          "3",
          outlines[2],
          outlines[3],
        ],
        "line-width": 4,
        "line-opacity": 0.5,
      },
    },
    firstSymbolId
  );

  map.addLayer(
    {
      id: "inst_outline",
      type: "line",
      source: "institutions",
      minzoom: zoomThreshold,
      paint: {
        "line-color": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          "#222",
          "#999",
        ],
        "line-width": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          2,
          0.1,
        ],
      },
    },
    firstSymbolId
  );

  map.addLayer({
    id: "region_num",
    type: "symbol",
    source: "regions-points",
    maxzoom: zoomThreshold,
    layout: {
      // get the title name from the source's "title" property
      "text-field": ["get", "name"],
      "text-font": ["Halyard Text Bold", "Arial Unicode MS Bold"],
      "text-size": 18,
      "text-offset": [0, 0],
      // 'text-ignore-placement': true,
      "text-max-width": 5,
      "text-line-height": 1,
      // 'text-anchor': 'center'
    },
    paint: {
      "text-color": "#2F2951",
      "text-halo-color": "#fff",
      "text-halo-width": 1,
      "text-halo-blur": 1,
    },
  });
  // map.addLayer({
  //     'id': 'region_names',
  //     'type': 'symbol',
  //     'source':'regions-points',
  //     'maxzoom': zoomThreshold,
  //     'layout': {
  //         // get the title name from the source's "title" property
  //         'text-field': ['get', 'name'],
  //         'text-font': [
  //         'Open Sans Semibold',
  //         'Arial Unicode MS Bold'
  //         ],
  //         'text-size': 12,
  //         'text-offset': [0, 1.25],
  //         // 'text-anchor': 'center'
  //         }
  // });

  map.on("mousemove", "inst_fills", function (e) {
    if (e.features.length > 0) {
      if (hoveredInstId >= 0) {
        map.setFeatureState(
          { source: "institutions", id: hoveredInstId },
          { hover: false }
        );
      }

      var inst = e.features[0].properties.name;
      var region_num = e.features[0].properties.region_num;
      var inst_num = e.features[0].properties.dial_num;
      $("#popup1").css("display", "block");
      $("#popup1").html("<p class='inst-name'>" + inst + "</p>");

      map.getCanvas().style.cursor = "pointer";
      hoveredInstId = e.features[0].id;
      map.setFeatureState(
        { source: "institutions", id: hoveredInstId },
        { hover: true }
      );
    }
  });
  map.on("mouseleave", "inst_fills", function () {
    if (hoveredInstId >= 0) {
      map.setFeatureState(
        { source: "institutions", id: hoveredInstId },
        { hover: false }
      );
    }
    $("#popup1").css("display", "none");
    hoveredInstId = null;
    map.getCanvas().style.cursor = "auto";
  });

  map.on("click", "inst_fills", function (e) {
    console.log(hoveredInstId);
    if (hoveredInstId || hoveredInstId == 0) {
      var inst = e.features[0].properties.name;
      var inst_id = e.features[0].properties.id;
      var region_num = e.features[0].properties.region_num;
      var inst_num = e.features[0].properties.dial_num;

      showPopup(inst_id, region_num, inst_num);
    } else {
      $("#popup2").css("display", "none");
    }
  });
  map.on("click", function (e) {
    console.log(hoveredInstId);
    if (hoveredInstId || hoveredInstId == 0) {
      $("#popup2").css("display", "block");
    } else {
      $("#popup2").css("display", "none");
    }
  });
});

$("#mapwrap").on("mousemove", function (e) {
  var position = $("#mapwrap")[0].getBoundingClientRect();
  var divX = position.x;
  var divY = position.y;

  var mouseX = e.clientX;
  var mouseY = e.clientY;
  $("#popup1").css("top", mouseY - divY + 18);
  $("#popup1").css("left", mouseX - divX - 100);
});

$("#exit").on("click", function () {
  $("#popup2").css("display", "none");
});

$("#zip-submit").on("click", function (event) {
  event.preventDefault();
  search_input = $("#zip-input").val().trim();

  if (isNaN(search_input)) {
    alert("Please enter a Zip code");
  } else {
    var req_url = APIroot + "/api/cpan/codebyzip/" + search_input;

    $.get(req_url, function (data) {
      if (data[0]) {
        console.log(data);
        var inst_id = data[0].hub;
        var reg_code = data[0].menu[0];
        var inst_code = data[0].menu[1];

        var z_lat = data[0].zip_county.z_lat;
        var z_lng = data[0].zip_county.z_lng;

        map.flyTo({
          center: [z_lng, z_lat],
          zoom: 10,
        });

        showPopup(inst_id, reg_code, inst_code);
      } else {
        alert("please enter a valid zip code");
      }
    });
  }
});

function showPopup(id, reg_code, inst_code) {
  $("#popup2").css("display", "block");
  var logoPath = "./assets/inst-logos/" + id + ".png";
  $("#instructions").html(
    "<div class='instructions'><p>Once you've connected, press:<p> <span>" +
      reg_code +
      "</span> for region and <br><span>" +
      inst_code +
      "</span> for institution</p></div>"
  );
  $("#instructions").append(
    "<div class='inst-logo'><img src='" + logoPath + "'></div>"
  );
}
