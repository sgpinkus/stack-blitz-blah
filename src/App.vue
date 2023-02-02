<script lang='ts'>
import { defineComponent } from 'vue';
import 'leaflet/dist/leaflet.css';
import { LMap, LTileLayer, LMarker, LPopup, LControl } from '@vue-leaflet/vue-leaflet'; // https://vue2-leaflet.netlify.app/components/

export default defineComponent({
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
    LControl
  },
  data(): Record<any, any> {
    return {
      mapOptions: {
        zoom: 11,
        center: [51.505, -0.09],
      },
      tileLayer: {
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        maxZoom: 19,
        attribution: '© OpenStreetMap',
      },
      latLngs: [],
      disablePopups: true,
    };
  },
  watch: {
    disablePopups(val, oldVal) {
      console.log(`Value of disablePopups changed ${oldVal} => ${val}`);
    }
  },
  methods: {
    mapReady(mapObject: any) {
      console.log('Map ready', mapObject);
    },
    clickMap(e: any) {
      console.log('Click map', e.latlng);
      if(e.latlng) this.latLngs = [...this.latLngs, e.latlng];
    },
    clickMarker(e: any) {
      console.log(`Click marker: disablePopups=${this.disablePopups}`);
    }
  },
  mounted() {
    console.log(`Mounted: disablePopups=${this.disablePopups}`);
  }
});
</script>

<template>
    <v-app>
      <v-main app>
        <v-container>
          <v-row>
            <LMap style="height:100vh" :='mapOptions' @ready='mapReady' @click='clickMap'>
              <LTileLayer :='tileLayer'  />
              <LControl position='topright'>
                <v-switch v-model='disablePopups' color='primary' density='comfortable'></v-switch></LControl>
              <LMarker v-for='(v, k) in latLngs'
                :key='k'
                :lat-lng='v'
                @click='clickMarker'
              >
                <LPopup v-if='!disablePopups'>
                  Value: {{ v }}<br>
                  Disabled: {{ disablePopups }}
                </LPopup>
              </LMarker>
            </LMap>
          </v-row>
        </v-container>
      </v-main>
    </v-app>
</template>