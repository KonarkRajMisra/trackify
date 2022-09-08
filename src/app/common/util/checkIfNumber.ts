import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function checkIfNumber(): ValidatorFn {
    return (control: AbstractControl) : ValidationErrors | null => {
        const val = control.value;

        if (!val) {
            return null;
        }

        return isNaN(Number(val)) ? {notANumber: true} : null;
    }
}