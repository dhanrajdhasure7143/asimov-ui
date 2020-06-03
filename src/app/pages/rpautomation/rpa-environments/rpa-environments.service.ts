import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentsService {

  constructor(private http:HttpClient) { }

  getfulldata<environmentobservable>():Observable<environmentobservable> {
    return this.http.get<environmentobservable>("/agent/get-environments");
  }

  addenvironment(data:any):Observable<any>
  {
    const requestOptions: Object = {
      /* other options here */
      responseType: 'text'
    }
    console.log(data)
    return this.http.post<any>("/rpa-service/agent/save-environment",data, requestOptions);
  }

  deleteenvironment(data:any):Observable<any>
  {
    const requestOptions: Object = {
      responseType: 'text'
    }
    return this.http.post<any>("/rpa-service/agent/delete-environment",data, requestOptions);
  
  }
  updateenvironment(data:any):Observable<any>
  {
    const requestOptions: Object = {
      responseType: 'text'
    }
    console.log(data);
    return this.http.put<any>("/rpa-service/agent/update-environment",data, requestOptions);
  }
}
