export class Transaction{

  constructor(

    public _id: string,
    public amount: number,
    public description: string,
    public date: string,
    public user: string,
    public type_id: string
  ){}

}
