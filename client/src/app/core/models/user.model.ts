export class User{

  constructor(

    public _id: string,
    public name: string,
    public email: string,
    public password: string,
    public address: string,
    public phone: string,
    public balance: number
  ){}

}
