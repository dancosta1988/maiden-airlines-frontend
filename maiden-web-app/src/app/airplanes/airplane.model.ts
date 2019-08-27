export class Airplane{
    public id: number;
    public model: string;
    public cargoHoldCapacity: number;
    public numberSeats: number;

    constructor (id: number, model: string, cargoholdCapacity: number, numberOfSeats: number){
        this.id = id;
        this.model = model;
        this.cargoHoldCapacity = cargoholdCapacity;
        this.numberSeats = numberOfSeats;
    }

}