export class ClientType{
    public id: number;
    public name: string;
    public annualFee: number;
    public monthlyMiles: number;
    public welcomeBonus: number;
    public bonusMiles:number;

    constructor (id: number, name: string, annualFee: number, monthlyMiles: number, welcomeBonus: number, bonusMiles: number){
        this.id = id;
        this.name = name;
        this.annualFee = annualFee;
        this.monthlyMiles = monthlyMiles;
        this.welcomeBonus = welcomeBonus;
        this.bonusMiles = bonusMiles;
    }

}