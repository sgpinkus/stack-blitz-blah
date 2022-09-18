<script lang='ts'>
import { defineComponent, nextTick } from 'vue';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { LMap, LTileLayer, LMarker, LCircle, LPolygon, LPopup, LControl } from '@vue-leaflet/vue-leaflet'; //  https://vue2-leaflet.netlify.app/components/LMap.html#demo


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
      descriptionLimit: 60,
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
        const Description = entry.Description.length > this.descriptionLimit
          ? entry.Description.slice(0, this.descriptionLimit) + '...'
          : entry.Description;

        return Object.assign({}, entry, { Description });
      });
    },
  },
  watch: {
    searchText (val, oldVal) {
      console.debug('searchText', oldVal, '->', val);
      // Items have already been loaded
      if (this.searchResults.length > 0) return;

      // Items have already been requested
      if (this.isLoading) return;

      this.isLoading = true;

      // Lazily load input items
      fetch('https://api.publicapis.org/entries')
        .then(res => res.json())
        .then(res => {
          const { entries } = res;
          this.searchResults = entries.slice(0, 20);
          this.count = 20;
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => (this.isLoading = false));
    },
  },
  methods: {
    mapReady(mapObject: any) {
      console.log('Map ready', mapObject);
    },
    doSearch() {
      console.log('');
    }
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
              v-for="(selectedSearchResultFields, i) in fields"
              :key="i"
            >
              <v-list-item-header>
                <v-list-item-title>{{ field.value }}</v-list-item-title>

                <v-list-item-subtitle>{{ field.key }}</v-list-item-subtitle>
              </v-list-item-header>
            </v-list-item>
          </v-list>
        </div>
      </v-expand-transition>
      <v-divider v-if="selectedSearchResult"></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          :disabled="!selectedSearchResult"
          variant="outlined"
          @click="selectedSearchResult = null"
        >Clear<v-icon end>mdi-close-circle</v-icon>
        </v-btn>
      </v-card-actions>
        </v-card>
      </v-dialog>
      <v-main app>
        <v-container>
          <v-row>
            <LMap style='height:100vh' :='mapOptions.map'>
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
