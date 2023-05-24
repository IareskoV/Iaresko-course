import { Component, Input, OnInit } from '@angular/core';
import { Loc } from '../types/types';
import { HttpClient } from '@angular/common/http';
import { timeout } from 'rxjs';
@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss'],
})
export class LocationComponent implements OnInit {
  @Input() item: Loc = {
    latitude: 0,
    longitude: 0,
    name: 'loading',
  };
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http
      .post('/api/data', this.item)
      .pipe(timeout(10000)) // Set a timeout of 10 seconds (10000 milliseconds)
      .subscribe(
        (response) => {
          console.log(response);
        },
        (error) => {
          // Handle the error
        }
      );

    // this.http
    //   .post('/api/place', this.item)
    //   .pipe(timeout(10000)) // Set a timeout of 10 seconds (10000 milliseconds)
    //   .subscribe(
    //     (response) => {
    //       console.log(response);
    //     },
    //     (error) => {
    //       // Handle the error
    //     }
    //   );
  }
}
