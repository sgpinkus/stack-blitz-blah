<script lang='ts'>
import { defineComponent, nextTick } from 'vue';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { LMap, LTileLayer, LMarker, LCircle, LPolygon, LPopup, LControl } from '@vue-leaflet/vue-leaflet'; // https://vue2-leaflet.netlify.app/components/
import { Loader } from '@googlemaps/js-api-loader';

const config = {
  GoogleMapsApiKey: 'AIzaSyDyEdeJ21vNiJVK-5M24RXKqRJBVmHDnPw',
};

let Google: any;
let GooglePlacesService: any;


// https://developers.google.com/maps/documentation/places/web-service/search-find-place
async function geocode(query: string) {
  const request = {
    query,
    fields: ['name', 'geometry', 'formatted_address', 'type', 'place_id'],
  };
  let result: any = await new Promise((resolve, reject) => {
    GooglePlacesService.findPlaceFromQuery(request, function(results: any, status: any) {
      if (status === Google.maps.places.PlacesServiceStatus.OK) return resolve(results);
      reject(status);
    });
  });
  result = JSON.parse(JSON.stringify(result));
  console.log(result);
  return result;
}

const loader = new Loader({
  apiKey: config.GoogleMapsApiKey,
  version: 'weekly',
  libraries: ['places']
});

export default defineComponent({
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LCircle,
    LPolygon,
    LPopup,
    LControl
  },
  data(): Record<any, any> {
    return {
      showSearchDialog: false,
      searchText: '',
      searchResults: [],
      selectedSearchResult: null,
      isLoading: false,
      searchTimerId: null,
      descriptionLimit: 60,
      map: null, // Actual map object.
      mapOptions: {
        geojson: {
          type: 'FeatureCollection',
          features: [
          ],
        },
        geojsonOptions: {
          pointToLayer: null
        },
        map: {
          zoom: 11,
          center: [51.505, -0.09],
        },
        tileLayer: {
          url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          maxZoom: 19,
          attribution: '© OpenStreetMap',
        },
      },
    };
  },
  computed: {
    // Sanitize search result (assumed to be an object).
    selectedSearchResultFields () {
      if (!this.selectedSearchResult) return [];
      return Object.keys(this.selectedSearchResult).map(key => {
        return {
          key,
          value: this.selectedSearchResult[key] || 'n/a',
        };
      });
    },
  },
  watch: {
    searchText (val, oldVal) {
      console.debug('searchText', oldVal, '->', val);

      if (!this.searchText.length) return;
      if (this.isLoading) return;

      this.isLoading = true;

      // Cancel last search and queue a new one.
      if(this.searchTimerId) {
        console.log('cancel', this.searchTimerId);
        clearTimeout(this.searchTimerId);
      }
      // this.searchResults = [];

      this.searchTimerId = setTimeout(() => {
        // Lazily load input items
        geocode(this.searchText)
          .then((data: any) => {
            this.searchResults = data.slice(0, 20);
            this.count = this.searchResults.length;
          })
          .catch(err => {
            console.log(err);
          })
          .finally(() => (this.isLoading = false));
      }, 500);
    },
  },
  methods: {
    mapReady(mapObject: any) {
      console.log('Map ready', mapObject);
      this.map = mapObject;
    },
    showOnMap() {
      if(!this.selectedSearchResult) return false;
      console.debug('showOnMap', this.selectedSearchResult);
      const { north, east, south, west } = this.selectedSearchResult.geometry.viewport;
      const location = this.selectedSearchResult.geometry.location;
      this.showSearchDialog = false;
      nextTick(() => {
        const marker = L.marker(location);
        marker.addTo(this.map);
        const popup = L.popup().setContent(`<p>${JSON.stringify(this.selectedSearchResult)}</p>`);
        marker.bindPopup(popup);
        this.map.fitBounds([[north, east], [south, west]]);
      });
    },
    clearSearchResults() {
      this.selectedSearchResult = null;
      this.searchResults = [];
      this.searchText = '';
    }
  },
  async beforeMount() {
    Google = await loader.load();
    const map = new Google.maps.Map(document.createElement('div')); // Google API wrapper wants a map. Here you go friend.
    GooglePlacesService = new Google.maps.places.PlacesService(map);
  }
});
</script>

<template>
    <v-app>
      <v-dialog
        v-model="showSearchDialog"
      >
        <v-card>
          <v-card-text>
            <v-autocomplete
              v-model="selectedSearchResult"
              v-model:search="searchText"
              :items="searchResults"
              :loading="isLoading"
              item-title="formatted_address"
              item-value="place_id"
              label="Places"
              placeholder="Start typing to Search"
              prepend-icon="mdi-database-search"
              return-object
              no-filter
              style="max-height: 50vh;"
            ></v-autocomplete>
          </v-card-text>
          <v-divider></v-divider>
          <v-expand-transition>
            <div v-if="selectedSearchResult">
              <v-list color="red-lighten-3">
                <v-list-item
                  v-for="(field, i) in selectedSearchResultFields"
                  :key="i"
                >
                  <v-list-item>
                    <v-list-item-title>{{ field.value }}</v-list-item-title>
                    <v-list-item-subtitle>{{ field.key }}</v-list-item-subtitle>
                  </v-list-item>
                </v-list-item>
              </v-list>
            </div>
          </v-expand-transition>
          <v-divider v-if="selectedSearchResult"></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              variant="outlined"
              @click="showSearchDialog = false"
            >Back<v-icon end>mdi-arrow-left</v-icon>
            </v-btn>
            <v-btn
              :disabled="!selectedSearchResult"
              variant="outlined"
              @click="clearSearchResults"
            >Clear Search<v-icon end>mdi-close-circle</v-icon>
            </v-btn>
            <v-btn
              :disabled="!selectedSearchResult"
              variant="outlined"
              @click="showOnMap"
            >Show on Map<v-icon end>mdi-map-marker</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-main app>
        <v-container>
          <v-row>
            <LMap style='height:100vh' :='mapOptions.map' @ready='mapReady'>
              <LTileLayer :='mapOptions.tileLayer'  />
              <!-- <LTileLayer :='tileLayer2' /> -->
              <LControl position='topright'><v-btn @click='showSearchDialog = !showSearchDialog' icon='mdi-magnify'></v-btn></LControl>
              <LCircle :lat-lng='[51.508, -0.11]'
                color='blue'
                :radius='500'
                fillColor='blue'
                :fillOpacity='0.2'
                :fill='true'
              ><LPopup><h1>Circle</h1></LPopup></LCircle>
              <LMarker  :lat-lng='[51.508, -0.11]'><LPopup><h1>Hi!</h1><p>You've popped me.</p></LPopup></LMarker>
              <LPolygon :lat-lngs='[[51.509, -0.08], [51.503, -0.06],[51.51, -0.047]]' color='#ff00ff' fillColor='#ff00ff' :fill='true'>
                <LPopup><h1>Polygon</h1><p>You've popped my polygon.</p></LPopup>
              </LPolygon>
            </LMap>
          </v-row>
        </v-container>
      </v-main>
    </v-app>
</template>

<style scoped>
  .overlay-container {
    height: 100vh;
    width: 100%;
  }
</style>
