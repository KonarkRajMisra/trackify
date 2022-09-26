import { Template } from "./Template";
import { FitnessPlan } from "./FitnessPlan";
export interface User{
    name: string,
    email: string,
    picture: string,
    authToken: string,
    templates: Array<Template>,
    fitnessPlans: Array<FitnessPlan>,
    firstTimeUser: boolean
}