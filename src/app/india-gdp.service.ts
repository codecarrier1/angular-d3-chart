import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class IndiaGdpService {

  constructor(private _http: HttpClient) { }

  getIndGDP(){
    return this._http.get('https://api.tradingeconomics.com/historical/country/india/indicator/gdp?c=guest:guest&format=json')
      .pipe(map(result => result));
  }
}
