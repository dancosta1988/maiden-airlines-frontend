export class Airplane{
    public id: number;
    public model: string;
    public cargoholdCapacity: number;
    public numberOfSeats: number;

    constructor (id: number, model: string, cargoholdCapacity: number, numberOfSeats: number){
        this.id = id;
        this.model = model;
        this.cargoholdCapacity = cargoholdCapacity;
        this.numberOfSeats = numberOfSeats;
    }

}