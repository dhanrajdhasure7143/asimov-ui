import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CopilotService {
  public http: any;
  constructor(private httpBackend: HttpBackend) {
    this.http = new HttpClient(this.httpBackend);
  }

  getCopilotFunctionsList(){
    return this.http.get(environment.asquare+"/a-square/v1/functions");
  }

}
