import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public url : any;
  public user : any;
  public token : any;
  public identity : any

  constructor(
    private _http : HttpClient
  ) {
    this.url = environment.url
    this.user = new User('', '', '', '', '', '', 0)
  }

  login(user : any, getToken = false) : Observable<any>{

    const json = user;

    if(getToken != false){
      user.gettoken = true;
    }

    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.post(this.url + 'auth/login', json, {headers:headers});

  }

  getToken():Observable<any>{
    const token = localStorage.getItem('token');
    if(token){
      this.token = token;
    }else{
      this.token = null;
    }

    return this.token;
  }

  getIdentity():Observable<any>{

    //OBTENEMOS LA LLAVE IDENTITY EN EL LOCAL STORAGE
    const identity = JSON.parse(localStorage.getItem('identity') || "[]"); //POR SI ACASO ESTE NULO, NO SE VERA AFECTADA LA APP
    if(identity){
      this.identity = identity;
    }else{
      this.identity = null;
    }

    return this.identity;

  }

  register(data:any) : Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    return this._http.post(this.url + 'auth/register' ,data , {headers : headers})
  }

}
