import { Template } from "./Template";

export interface User{
    name: string,
    email: string,
    picture: string,
    authToken: string,
    templates: Array<Template>,
    firstTimeUser: boolean
}