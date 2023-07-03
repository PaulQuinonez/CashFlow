import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Transaction } from '../models/transaction.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  public url;
  public transacion;
  public token;

  constructor(
    private _http : HttpClient,
    private _authService : AuthService
  ) {
    this.url = environment.url;
    this.token = _authService.getToken();
    this.transacion = new Transaction('',0,'','','', '')
  }

  get_transactions(id : String) : Observable<any>{

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': this.token.toString(),
    });

    return this._http.get(this.url + 'transaction/listtransactions/' + id, {headers : headers})

  }

  get_sumIncomes(id : String) : Observable<any>{

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': this.token.toString()
    });
    return this._http.get(this.url + 'transaction/getSumIncomes/' + id, {headers : headers})

  }
  get_sumExpenses(id : String) : Observable<any>{

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': this.token.toString()
    });
    return this._http.get(this.url + 'transaction/getSumExpenses/' + id, {headers : headers})

  }

  post_transaction(data:any) : Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': this.token.toString()
    });
    return this._http.post(this.url + 'transaction/register' ,data , {headers : headers})
  }

  get_transaction(id:any) : Observable<any>{

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': this.token.toString()
    });
    return this._http.get(this.url + 'transaction/listtransaction/' + id, {headers : headers})

  }

  get_types() : Observable<any>{

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': this.token.toString()
    });

    return this._http.get(this.url + 'type/listType', {headers : headers})

  }

  delete_transaction(id: String):Observable<any>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': this.token.toString()
    });
    return this._http.delete(this.url + 'transaction/deletetransaction/' + id, {headers:headers})
  }
}
