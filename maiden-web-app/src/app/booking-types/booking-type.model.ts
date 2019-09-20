export class BookingType{
    public id: number;
    public name: string;
    public cancelBooking: string;
    public changeDate: string;
    public checkedBaggage: string;
    public handBaggage: string;
    public cost: number;

    constructor ( id: number,
         name: string,
         cancelBooking: string,
         changeDate: string,
         checkedBaggage: string,
         handBaggage: string,
         cost: number){
        this.id = id;
        this.name = name;
        this.cancelBooking = cancelBooking;
        this.changeDate = changeDate;
        this.checkedBaggage = checkedBaggage;
        this.handBaggage = handBaggage;  
        this.cost = cost;
    }

}