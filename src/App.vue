<script lang='ts'>
import { defineComponent, nextTick } from 'vue';
import type { IGoogleMapsResult, LatLng } from './types';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { LMap, LTileLayer, LMarker, LCircle, LPolygon, LPopup, LControl } from '@vue-leaflet/vue-leaflet'; //  https://vue2-leaflet.netlify.app/components/LMap.html#demo
import axios from 'axios';

const config = {
  GoogleMapsApiKey: 'AIzaSyDyEdeJ21vNiJVK-5M24RXKqRJBVmHDnPw',
};

async function geocode(address: string) {
  const baseUrl = 'https://maps.googleapis.com/maps/api/geocode/json';
  const query = new URLSearchParams({ address, key: config.GoogleMapsApiKey });
  const queryUrl = `${baseUrl}?${query}`;
  console.log(queryUrl);
  return (await axios.get(queryUrl)).data;
}

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
          zoom: 13,
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
    // Map search result to entrie for display list.
    searchResultItems () {
      return this.searchResults.map((entry: any) => {
        const Description = entry.formatted_address;

        return Object.assign({}, entry, { Description });
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

      this.searchTimerId = setTimeout(() => {
        // Lazily load input items
        geocode(this.searchText)
          .then((data: any) => {
            this.searchResults = data.results.slice(0, 20);
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
      const { northeast, southwest } = this.selectedSearchResult.geometry.viewport;
      const location = this.selectedSearchResult.geometry.location;
      this.showSearchDialog = false;
      nextTick(() => {
        L.marker(location).addTo(this.map);
        this.map.fitBounds([northeast, southwest]);
      });
    },
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
              :items="searchResultItems"
              :loading="isLoading"
              hide-no-data
              hide-selected
              item-title="Description"
              item-value="Place"
              label="Places"
              placeholder="Start typing to Search"
              prepend-icon="mdi-database-search"
              return-object
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
              @click="selectedSearchResult = null"
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
              <LMarker  :lat-lng='[51.505, -0.09]'><LPopup><h1>Hi!</h1><p>You've popped me.</p></LPopup></LMarker>
              <LCircle :lat-lng='[51.508, -0.11]'
                color='blue'
                :radius='500'
                fillColor='blue'
                :fillOpacity='0.2'
                :fill='true'
              ><LPopup><h1>Circle</h1></LPopup></LCircle>
              <LMarker  :lat-lng='[51.508, -0.11]'/>
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
