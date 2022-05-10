"use strict";
'use strict';
var csv = null;
	
async function getCsv(url) {
//	if (csv != null) return;
	let response = await fetch(url);
	if (response.status != 200) {
		throw new Error("Server Error");
	}
	// read response stream as text
	let data = await response.text();
	csv = $.csv.toObjects(data, {
		separator: ';', // Sets a custom field separator character
		delimiter: '"',
		headers: false
	});
} /* getCsv */

$(document).ready(async function () {
	await getCsv('data/data.csv');	
    let radioHTML = "";
    var radio;
    var map;
    // Creating map options
    var mapOptions = {
        center: [38.359, 24.186], //center on Euboea
        zoom: 6
    }

    // Get color depending on population density value
    function setColor(d) {
        return (d == "") ? '#ccc' :  //no data
            d > 20 ? '#800026' :
			d > 15 ? '#BD0026' :
			d > 10 ? '#E31A1C' :
			d > 5 ? '#FC4E2A' :
			d > 0 ? '#FD8D3C' :
			d < 0 ? '#f9ffa0' :
				    '#cbffa0';
    }  /* setColor */
	

    function buildMap(radio) {
        if (map != undefined) map.remove();
        // Creating a map object
        map = new L.map('map', mapOptions);
        // map.fitBounds([   [34.416,19.556],   [42.367,27.905]]);
        // map.dragging.disable();

        // Creating a Layer object
        var layer = new L.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a target="_blank" href="https://www.covidstats.gr/grstats.html#excmort">stelios67</a>, <a target="_blank" href="https://covid19-greece.tk">Sandbird</a>',
            maxZoom: 18
        });

        function loadTooltips(data) {
            var header = data[0];
            $.each(header, function (index, value) {
                if (index != "Nomos")
                    radioHTML += '<label><input type="radio" name="radio_group" value="' + value + '"> ' + value + '</label><br>';
            });

            function assignColor(feature) {
                var name = feature.properties.NAME_GR;
                var pop = csv.find(function (element) {
                    return element.Nomos === name;
                });
                //console.log(pop[radio]);
                return setColor(pop[radio]); 
            } /* assignColor */

            function style(feature) {
                return {
                    fillColor: assignColor(feature),
                    weight: 2,
                    opacity: 1,
                    color: 'white',
                    dashArray: '3',
                    fillOpacity: 0.7
                };
            } /* style */

            function onEachFeature(feature, layer) {
                $.each(csv, function (i, item) {
                    if (item.Nomos == feature.properties.NAME_GR) {
                        var popupContent = '<p>' + feature.properties.NAME_GR + '<br>' + item[radio] + '%</p>';
                        if (feature.properties && feature.properties.popupContent) {
                            popupContent += feature.properties.popupContent;
                        }
                        layer.bindPopup(popupContent, { closeButton: false });
                    }
                });
            }  /* onEachFeature */
			
            /*  load the geo data */
            var mapData = L.geoJson(statesData, { style: style, onEachFeature: onEachFeature });
            // Adding layer to map
            map.addLayer(mapData);
        }  /*  loadTooltips */

        // Adding layer to map
        map.addLayer(layer);
        loadTooltips(csv);
    }  /*  buildMap */

	/* build radios */
	 var header = csv[0];
	var i = 0;
	$.each(header, function (index, value) {
		if (index != "Nomos")
			radioHTML += '<input type="radio" id="v' + i + '" name="radio_group" value="' + value + '"><label for="v' + i + '">' + value + '</label></input>';
		i++;
	});
	$("#radio-group").html(radioHTML);
	$("#radio-group").show();
	$("#panel").show();
	if (!$('#radio_group').is(":checked")) {
		var first = $("input:radio[name=radio_group]:not(:disabled):last");
		first.prop('checked', true);
		buildMap(first.val()); // Default select the first radio button
	}

    $("#radio-group").on("change", function () {
        radio = $(this).find("input:checked").val();
        buildMap(radio);
    });

    // Build Radio buttons based on the data
});