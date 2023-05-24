import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet.markercluster'; // Optional: For marker clustering
import * as mapboxgl from 'mapbox-gl';
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { Loc } from '../types/types';

@Component({
  selector: 'app-world-map',
  templateUrl: './world-map.component.html',
  styleUrls: ['./world-map.component.scss'],
})
export class WorldMapComponent implements OnInit {
  private map!: L.Map;
  private marker!: L.Marker;
  private geocoder!: MapboxGeocoder;
  constructor() {}
  locations: Loc[] = [];
  ngOnInit(): void {
    this.geocoder = new MapboxGeocoder({
      accessToken:
        'pk.eyJ1IjoiaWFyZXNrbyIsImEiOiJjbGh6d3BiZG4wMjJvM2hwaGxiZDg2aXd5In0.xxI-mWpS63VxqKnGd6RkFw',
      mapboxgl: mapboxgl,
    });

    const markers = L.markerClusterGroup();
    this.map = L.map('map').setView([0, 0], 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }).addTo(this.map);

    this.map.on('click', (event: L.LeafletMouseEvent) => {
      // ...

      this.marker = L.marker([event.latlng.lat, event.latlng.lng]);
      markers.addLayer(this.marker); // Add marker to cluster group
      this.locations.push({
        latitude: event.latlng.lat,
        longitude: event.latlng.lng,
        name: 'test',
      });
      console.log(
        'clicked :',
        event.latlng.lat,
        event.latlng.lng,
        event.target
      );
      // ...
    });

    this.map.addLayer(markers);
  }

  handleMapClick(event: L.LeafletMouseEvent): void {
    const { lat, lng } = event.latlng;

    // Remove previous marker, if any
    if (this.marker) {
      this.map.removeLayer(this.marker);
    }

    // Create a new marker at the clicked location
    this.marker = L.marker([lat, lng]).addTo(this.map);

    // Use lat and lng as needed
    console.log(`Clicked coordinates: (${lat}, ${lng})`);
  }
}
