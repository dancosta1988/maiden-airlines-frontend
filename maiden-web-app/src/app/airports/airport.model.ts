export class Airport{
    public id: number;
    public name: string;
    public shortName: string;
    public city: string;
    public country: string;
    public imagePath: string

    constructor (id: number, name: string, shortName:string, city: string, country: string, imagePath: string){
        this.id = id;
        this.name = name;
        this.shortName = shortName;
        this.city = city;
        this.country = country;
        this.imagePath = imagePath;
    }

}