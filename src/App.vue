<script setup lang="ts">
/**
 * Use an invisible LMarker to make a LCircle draggable.
 */
import { computed, onMounted, onUnmounted, ref, useTemplateRef, watch, watchEffect, type Ref } from 'vue';
import L, { latLng } from 'leaflet';
import type { DragEndEvent, LatLngLiteral, LeafletMouseEvent, Map } from 'leaflet';
import {
  LMap,
  LTileLayer,
  LControl,
  LMarker,
  LCircle,
} from 'vue-leaflet-ng';

let map: Map | undefined = undefined;
const mapElement = useTemplateRef('map');
const tileLayer = {
  url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  maxZoom: 20,
  attribution: '© OpenStreetMap',
  name: 'street map',
  updateWhenIdle: true,
  keepBuffer: 3,
};
const mapStyle = {
 flex: 1,
 'flex-grow': 1,
 cursor: 'crosshair'
}
const mapDefaults = {
  zoom: 11,
  center: { lat: -25.3444277, lng: 131.0368822 },
}
const center = ref({ ... mapDefaults.center });
const radius = ref(0);
const toolActive = ref(false);
const markerSize = ref(20);
const cursorLocation: Ref<LatLngLiteral | undefined> = ref(undefined);
const circleMarkerSvg = ({ color = 'yellow', size = 12 }) => `
  <svg style='display: block' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size*2} ${size*2}">
    <circle fill="${color}" cx="${size}" cy="${size}" r="${size}" />
  </svg>
`;

const myIcon = computed(() => L.divIcon({
  html: circleMarkerSvg({}),
  iconSize: [markerSize.value,markerSize.value],
  className: 'invisible',
}));

function mapReady(mapObject: Map) {
  console.log('MapCanvas: map ready');
  map = mapObject;
  L.control.scale().addTo(mapObject);
}

function toolDrag(e: any) {
  if(e.target._latlng && center.value) {
    radius.value = L.latLng(center.value).distanceTo(e.target._latlng);
  }
}

function toolMouseDown(e: LeafletMouseEvent) {
  if(e.latlng) {
    center.value = e.latlng;
  }
}

function toolMouseUp() {
  toolActive.value = false;
}

function mapMouseMove(e: LeafletMouseEvent) {
  cursorLocation.value = e.latlng;
}
</script>

<template>
  <div style='height:100vh; display: flex; flex-direction: column;'>
    <LMap
      ref='map'
      :style='mapStyle'
      :='mapDefaults'
      @ready='mapReady'
      @mousemove='mapMouseMove'
    >
      <LTileLayer :=tileLayer></LTileLayer>
      <LMarker
        :lat-lng='cursorLocation || mapDefaults.center'
        :radius='20'
        :draggable=true
        @drag='toolDrag'
        @mousedown='toolMouseDown'
        @mouseup='toolMouseUp'
        :zIndexOffset=100
        :icon='myIcon'
      >
      </LMarker>
      <LCircle
        :lat-lng='center'
        :radius='radius'
      ></LCircle>
    </LMap>
  </div>
</template>

<style>
.invisible {
  opacity: 0;
  cursor: crosshair;
}
</style>