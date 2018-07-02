// ==UserScript==
// @id iitc-plugin-move-links@Korvinl
// @name IITC Plugin: Move Links
// @category Layer
// @version 0.0.2.20180702
// @namespace https://github.com/jonatkins/ingress-intel-total-conversion
// @updateURL https://github.com/Korvinl/IITC-Ingress-Move-Links/raw/master/movelinks.user.js
// @downloadURL https://github.com/Korvinl/IITC-Ingress-Move-Links/raw/master/movelinks.user.js
// @description Allows to move links between portals
// @include        https://*.ingress.com/intel*
// @include        http://*.ingress.com/intel*
// @match          https://*.ingress.com/intel*
// @match          http://*.ingress.com/intel*
// @include        https://*.ingress.com/mission/*
// @include        http://*.ingress.com/mission/*
// @match          https://*.ingress.com/mission/*
// @match          http://*.ingress.com/mission/*
// @grant none
// ==/UserScript==
// Wrapper function that will be stringified and injected
// into the document. Because of this, normal closure rules
// do not apply here.

function wrapper(plugin_info) {
// Make sure that window.plugin exists. IITC defines it as a no-op function,
// and other plugins assume the same.
if(typeof window.plugin !== 'function') window.plugin = function() {};
// Name of the IITC build for first-party plugins
plugin_info.buildName = 'iitc';
// Datetime-derived version of the plugin
plugin_info.dateTimeVersion = '20180627.120000';
// ID/name of the plugin
plugin_info.pluginId = 'move-links';

// PLUGIN START ////////////////////////////////////////////////////////



window.plugin.moveLinks = function() {};

// The entry point for this plugin.
window.plugin.moveLinks.setBox = function() {


    var html = '<div class="movelinksSetbox">'
           + '<p>Click on portal and press button "From" or "To"</p>'
           + '<a id="mlFrom" onclick="window.plugin.moveLinks.movelinksFromTo(1);" tabindex="0">From</a>'
           + '<a id="mlTo" onclick="window.plugin.moveLinks.movelinksFromTo(2);" tabindex="0">To</a>'
           + '<a id="mlMove" onclick="window.plugin.moveLinks.movelinksMove();" tabindex="0">Move</a>'
           + '</div>';
    dialog({
        html: html,
        id: 'plugin-movelinks-options',
        dialogClass: 'ui-dialog-movelinkSet',
        title: 'Move Links'
        });
}

var mlfromPortal=0;
var mltoPortal=0;

window.plugin.moveLinks.movelinksFromTo = function(type) {
   var portal = window.portals[selectedPortal];
   var data = portal.options.data;
   var details = portalDetail.get(selectedPortal);
   var title = (details && details.title) || (data && data.title) || 'null';
    if (type==1) {
        $('#mlFrom').text(title);
        mlfromPortal=selectedPortal;
    } else {
        $('#mlTo').text(title);
        mltoPortal=selectedPortal;
    }
}


window.plugin.moveLinks.movelinksMove = function() {
    var portal = window.portals[mlfromPortal];
    var data = portal.options.data;
    //var details = portalDetail.get(mlfromPortal);
    //var title = (details && details.title) || (data && data.title) || 'null';
    //alert(title);
    var oldlat = data.latE6/1E6;
    var oldlng = data.lngE6/1E6;
    portal = undefined;
    data = undefined;
    portal = window.portals[mltoPortal];
    data = portal.options.data;
    var newlat = data.latE6/1E6;
    var newlng = data.lngE6/1E6;
    var changedCount = 0;
    window.plugin.drawTools.drawnItems.eachLayer(function(layer) {
        if (layer.getLatLngs) {
            var lls = layer.getLatLngs();
            var layerChanged = false;
            for (var i=0; i<lls.length; i++) {
                if ((lls[i].lat==oldlat) && (lls[i].lng==oldlng)) {
                    changedCount++;
                    lls[i] = new L.LatLng(newlat,newlng);
                    layerChanged = true;
                }
            }
            if (layerChanged) {
                layer.setLatLngs(lls);
            }
        }
    });
    if(changedCount > 0) {
        runHooks('pluginDrawTools',{event:'layersSnappedToPortals'}); //or should we send 'layersEdited'? as that's effectively what's happened...
    }
alert('Moved '+changedCount+' links');
    window.plugin.drawTools.save();
    //renderPortalDetails (mltoPortal);
    //alert(localStorage['plugin-draw-tools-layer']);
}



var setup = function () {

    //add button
    $('<style>').prop('type', 'text/css').html('.leaflet-control-move-links a\n{\n	background-image: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyMi4xLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0i0KHQu9C+0LlfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiDQoJIHZpZXdCb3g9IjAgMCAzMCAzMCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMzAgMzA7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+DQoJLnN0MHtmaWxsOiMwMDczQkM7fQ0KCS5zdDF7ZmlsbDpub25lO3N0cm9rZTojMDA2Q0I2O3N0cm9rZS13aWR0aDowLjU7c3Ryb2tlLW1pdGVybGltaXQ6MTA7fQ0KCS5zdDJ7ZmlsbDojMDA2Q0I2O3N0cm9rZTojMDA2Q0I2O3N0cm9rZS13aWR0aDowLjU7c3Ryb2tlLW1pdGVybGltaXQ6MTA7fQ0KCS5zdDN7ZmlsbDojMDA2Q0I2O30NCgkuc3Q0e3N0cm9rZTojMDAwMDAwO3N0cm9rZS13aWR0aDoyO3N0cm9rZS1taXRlcmxpbWl0OjEwO30NCjwvc3R5bGU+DQo8Y2lyY2xlIGNsYXNzPSJzdDAiIGN4PSI2LjQiIGN5PSIyNC40IiByPSIzIi8+DQo8bGluZSBjbGFzcz0ic3QxIiB4MT0iMC45IiB5MT0iNS4xIiB4Mj0iNi40IiB5Mj0iMjQuNyIvPg0KPGxpbmUgY2xhc3M9InN0MSIgeDE9IjQuOSIgeTE9IjIuOCIgeDI9IjYuNCIgeTI9IjI0LjQiLz4NCjxsaW5lIGNsYXNzPSJzdDIiIHgxPSI4LjQiIHkxPSIyLjEiIHgyPSI2LjQiIHkyPSIyNC43Ii8+DQo8Y2lyY2xlIGNsYXNzPSJzdDMiIGN4PSIyNC43IiBjeT0iMTMuMSIgcj0iMyIvPg0KPGc+DQoJPHBvbHlnb24gcG9pbnRzPSIxNywxNS4yIDIyLDE0LjkgMjAsMTkuMyAJIi8+DQoJPGxpbmUgY2xhc3M9InN0NCIgeDE9IjE4LjYiIHkxPSIxNy4yIiB4Mj0iMTAuMSIgeTI9IjIyLjgiLz4NCjwvZz4NCjwvc3ZnPg0K");\n}\n.leaflet-control-move-links a.active\n{\n	background-color: #BBB;\n}\n').appendTo('head');
    var parent = $(".leaflet-top.leaflet-left", window.map.getContainer());

	var button = document.createElement("a");
	button.className = "leaflet-bar-part";
	button.addEventListener("click", window.plugin.moveLinks.setBox, false);
	button.title = 'Move links';

	/*var tooltip = document.createElement("div");
	tooltip.className = "leaflet-control-move-links-tooltip";
	button.appendChild(tooltip);*/

	var container = document.createElement("div");
	container.className = "leaflet-control-move-links leaflet-bar leaflet-control";
	container.appendChild(button);
	parent.append(container);

    //add options menu
   /* $('#toolbox').append('<a onclick="window.plugin.moveLinks.setBox();return false;" accesskey="m" title="[m]Allows to move links between portals">Move Links</a>');*/

    $('head').append('<style>' +
        '.movelinksSetbox > a { display:block; color:#ffce00; border:1px solid #ffce00; padding:3px 0; margin:10px auto; width:80%; text-align:center; background:rgba(8,48,78,.9); }'+
        '</style>');

    if (window.plugin.drawTools === undefined) {
       alert("'Move-Links' requires 'draw-tools'");
       return;
    }
    //debugger;
    window.pluginCreateHook('pluginDrawTools');

}


// Add an info property for IITC's plugin system
setup.info = plugin_info;
// Make sure window.bootPlugins exists and is an array
if (!window.bootPlugins) window.bootPlugins = [];
// Add our startup hook
window.bootPlugins.push(setup);
// If IITC has already booted, immediately run the 'setup' function
if (window.iitcLoaded && typeof setup === 'function') setup();
}
// Create a script element to hold our content script
var script = document.createElement('script');
var info = {};
// GM_info is defined by the assorted monkey-themed browser extensions
// and holds information parsed from the script header.
if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) {
info.script = {
version: GM_info.script.version,
name: GM_info.script.name,
description: GM_info.script.description
};
}
// Create a text node and our IIFE inside of it
var textContent = document.createTextNode('('+ wrapper +')('+ JSON.stringify(info) +')');
// Add some content to the script element
script.appendChild(textContent);
// Finally, inject it... wherever.
(document.body || document.head || document.documentElement).appendChild(script);
