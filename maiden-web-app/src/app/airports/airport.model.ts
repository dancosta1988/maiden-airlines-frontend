export class Airport{
    public id: number;
    public name: string;
    public shortName: string;
    public city: string;
    public country: string;

    constructor (id: number, name: string, shortName:string, city: string, country: string){
        this.id = id;
        this.name = name;
        this.shortName = shortName;
        this.city = city;
        this.country = country;
    }

}