import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RestApiService {
  xmlheaderOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'text/xml',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Request-Method',
    }),
    responseType: 'text'
  }
  constructor(private http:HttpClient) { }

  getBPMNFileContent(filePath){
    // return this.http.post(filePath, this.xmlheaderOptions);
    return this.http.get(filePath, {headers: {observe: 'response'}, responseType: 'text'});
  }

  sendUploadedFile(file){
    return this.http.get('assets/resources/sample.json');
    // return this.http.post('/api/call/for/file/upload',file);
  }
}
