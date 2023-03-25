//     Copyright (c) 2022 Giovanni Svevo (g.svevo@gmail.com).

//     This program is free software: you can redistribute it and/or modify
//     it under the terms of the GNU General Public License as published by
//     the Free Software Foundation, either version 3 of the License, or
//     any later version.

//     This program is distributed in the hope that it will be useful,
//     but WITHOUT ANY WARRANTY; without even the implied warranty of
//     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//     GNU General Public License for more details.

//     <https://www.gnu.org/licenses/>.

// PARSE JSON FILE
const fetchJSON = async (url) => {
  try {
    const res = await fetch(url);
    return res.json();
  } catch (err) {
    console.error(err);
  }
};
const filteredGeojson = {
  type: 'FeatureCollection',
  features: [],
};
mapboxgl.accessToken =
  'pk.eyJ1IjoiY2Vkcm94NzQiLCJhIjoiY2plM2YzNGZhNjV4NTJ3cXA5b3dpMWQydiJ9.RpG_G_SIxLEVu7ZNSAVPXg';

const map2 = new mapboxgl.Map({
  container: 'map2',
  // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
  style: 'mapbox://styles/cedrox74/cldol6ze6000u01o3vaal60uu',
  layers: [
    {
      id: 'background',
      type: 'background',
      paint: {
        'background-color': 'white',
      },
    },
  ],
  center: [12, 45],
  zoom: 1,
  pitch: 0,
  bearing: 0,
  maxZoom: 15,
});

map2.on('style.load', () => {
  // Custom atmosphere styling
  map2.setFog({
    color: 'rgba(255, 250, 240, 0.9)', // Pink fog / lower atmosphere
    'high-color': 'rgba(255, 250, 240, 0.9)', // Blue sky / upper atmosphere
    'horizon-blend': 0.4, // Exaggerate atmosphere (default is .1)
  });
});

var map = new mapboxgl.Map({
  container: 'map',
  style: {
    version: 8,
    sources: {},
    layers: [
      {
        id: 'background',
        type: 'background',
        paint: {
          'background-color': 'rgba(255, 250, 240, 0.9)',
        },
      },
    ],
  },
  center: [-176.9964, 0],
  zoom: 1,
  minZoom: 13,
  maxZoom: 20,
  pitch: 0,
  bearing: 0,
  preserveDrawingBuffer: true,
});

fetchJSON('data/places.geojson').then((dataGeo) => {
  dataGeo.features.forEach(function (dataGeo, i) {
    dataGeo.properties.id = i;
  });

  geojsondataGeo = dataGeo;
  geojsondataGeo.features.forEach((item, i) => {
    item.id = i + 1;
  });
  console.log(geojsondataGeo);
  //console.log(source);

  //let hoveredStateId = null;

  map2.addSource('placesGeo', {
    type: 'geojson',
    data: geojsondataGeo,
  });

  // The feature-state dependent fill-opacity expression will render the hover effect
  // when a feature's hover state is set to true.
  map2.addLayer({
    id: 'placesWorld',
    type: 'fill',
    source: {
      type: 'geojson',
      data: geojsondataGeo,
    },

    layout: { visibility: 'visible' },
    paint: {
      'fill-color': 'blue',
      'fill-opacity': 0.5,
    },
  });
  map2.addLayer({
    id: 'placesWorldLines',
    type: 'line',
    source: {
      type: 'geojson',
      data: geojsondataGeo,
    },
    layout: {},
    paint: {
      'line-color': 'gray',
      'line-width': 0.1,
    },
  });
});
var coordinates2 = [
  [-30.425850561073787, 2.1229588156130887],
  [66.0975374257812689, 82.4591947798278682],
];

var bounds2 = coordinates2.reduce(function (bounds2, coord) {
  return bounds2.extend(coord);
}, new mapboxgl.LngLatBounds(coordinates2[0], coordinates2[0]));

var coordinates = [
  [-177.0122224090000032, -0.002126916],
  [-176.982097342000003, 0.017116927],
  // [-0.000382511, -0.000067549],
  // [0.000577722, 0.000582554],
];

var bounds = coordinates.reduce(function (bounds, coord) {
  return bounds.extend(coord);
}, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));

