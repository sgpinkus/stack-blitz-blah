<script lang='ts'>
import { defineComponent } from 'vue';
import { LMap, LTileLayer, LMarker, LPopup, LControl } from '@vue-leaflet/vue-leaflet';

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
      },
      disablePopups: true,
    };
  },
  methods: {
    clickMarker(e: any) {
      console.log(`Click marker: disablePopups=${this.disablePopups}`);
    }
  },
});
</script>

<template>
    <v-app>
      <v-main app>
        <v-container>
          <v-row>
            <LMap style="height:100vh" :='mapOptions'>
              <LTileLayer :='tileLayer'  />
              <LControl position='topright'>
                <v-switch v-model='disablePopups' color='primary' density='comfortable'></v-switch>
              </LControl>
              <LMarker
                :lat-lng="[51.516434, -0.094414]"
                @click='clickMarker'
              >
                <LPopup v-if='!disablePopups'>
                  Disabled: {{ disablePopups }}
                </LPopup>
              </LMarker>
            </LMap>
          </v-row>
        </v-container>
      </v-main>
    </v-app>
</template>