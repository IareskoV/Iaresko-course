import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WorldMapComponent } from './world-map/world-map.component';
import { LocationsComponent } from './locations/locations.component';
import { LocationComponent } from './location/location.component';

@NgModule({
  declarations: [
    AppComponent,
    WorldMapComponent,
    LocationsComponent,
    LocationComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
