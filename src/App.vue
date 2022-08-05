<script lang="ts">
import { defineComponent } from 'vue';
import 'leaflet/dist/leaflet.css';
import { LMap, LGeoJson } from '@vue-leaflet/vue-leaflet';

export default defineComponent({
  components: {
    LMap,
    LGeoJson,
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
      mapIsReady: false
    };
  },
  async beforeMount() {
    // HERE is where to load Leaflet components!
    const { circleMarker } = await import('leaflet/dist/leaflet-src.esm');

    // And now the Leaflet circleMarker function can be used by the options:
    this.geojsonOptions.pointToLayer = (feature: any, latLng: any) =>
      circleMarker(latLng, { radius: 8 });
    this.mapIsReady = true;
  },
});
</script>

<template>
  <main>
  <LMap style="height:50vh">
    <LGeoJson :geojson="geojson" :options="geojsonOptions" />
  </LMap>
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
