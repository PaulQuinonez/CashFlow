import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/implementations/auth.service';
import { User } from 'src/app/core/models/user.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  public auth: any;
  public token: any;
  public identity: any;

  constructor(

    private _authService : AuthService,
    private _router : Router,

  ) {

    this.auth = new User('', '', '', '', '', '', 0)
    this.identity = this._authService.getIdentity()
  }

  ngOnInit(): void {
  }

  login(loginForm :  any){

    //COMPROBAMOS EL FORMULARIO SEA VÁLIDO
    if(loginForm.valid){

      this._authService.login(this.auth).subscribe(
        response => {

          //ALMACENAMOS EL TOKEN EN EL LOCAL STORAGE DEL NAVEGADOR
          this.token = response.jwt;
          console.log(this.token);

          localStorage.setItem('token', this.token);

          this._authService.login(this.auth, true).subscribe(
            response => {
              this.identity = response.user;
              localStorage.setItem('identity', JSON.stringify(this.identity));
              //LO RETORNAMOS A UNA NUEVA VISTA
              this._router.navigate(['dashboard'])
            },
            error => {
              this._router.navigate([''])
            }
          )

        },
        error => {

          Swal.fire({
            icon: 'error',
            title: 'Algo salió mal!',
            text: 'El correo o contraseña son incorrectos',
            footer: '<p>Cash Flow System</p>'
          })

        }
      )

    }else{

      Swal.fire({
        icon: 'error',
        title: 'Algo salió mal!',
        text: 'Rellena todos los campos',
        footer: '<p>Cash Flow System</p>'
      })

    }

  }

}
