
export type LatLng = { lat: number, lng: number };

export type ViewPort = {
  northeast: LatLng,
  southwest: LatLng,
};

export interface IGoogleMapsResult {
  address_components: object[],
  formatted_address: string,
  geometry: {
    bounds: Viewport,
    location: LatLng,
    viewport: Viewport,
  }
  place_id: string,
  type: string[],
}