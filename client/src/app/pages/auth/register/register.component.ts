import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/implementations/auth.service';
import { User } from 'src/app/core/models/user.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  public auth: any;
  public token: any;
  public identity: any;

  constructor(

    private _authService : AuthService,
    private _router : Router,

  ) {
    this.auth = new User('', '', '', '', '',  '', 0)
  }

  ngOnInit(): void {
  }

  register(registerForm:any){
    if(registerForm.valid){
      console.log(registerForm.value);

      this._authService.register({
        password: registerForm.value.password,
        name: registerForm.value.name,
        email: registerForm.value.email,
        phone: registerForm.value.phone,
        address: registerForm.value.address,
      }).subscribe(
        response => {
          console.log(response);

          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Usuario registrado correctamente!',
            footer: '<p>Cash Flow System</p>',
            showConfirmButton: false,
            timer: 1500
          })
          this.auth = new User('', '', '', '', '', '', 0);
          this._router.navigate(['login'])
        }
      )
    }else{
      Swal.fire({
        icon: 'error',
        title: 'Algo salió mal!',
        text: 'Rellena todos los campos del formulario!',
        footer: '<p>Cash Flow System</p>',
        showConfirmButton: false,
        timer: 1500
      })
    }
  }
}
