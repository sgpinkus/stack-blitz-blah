# vue-leaflet-basics
# [vue2-leaflet](https://github.com/vue-leaflet/Vue2Leaflet)
Does not seem to work with vue 3. Maybe can use the docs though? Ok docs seems to correspond. No mention on confusing import() crap either. Now, how would .bindPopup() and other imperatives map to the declarative interface? A: Mostly declaratively ... see LPopup. OK, this'll do!

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

Leaflet API is like

        map = L.map('map')
        XXX.addTo(map)

Need to define control get access to map object somehow then add control.  Can't see how to accces map object directly! https://vue2-leaflet.netlify.app/quickstart/#accessing-leaflet-api says can use ref to [LMap](https://vue2-leaflet.netlify.app/components/LMap.html) vue object:

      this.$nextTick(() => {
        this.$refs.myMap.mapObject.ANY_LEAFLET_MAP_METHOD();
      });

Bu this does not work and "mapObject" is not documented on LMap component. Grrr.

# APPENDIX #########

# [@vue-leaflet/vue-leaflet](https://github.com/vue-leaflet/vue-leaflet)
Trying to learn how to use @vue-leaflet/vue-leaflet. It's confusing. they have no doc, and no typings. I think they assume I know Vue2 version or Leaflet. Even given leaflet knowledge isn't immediately clear how plugin maps to leaflet Javascript API. I.e. how do I mape this to the vue components - and how do you expect me to know this?!:

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

README.md start off with some confusing BS:

        <template>
        <l-map style="height:50vh">
            <l-geo-json :geojson="geojson" :options="geojsonOptions" />
        </l-map>
        </template>
        <script>
        // DON'T load Leaflet components here! Its CSS is needed though, if not imported elsewhere in your application.
        import "leaflet/dist/leaflet.css"
        import { LMap, LGeoJson } from "@vue-leaflet/vue-leaflet";

        export default {
        components: {
            LMap,
            LGeoJson,
        },
        data() {
            return {
            geojson: {
                type: "FeatureCollection",
                features: [
                // ...
                ],
            },
            geojsonOptions: {
                // Options that don't rely on Leaflet methods.
            },
            };
        },
        async beforeMount() {
            // HERE is where to load Leaflet components!
            const { circleMarker } = await import("leaflet/dist/leaflet-src.esm");
            // And now the Leaflet circleMarker function can be used by the options:
            this.geojsonOptions.pointToLayer = (feature, latLng) =>
            circleMarker(latLng, { radius: 8 });
            this.mapIsReady = true;
        },
        };
        </script>

WTF is LMap is not a component? You literally rendering it in the example template! Why is a circleMarker anyway? You have a LCircleMarker component?! And why are you loading from leaflet not fucking vue-leaflet. W-T-F. If goal is  cram the most confusing possible starting example into a README.md, you win.

Ex Not clear how map.setView([51.505, -0.09], 13); would map to component. And other shit.

Summary: Might be easier to not use this BS ...