let hoveredStateId = null;
let clickedStateId = null;
map.on('load', function () {
  map.fitBounds(bounds, {
    padding: 15,
    pitch: 0,
    bearing: 0,
  });
  map.addSource('timeChart', {
    type: 'raster',
    tiles: ['data/tiles/{z}/{x}/{y}.png'],
    tileSize: 256,
    attribution:
      'Priestley Chart: &copy; <a href="mailto:steiner@uoregon.edu"> University of Oregon</a>',
  });

  map.addLayer({
    id: 'timeChartBase',
    type: 'raster',
    source: 'timeChart',
    layout: {
      visibility: 'visible',
    },
    paint: {
      'raster-opacity': 1,
    },
    minzoom: 10,
    maxzoom: 20,
  });

  fetchJSON('data/placesPoly.geojson').then((dataP) => {
    dataP.features.forEach(function (dataP, i) {
      dataP.properties.id = i;
    });

    geojsondataPP = dataP;
    geojsondataPP.features.forEach((item, i) => {
      item.id = i + 1;
    });
    console.log(geojsondataPP);
    //console.log(source);

    //let hoveredStateId = null;

    map.addSource('placesPolyJson', {
      type: 'geojson',
      data: geojsondataPP,
    });

    map.addLayer({
      id: 'placesPoly',
      type: 'fill',
      source: 'placesPolyJson',
      layout: {},
      paint: {
        'fill-color': 'red',
        'fill-opacity': [
          'case',
          ['boolean', ['feature-state', 'hover'], false],
          0.3,
          0,
        ],
      },
    });

    map.addLayer({
      id: 'placesPolyLines',
      type: 'line',
      source: 'placesPolyJson',
      layout: {},
      paint: {
        'line-color': 'gray',
        'line-width': 0,
      },
    });
  });

  const popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false,
  });
  map.on('mousemove', 'placesPoly', (e) => {
    map.getCanvas().style.cursor = 'pointer';
    if (e.features.length > 0) {
      if (hoveredStateId !== null) {
        map.setFeatureState(
          { source: 'placesPolyJson', id: hoveredStateId },
          { hover: false }
        );
      }

      hoveredStateId = e.features[0].id;
      map.setFeatureState(
        { source: 'placesPolyJson', id: hoveredStateId },
        { hover: true }
      );
    }
    popup
      .setLngLat(e.lngLat)
      .setHTML(
        '<h6> Year: ' +
          Math.trunc((e.lngLat.lng * 100000 + 17700000) * 1.128) +
          '<br>Area: ' +
          e.features[0].properties.name +
          ' <br>Region:  ' +
          e.features[0].properties.region +
          '</h6>'
      )
      .addTo(map);
  });

  map.on('mouseleave', 'placesPoly', () => {
    map.getCanvas().style.cursor = '';
    if (hoveredStateId !== null) {
      map.setFeatureState(
        { source: 'placesPolyJson', id: hoveredStateId },
        { hover: false }
      );
    }
    popup.remove();
    hoveredStateId = null;
  });

  map.on('click', 'placesPoly', (e) => {
    var placename = e.features[0].properties.name;

    jumpy(placename);
    map2.getBounds('placesPoly');
  });
  function jumpy(x) {
    fetch('data/places.geojson')
      .then((response) => response.json())
      .then((data) => {
        //
        data.features.forEach((item) => {
          if (item.properties.name === x) {
            filteredGeojson.features = [];
            filteredGeojson.features.push(item);
          }

          geoFilters(filteredGeojson);
        });
      });
  }
  fetchJSON('data/polyPower2.geojson').then((dataPP) => {
    dataPP.features.forEach(function (dataP, i) {
      dataP.properties.id = i;
    });

    geojsondataPPP = dataPP;

    map.addSource('polypo', {
      type: 'geojson',
      data: geojsondataPPP,
    });

    map.addLayer({
      id: 'powerPoly',
      type: 'fill',
      source: 'polypo',
      layout: {},
      paint: {
        'fill-color': 'red',
        'fill-opacity': [
          'case',
          ['boolean', ['feature-state', 'hover'], false],
          0.3,
          0,
        ],
      },
    });

    map.addLayer({
      id: 'powerPolyLines',
      type: 'line',
      source: 'polypo',
      layout: {},
      paint: {
        'line-color': 'gray',
        'line-width': 0.1,
      },
    });
    map.addLayer({
      id: 'powerPoly3D',
      type: 'fill-extrusion',
      source: 'polypo',
      layout: {
        visibility: 'none',
      },
      paint: {
        'fill-extrusion-color': ['get', 'color'],
        'fill-extrusion-height': ['/', ['get', 'POLY_AREA'], 400],
        'fill-extrusion-base': 0,
        'fill-extrusion-opacity': 0.5,
      },
    });
  });
  map.on('moveend', function () {
    if (map.getPitch() < 20) {
      map.setPaintProperty('powerPoly3D', 'fill-extrusion-height', 0);
      map.setLayoutProperty('powerPoly3D', 'visibility', 'none');
    } else if (map.getPitch() > 21) {
      map.setLayoutProperty('powerPoly3D', 'visibility', 'visible');
      map.setPaintProperty(
        'powerPoly3D',
        'fill-extrusion-height',
        ['/', ['get', 'POLY_AREA'], 400],
        'fill-extrusion-color',
        ['get', 'color']
      );
    }
  });
  map.on('click', 'powerPoly', (e) => {
    if (e.features.length > 0) {
      if (clickedStateId !== null) {
        map.setFeatureState(
          { source: 'polypo', id: clickedStateId },
          { hover: false }
        );
      }

      clickedStateId = e.features[0].id;
      map.setFeatureState(
        { source: 'polypo', id: clickedStateId },
        { hover: true }
      );
    }
  });

  map.on('mouseleave', 'powerPoly', () => {
    if (clickedStateId !== null) {
      map.setFeatureState(
        { source: 'polypo', id: clickedStateId },
        { hover: false }
      );
    }
    clickedStateId = null;
  });
});

