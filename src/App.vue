<script lang='ts'>
import { defineComponent } from 'vue';
import 'leaflet/dist/leaflet.css';
import { LMap, LTileLayer, LMarker, LCircle, LPolygon, LPopup } from '@vue-leaflet/vue-leaflet';

export default defineComponent({
  components: {
    LMap, // https://vue2-leaflet.netlify.app/components/LMap.html#demo
    LTileLayer,
    LMarker,
    LCircle,
    LPolygon,
    LPopup,
  },
  data(): Record<any, any> {
    return {
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
      mapIsReady: false
    };
  }
});
</script>

<template>
  <LMap style='height:100vh' :='map'>
    <LTileLayer :='tileLayer'  />
    <LMarker  :lat-lng='[51.505, -0.09]'><LPopup><h1>Hi!</h1><p>You've popped me.</p></LPopup></LMarker>
    <LCircle :lat-lng='[51.508, -0.11]'
      color='blue'
      :radius='500'
      fillColor='blue'
      :fillOpacity='0.2'
      fill='true'
    ><LPopup><h1>Circle</h1></LPopup></LCircle>
    <LMarker  :lat-lng='[51.508, -0.11]'/>
    <LPolygon :lat-lngs='[[51.509, -0.08], [51.503, -0.06],[51.51, -0.047]]' color='#ff00ff' fillColor='#ff00ff' fill='true'>
      <LPopup><h1>Polygon</h1><p>You've popped my polygon.</p></LPopup>
    </LPolygon>
  </LMap>
</template>

<style scoped>

</style>
