import type {MapStyleElement} from 'react-native-maps';

/**
 * Google Maps style (Android only — Apple Maps can't be restyled).
 * Soft lavender land, white roads, POIs and transit hidden so the price
 * markers are the loudest thing on the map.
 */
export const MAP_STYLE: MapStyleElement[] = [
  {elementType: 'geometry', stylers: [{color: '#F3F0FA'}]},
  {elementType: 'labels.icon', stylers: [{visibility: 'off'}]},
  {elementType: 'labels.text.fill', stylers: [{color: '#6B6788'}]},
  {elementType: 'labels.text.stroke', stylers: [{color: '#FFFFFF'}]},
  {featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{color: '#D6D0EE'}]},
  {featureType: 'landscape.natural', elementType: 'geometry', stylers: [{color: '#EEEAF8'}]},
  {featureType: 'poi', stylers: [{visibility: 'off'}]},
  {featureType: 'road', elementType: 'geometry', stylers: [{color: '#FFFFFF'}]},
  {featureType: 'road.highway', elementType: 'geometry', stylers: [{color: '#E4DDFB'}]},
  {featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{color: '#D3C9F7'}]},
  {featureType: 'transit', stylers: [{visibility: 'off'}]},
  {featureType: 'water', elementType: 'geometry', stylers: [{color: '#D9D3F5'}]},
  {featureType: 'water', elementType: 'labels.text.fill', stylers: [{color: '#8B87A8'}]},
];
