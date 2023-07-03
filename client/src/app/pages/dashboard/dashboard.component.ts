import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/implementations/auth.service';
import { TransactionService } from 'src/app/core/implementations/transaction.service';
import { UserService } from 'src/app/core/implementations/user.service';
import { Transaction } from 'src/app/core/models/transaction.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  isMenuOpen: boolean = false;
  public transactions: any;
  public user: any;
  public id: any;
  public p: any
  public identity: any;
  public token: any;
  public ingresos: any;
  public egresos: any;
  public transaction: Transaction | undefined;
  public types: any;
  public balance: any;

  constructor(
    private _transactionService: TransactionService,
    private _userService: UserService,
    private _router: Router,
    private _authService: AuthService
  ) {
    this.transaction = new Transaction('', 0, '', '', '', '')
    this.identity = this._authService.getIdentity()
    this.token = this._authService.getToken()
  }

  ngOnInit(): void {

    if(this.identity._id){
      this.id = this.identity._id

      this.getUser();
      this.getTransactions();
      this.obtenerSumIncomes()
      this.obtenerSumExpenses();
      this.getTypes()
    } else {
      this._router.navigate(['/login'])
    }

  }

  getTypes() {
    this._transactionService.get_types().subscribe(
      response => {
        this.types = response.data
      }
    )
  }


  //OBTENER DATOS DEL USUARIO
  getUser() {
    this._userService.get_user(this.id).subscribe(
      response => {
        this.user = response.user
        this.balance = Number(response.user.balance).toFixed(2);

      }
    )
  }

  //OBTENER TODAS LAS TRANSACCIONES
  getTransactions() {
    this._transactionService.get_transactions(this.id).subscribe(
      response => {
        this.transactions = response.data
      }
    )
  }

  // OBTENER SUMA TOTAL DE INGRESOS
  obtenerSumIncomes() {
    this._transactionService.get_sumIncomes(this.id).subscribe(
      response => {
        this.ingresos = Number(response.totalIncomes).toFixed(2)
      }
    )
  }

  //OBTENER SUMA TOTAL DE EGRESOS
  obtenerSumExpenses() {
    this._transactionService.get_sumExpenses(this.id).subscribe(
      response => {
        this.egresos = Number(response.totalExpenses).toFixed(2)
      }
    )
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  // ELIMINAR TRANSACCION
  eliminar(id: any) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success mx-3',
        cancelButton: 'btn btn-danger mx-3'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: '¿Seguro quieres eliminar la transaccion?',
      text: "No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        swalWithBootstrapButtons.fire(
          'Eliminado!',
          'La transaccion fue eliminada correctamente.',
          'success'
        )

        this._transactionService.delete_transaction(id).subscribe(

          response => {
            this._transactionService.get_transactions(this.id).subscribe(
              response => {
                this.transactions = response.data;

                this.getTransactions();
                this.getUser();
                this.obtenerSumIncomes()
                this.obtenerSumExpenses();
              },
              error => {

              }
            )
          },
          error => {

          }
        )
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelado',
          'Se canceló la petición',
          'error'
        )
      }
    })
  }

  registrar_ingreso(ingresoForm: any) {
    if (ingresoForm.valid) {

      this._transactionService.post_transaction({
        amount: Number(ingresoForm.value.amount),
        description: ingresoForm.value.description,
        date: ingresoForm.value.date,
        type_id: ingresoForm.value.type_id,
      }).subscribe(
        response => {

          if (response.success == true) {
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Transaccion Registrada correctamente!',
              footer: '<p>Cash Flow System</p>',
              showConfirmButton: false,
              timer: 1500
            })
            this.transaction = new Transaction('', 0, '', '', '', '') //PARA QUE SE PONGAN EN BLANCO LOS CAMPOS
            this.getTransactions();
            this.getUser();
            this.obtenerSumIncomes()
            this.obtenerSumExpenses();
          }
        },
        error => {


          Swal.fire({
            position: 'center',
            icon: 'error',
            title: error.error.error,
            footer: '<p>Cash Flow System</p>',
            showConfirmButton: false,
            timer: 1500
          })
        }
      )

    } else {
      Swal.fire({
        icon: 'error',
        title: 'Algo salió mal!',
        text: 'Rellena todos los campos del formulario!',
        footer: '<p>Cash Flow System</p>'
      })
    }
  }

  logout() {
    //PARA CERRAR SESION SIMPLEMENTE SE DESTRUYE O REMUEVE LA LLAVES IDENTITY Y TOKEN
    localStorage.removeItem('identity');
    localStorage.removeItem('token');

    //PONEMOS VACIAS LAS LLAVES
    this.identity = null;
    this.token = null;

    //REDIRECCIONAMOS AL LOGIN
    this._router.navigate([''])
  }

}
