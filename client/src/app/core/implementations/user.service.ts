import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public url: any;
  public user: any;
  public token: any;
  public identity: any

  constructor(
    private _http: HttpClient,
    private _authService : AuthService
  ) {
    this.url = environment.url
    this.token = _authService.getToken();
  }

  get_user(id:any) : Observable<any>{

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': this.token.toString()
    });
    return this._http.get(this.url + 'user/listUser/' + id, {headers : headers})

  }

  put_user(data:any) : Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': this.token.toString()
    });
    return this._http.put(this.url + 'user/updateUser/' + data._id ,data , {headers : headers})
  }
}