// NAVIGATION TOOLS
// Compass
class CompassToggle {
  constructor({ bearing = -13.3 }) {
    this._bearing = bearing;
  }

  onAdd(map) {
    this._map = map;
    let _this = this;
    this._btn = document.createElement('button');
    this._btn.className = 'mapboxgl-ctrl-icon mapboxgl-ctrl-magnetic';
    this._btn.type = 'button';
    this._btn['aria-label'] = 'Toggle bearing';
    this._btn.onclick = function () {
      if (map.getBearing() === 0) {
        let options = { bearing: _this._bearing };

        map.easeTo(options);
        _this._btn.className = 'mapboxgl-ctrl-icon mapboxgl-ctrl-magnetic';
      } else {
        map.easeTo({ bearing: 0 });
        _this._btn.className = 'mapboxgl-ctrl-icon mapboxgl-ctrl-geographic';
      }
    };

    this._container = document.createElement('div');
    this._container.className = 'mapboxgl-ctrl-group mapboxgl-ctrl';
    this._container.title = 'Switch between Magnetic and Geographic North';
    this._container.appendChild(this._btn);

    return this._container;
  }

  onRemove() {
    this._container.parentNode.removeChild(this._container);
    this._map = undefined;
  }
}

// 3D FUNCTION
// Original ES6 Class— https://github.com/tobinbradley/mapbox-gl-pitch-toggle-control
// export default class PitchToggle {
class PitchToggle {
  constructor({ pitch = 50 }) {
    this._pitch = pitch;
  }

  onAdd(map) {
    this._map = map;
    let _this = this;
    this._btn = document.createElement('button');
    this._btn.className = 'mapboxgl-ctrl-icon mapboxgl-ctrl-pitchtoggle-3d';
    this._btn.type = 'button';
    this._btn['aria-label'] = 'Toggle Pitch';
    this._btn.onclick = function () {
      if (map.getPitch() === 0) {
        let options = { pitch: _this._pitch };

        map.easeTo(options);
        _this._btn.className =
          'mapboxgl-ctrl-icon mapboxgl-ctrl-pitchtoggle-2d';
      } else {
        map.easeTo({ pitch: 0 });
        _this._btn.className =
          'mapboxgl-ctrl-icon mapboxgl-ctrl-pitchtoggle-3d';
      }
    };

    this._container = document.createElement('div');
    this._container.className = 'mapboxgl-ctrl-group mapboxgl-ctrl';
    this._container.title = 'Switch between 2D and 3D view';
    this._container.appendChild(this._btn);

    return this._container;
  }

  onRemove() {
    this._container.parentNode.removeChild(this._container);
    this._map = undefined;
  }
}

