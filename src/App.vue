<script lang='ts'>
import { defineComponent, toRaw } from 'vue';
import { LMap, LTileLayer, LMarker, LPopup } from '@vue-leaflet/vue-leaflet';


export default defineComponent({
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
  },
  data(): Record<any, any> {
    return {
      mapOptions: {
        zoom: 11,
        center: [51.505, -0.09],
        useGlobalLeaflet: false
      },
      tileLayer: {
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        maxZoom: 19,
      },
      mapStyle: {
        height: '50vh',
        cursor: 'crosshair'
      },
      latLng: [51.516434, -0.094414],
      counter: 0,
    };
  },
  computed: {
    marker() {
      return this.$refs.marker;
    }
  },
  watch: {
    mapStyle(n, o) {
      console.log('Map style update');
    }
  },
  methods: {
    mapReady() {
      console.log('mapReady');
    },
  },
  mounted() {
    console.log('Mounted');
    setInterval(() => {
      console.log('Update', this.counter);
      this.counter += 1;
      this.mapStyle.cursor = (this.counter % 2) ? 'pointer' : 'crosshair';
      this.latLng[0] += (Math.random() - 0.5);
      this.latLng[1] += (Math.random() - 0.5);
      console.log(toRaw(this.mapStyle), toRaw(this.latLng));
    }, 1000);
  }
});
</script>

<template>
<LMap
  :='mapOptions'
  @ready='mapReady'
  :style="mapStyle"
>
  <LTileLayer :='tileLayer' />
    <LMarker
      :lat-lng="latLng"
    >
      <LPopup>
        {{ latLng }}
      </LPopup>
    </LMarker>
</LMap>
<div :style="mapStyle" class='x'>
  <p>{{ (mapStyle.cursor) }}</p>
  <p>{{ latLng }}</p>
</div>
</template>

<style>
  .x {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
