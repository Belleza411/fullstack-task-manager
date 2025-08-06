import { AbstractControl, FormGroup } from "@angular/forms";

export const isFieldError = (
    form: FormGroup,
    fieldName: string, 
    errorType: string,
) => {
    const control: AbstractControl | null = form.get(fieldName);  
    return control?.hasError(errorType) && (control.touched || control.dirty)
}