export class BookingType{
    public id: number;
    public name: string;
    public cancelBooking: boolean;
    public changeDate: boolean;
    public checkedBaggage: boolean;
    public handBaggage: boolean;
    public cost: number;

    constructor ( id: number,
         name: string,
         cancelBooking: boolean,
         changeDate: boolean,
         checkedBaggage: boolean,
         handBaggage: boolean,
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