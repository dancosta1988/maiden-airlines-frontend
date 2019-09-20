import { ClientType } from '../client-types/client-type.model';

export class Client{
    public id: number;
    public firstName: string;
    public lastName: string;
    public dateOfBirth: string;
    public idNumber: string;
    public address: string;
    public contactNumber: number;
    public gender: string;
    public miles: number;
    public photoPath: string;
    public type: ClientType;
    public email: string;
    public password: string;

    constructor (  id: number,
         firstName: string,
         lastName: string,
         dateOfBirth: string,
         idNumber: string,
         address: string,
         contactNumber: number,
         gender: string,
         miles: number,
         photoPath: string,
         type: ClientType,
         email: string,
         password: string){
        
            this.id = id;
            this.firstName = firstName;
            this.lastName = lastName;
            this.dateOfBirth = dateOfBirth;
            this.idNumber = idNumber;
            this.address = address;
            this.contactNumber = contactNumber;
            this.gender = gender;
            this.miles = miles;
            this.photoPath = photoPath;
            this.type = type;
            this.email = email,
            this.password = password;
         
    }

}