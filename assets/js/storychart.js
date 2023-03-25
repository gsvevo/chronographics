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

let hoveredStateId = null;
let clickedStateId = null;
map.on('load', function () {
  // map.addControl(new mapboxgl.NavigationControl(), 'top-left');
  var coordinates = [
    [-177.0122224090000032, -0.002126916],
    [-176.982097342000003, 0.017116927],
  ];

  var bounds = coordinates.reduce(function (bounds, coord) {
    return bounds.extend(coord);
  }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));
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

  map.addSource('rinne', {
    type: 'geojson',
    data: 'data/storymap/rinne/storyChart.geojson',
  });
  map.addLayer({
    id: 'rinne',
    type: 'fill-extrusion',
    source: 'rinne',
    layout: {
      // make layer visible by default
      visibility: 'none',
    },
    paint: {
      'fill-extrusion-color': 'yellow',
      'fill-extrusion-height': 5,
      'fill-extrusion-base': 0,
      'fill-extrusion-opacity': 0.1,
    },
  });

  fetchJSON('data/placesPoly.geojson').then((dataP) => {
    dataP.features.forEach(function (dataP, i) {
      dataP.properties.id = i;
    });

    geojsondataPP = dataP;
    geojsondataPP.features.forEach((item, i) => {
      item.id = i + 1;
    });

    map.addSource('placesPolyJson', {
      type: 'geojson',
      data: geojsondataPP,
    });

    // The feature-state dependent fill-opacity expression will render the hover effect
    // when a feature's hover state is set to true.
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

  // When the mouse leaves the state-fill layer, update the feature state of the
  // previously hovered feature.
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
});

var chapters = {
  1: {
    center: [-176.9974, 0.0075],
    zoom: 17,
    pitch: 0,
    padding: 0,
    bearing: 0,
    speed: 0.2, // make the flying slow
    curve: 1, // change the speed at which it zooms out
  },
  2: {
    center: [-176.9974, 0.0075],
    zoom: 17,
    pitch: 0,
    padding: 0,
    bearing: 0,
    speed: 0.2, // make the flying slow
    curve: 1, // change the speed at which it zooms out
  },
  3: {
    center: [-176.9974, 0.0075],
    zoom: 17,
    pitch: 0,
    bearing: 0,
    speed: 0.2,
    padding: 0,
    curve: 1,
  },
  4: {
    //1
    center: [-177.0045, 0.012],
    zoom: 19,
    pitch: 0,
    bearing: 0,
    speed: 0.2,
    padding: 0,
    curve: 1,
  },
  5: {
    center: [-177.0045, 0.016],
    zoom: 19,
    pitch: 0,
    bearing: 0,
    speed: 0.2,
    padding: 0,
    curve: 1,
  },
  6: {
    center: [-176.9974, 0.0075],
    zoom: 17,
    pitch: 0,
    bearing: 0,
    speed: 0.2,
    padding: 0,
    curve: 1,
  },
  7: {
    center: [-177.01, 0.015],
    zoom: 19,
    pitch: 0,
    bearing: 0,
    speed: 0.2,
    padding: 0,
    curve: 1,
  },
  8: {
    center: [-177.01, 0.015],
    zoom: 18,
    pitch: 0,
    bearing: 0,
    speed: 0.2,
    padding: 0,
    curve: 1,
  },
  9: {
    center: [-176.999, 0.001],
    zoom: 20,
    pitch: 0,
    bearing: -91,
    speed: 0.2,
    padding: 0,
    curve: 1,
  },
  10: {
    //7
    center: [-176.9974, 0.0075],
    zoom: 17,
    pitch: 0,
    bearing: 0,
    speed: 0.2,
    padding: 0,
    curve: 1,
  },
};

// On every scroll event, check which element is on screen
window.onscroll = function () {
  var chapterNames = Object.keys(chapters);

  for (var i = 0; i < chapterNames.length; i++) {
    var chapterName = chapterNames[i];

    if (isElementOnScreen(chapterName)) {
      setActiveChapter(chapterName);
      break;
    }
    visibleLayers(chapterName);
  }
};

var activeChapterName = '1';
function setActiveChapter(chapterName) {
  if (chapterName === activeChapterName) return;
  zz = chapters[chapterName].zoom;
  var bounds = geoViewport.bounds(
    chapters[chapterName].center,
    chapters[chapterName].zoom,
    [937, 1910]
  );
  map.fitBounds(bounds, {
    padding: {
      top: chapters[chapterName].padding,
      bottom: 0,
      left: 0,
      right: 0,
    },
    speed: chapters[chapterName].speed,
    bearing: chapters[chapterName].bearing,
    pitch: chapters[chapterName].pitch,
  });

  document.getElementById(chapterName).setAttribute('class', 'active');
  document
    .getElementById(activeChapterName)
    .setAttribute('class', 'disabledbutton');

  activeChapterName = chapterName;
}
// Layers active on each chapter
function visibleLayers(activeChapterName) {
  if (activeChapterName === '1') {
    map.setLayoutProperty('rinne', 'visibility', 'none');
    // map.setLayoutProperty('tiber', 'visibility', 'visible');
  }
  if (activeChapterName === '2') {
    map.setFilter('rinne', ['==', 'Slide', '1']);
  }
  if (activeChapterName === '3') {
    map.setLayoutProperty('rinne', 'visibility', 'visible');
    map.setFilter('rinne', ['==', 'Slide', '1']);
  }
  if (activeChapterName === '4') {
    map.setFilter('rinne', ['==', 'Slide', '2']);
  }
  if (activeChapterName === '5') {
    map.setFilter('rinne', ['==', 'Slide', '2']);
  }
  if (activeChapterName === '6') {
    map.setFilter('rinne', ['==', 'Slide', '4']);
    $('#sezAng').hide();
  }
  if (activeChapterName === '7') {
    map.setFilter('rinne', ['==', 'Slide', '4']);
    $('#sezAng').show();
  }
  if (activeChapterName === '8') {
    map.setFilter('rinne', ['==', 'Slide', '6']);
    $('#sezAng').hide();
  }
  if (activeChapterName === '9') {
    map.setFilter('rinne', ['==', 'Slide', '7']);
  }
  if (activeChapterName === '10') {
    map.setFilter('rinne', ['==', 'Slide', '8']);
  }
  if (activeChapterName === '12') {
    map.setFilter('rinne', ['==', 'Slide', '8']);
  }
  if (activeChapterName === '13') {
    map.setFilter('rinne', ['==', 'Slide', '9']);
  }
  if (activeChapterName === '14') {
    map.setFilter('rinne', ['==', 'Slide', '10']);
  }
}
function isElementOnScreen(id) {
  var element = document.getElementById(id);
  var bounds = element.getBoundingClientRect();
  return bounds.top < window.innerHeight && bounds.bottom > 0;
}

$('#explanation').hover(
  function () {
    map.setFilter('rinne', ['==', 'Name', 'explanation']);
    map.setPaintProperty('rinne', 'fill-extrusion-color', 'red');
  },
  function () {
    map.setPaintProperty('rinne', 'fill-extrusion-color', 'yellow');
    map.setFilter('rinne', ['==', 'Slide', '1']);
  }
);
$('#time').hover(
  function () {
    map.setFilter('rinne', ['==', 'Name', 'Timeline']);
    map.setPaintProperty('rinne', 'fill-extrusion-color', 'red');
  },
  function () {
    map.setPaintProperty('rinne', 'fill-extrusion-color', 'yellow');
    map.setFilter('rinne', ['==', 'Slide', '4']);
  }
);
$('#carmen').hover(
  function () {
    map.setFilter('rinne', ['==', 'Name', 'carmen']);
    map.setPaintProperty('rinne', 'fill-extrusion-color', 'blue');
  },
  function () {
    map.setPaintProperty('rinne', 'fill-extrusion-color', 'yellow');
    map.setFilter('rinne', ['==', 'Slide', '2']);
  }
);

$('#vediSez').hover(
  function () {
    $('#sezTrio').show();
  },
  function () {
    $('#sezTrio').hide();
  }
);
$('#vediSez2').hover(
  function () {
    $('#sezSisto').show();
  },
  function () {
    $('#sezSisto').hide();
  }
);
$('#vediSez3').hover(
  function () {
    $('#sezTiber').show();
  },
  function () {
    $('#sezTiber').hide();
  }
);
$('#vediSez4').hover(
  function () {
    $('#sezTiber2').show();
  },
  function () {
    $('#sezTiber2').hide();
  }
);

// FUNCTION TO SCROLL WITH ARROWS UP AND DOWN
$(function () {
  var pagePositon = 0,
    sectionsSeclector = 'section',
    $scrollItems = $(sectionsSeclector),
    offsetTolorence = 30,
    pageMaxPosition = $scrollItems.length - 1;

  //Map the sections:
  $scrollItems.each(function (index, ele) {
    $(ele).attr('debog', index).data('pos', index);
  });

  // Bind to scroll
  $(window).bind('scroll', upPos);

  //Move on click:
  $('.arrow').click(function (e) {
    if ($(this).hasClass('next') && pagePositon + 1 <= pageMaxPosition) {
      pagePositon++;
      $('html, body')
        .stop()
        .animate(
          {
            scrollTop: $scrollItems.eq(pagePositon).offset().top,
          },
          300
        );
    }
    if ($(this).hasClass('previous') && pagePositon - 1 >= 0) {
      pagePositon--;
      $('html, body')
        .stop()
        .animate(
          {
            scrollTop: $scrollItems.eq(pagePositon).offset().top,
          },
          300
        );
      return false;
    }
  });

  //Update position func:
  function upPos() {
    var fromTop = $(this).scrollTop();
    var $cur = null;
    $scrollItems.each(function (index, ele) {
      if ($(ele).offset().top < fromTop + offsetTolorence) $cur = $(ele);
    });
    if ($cur != null && pagePositon != $cur.data('pos')) {
      pagePositon = $cur.data('pos');
    }
  }
});
// BUTTON TO GET BACK ON TOP OF THE DOCUMENT
//Get the button
var topButton = document.getElementById('topBtn');

// When the user gets close to the bottom displays the button

$(window).scroll(function () {
  if ($(window).scrollTop() + $(window).height() > $(document).height() - 500) {
    topButton.style.display = 'block';
    $('.next').hide();
  } else {
    topButton.style.display = 'none';
    $('.next').show();
  }
});

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}
