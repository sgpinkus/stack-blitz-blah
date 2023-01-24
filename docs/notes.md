# vue-leaflet-basics

# [vue2-leaflet](https://github.com/vue-leaflet/Vue2Leaflet)
Does not work with vue 3.

## Add Search
Recommended search plugin is a PoS. Can do ourselves? Custom UI widgets require "controls". Essentially add this:

        nav = new NavControl()
        nav.addTo(map);

        function NavControl() {
            this.map = null;
            this._div = null;

            this.update = function() {
                this._div.innerHTML = '<input class="navi" id="navi-loc" type="text"/>' +
                '<input type="button" value="search" class="search" id="navi-button" onclick="foo();"/>'
            }

            this.onAdd = function(map) {
                this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
                this.map = map;
                this.update();
                return this._div;
            }
        }
        NavControl.prototype = L.control();

Leaflet API is like:

        map = L.map('map')
        XXX.addTo(map)

Need to define control get access to map object somehow then add control.  Can't see how to accces map object directly! https://vue2-leaflet.netlify.app/quickstart/#accessing-leaflet-api says can use ref to [LMap](https://vue2-leaflet.netlify.app/components/LMap.html) vue object:

      this.$nextTick(() => {
        this.$refs.myMap.mapObject.ANY_LEAFLET_MAP_METHOD();
      });

Bu this does not work and "mapObject" is not documented on LMap component. Grrr.

# APPENDIX #########

# [@vue-leaflet/vue-leaflet](https://github.com/vue-leaflet/vue-leaflet)
Successor of vue2-leaflet works with v3. They have no doc, and no typings.

Q: Isn't immediately clear how plugin maps to leaflet Javascript API. I.e. how do I map follow to the vue components - and how do you expect me to know this?!
A: Components are same (AFAICT so far) as vue2-leaflet. The vue2-leaflet docs seem to correspond entirely.

        map = L.map('map').setView([51.505, -0.09], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
        }).addTo(map);
        var marker = L.marker([51.5, -0.09]).addTo(map);
        var circle = L.circle([51.508, -0.11], {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.5,
            radius: 500
        }).addTo(map);
        var polygon = L.polygon([
            [51.509, -0.08],
            [51.503, -0.06],
            [51.51, -0.047]
        ]).addTo(map);
        marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
        circle.bindPopup("I am a circle.");
        polygon.bindPopup("I am a polygon.");

Is:

        ...