// Full Extent
class FullExtent {
  onAdd(map) {
    this._map = map;
    let _this = this;
    this._btn = document.createElement('button');
    this._btn.className = 'mapboxgl-ctrl-icon fa fa-globe fa-2x';
    this._btn.type = 'button';
    this._btn['aria-label'] = 'Initial View';
    this._btn.onclick = function () {
      map.fitBounds(bounds, {
        padding: 20,
        pitch: 0,
        bearing: 0,
      });
      map2.fitBounds(bounds2, {
        padding: 20,
        pitch: 0,
        bearing: 0,
      });
      geoFilters(geojsondataGeo);
    };

    this._container = document.createElement('div');
    this._container.className = 'mapboxgl-ctrl-group mapboxgl-ctrl';
    this._container.title = 'Initial View';
    this._container.appendChild(this._btn);

    return this._container;
  }

  onRemove() {
    this._container.parentNode.removeChild(this._container);
    this._map = undefined;
  }
}

map.addControl(
  new mapboxgl.NavigationControl({
    showCompass: false,
    visualizePitch: true,
  }),
  'top-left'
);
var winSize = $(window).width();

//map.addControl(new CompassToggle({ minpitchzoom: 11 }), 'top-left');
map.addControl(new PitchToggle({ minpitchzoom: 11 }), 'top-left');
map.addControl(new FullExtent({ minpitchzoom: 11 }), 'top-left');
map.addControl(new mapboxgl.FullscreenControl(), 'top-left');
if (winSize < 993) {
  map.addControl(
    new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
    }),
    'top-left'
  );
}

function geoFilters(f) {
  // map.setLayoutProperty('placesWorld', 'visibility', 'visible');
  map2.getSource('placesWorld').setData(f);

  var bbox = turf.bbox(f);
  map2.fitBounds(bbox, {
    padding: {
      top: 90,
      bottom: 90,
      left: 90,
      right: 90,
    },
    speed: 0.5,
    maxZoom: 19,
  });
}
function populateList(d) {
  let list1 = [];
  let list2 = [];
  filteredGeojson.features = [];
  d.features.forEach((item) => {
    list1.push(item.properties.region);
    list2.push(item.properties.name);
    filteredGeojson.features.push(item);
  });
  list1 = Array.from(new Set(list1));
  list1 = sortListsByName(list1);
  list2 = Array.from(new Set(list2));
  list2 = sortListsByName(list2);

  let dropdown1 = '<option value=""></option>\n';
  let dropdown2 = '<option value=""></option>\n';

  list1.forEach((item) => {
    dropdown1 =
      dropdown1 + '<option value="' + item + '">' + item + '</option>\n';
  });
  list2.forEach((item) => {
    dropdown2 =
      dropdown2 + '<option value="' + item + '">' + item + '</option>\n';
  });

  $('#primoLivello').html('');
  $('#primoLivello').append(dropdown1);
  $('#secondoLivello').html('');
  $('#secondoLivello').append(dropdown2);
}
function sortListsByName(features) {
  return features.sort(function (f1, f2) {
    var code1 = f1.toUpperCase();
    var code2 = f2.toUpperCase();
    return code1 < code2 ? -1 : code1 > code2 ? 1 : 0;
  });
}
fetch('data/places.geojson')
  .then((response) => response.json())
  .then((data) => {
    $('.livello')
      .prop('selectedIndex', 0)
      .ready(populateList(data))
      .change(function (event) {
        if (event.target.id === 'primoLivello') {
          let list2 = [];
          filteredGeojson.features = [];
          data.features.forEach((item) => {
            if (event.target.value === '') {
              list2.push(item.properties.name);
              filteredGeojson.features.push(item);
            } else {
              if (item.properties.region === event.target.value) {
                list2.push(item.properties.name);
                filteredGeojson.features.push(item);
              }
            }
          });

          list2 = Array.from(new Set(list2));
          list2 = sortListsByName(list2);
          console.log(list2);
          let dropdown2 = '<option value=""></option>\n';
          list2.forEach((item) => {
            dropdown2 =
              dropdown2 +
              '<option value="' +
              item +
              '">' +
              item +
              '</option>\n';
          });

          $('#secondoLivello').html('');
          $('#secondoLivello').append(dropdown2);
        } else if (event.target.id === 'secondoLivello') {
          let list1 = [];
          let list2 = [];
          filteredGeojson.features = [];
          data.features.forEach((item) => {
            if (event.target.value === '') {
              list1.push(item.properties.region);
              list2.push(item.properties.name);
              filteredGeojson.features.push(item);
            } else {
              if (item.properties.name === event.target.value) {
                list1.push(item.properties.region);
                filteredGeojson.features.push(item);
              }
            }
          });
          if (event.target.value === '') {
            populateList(data);
          }
        }
        geoFilters(filteredGeojson);
      });
  });
