import { Role } from '../backoffice-roles/role.model';

export class Operator{
    public id: number;
    public name: string;
    public role: Role;
    public userName: string;
    public password: string;

    constructor (id: number, name: string, role : Role, userName: string, password: string){
        this.id = id;
        this.name = name;
        this.role = role;
        this.userName = userName;
        this.password = password;
    }

}