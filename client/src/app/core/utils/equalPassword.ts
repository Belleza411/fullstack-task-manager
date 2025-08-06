import { AbstractControl } from "@angular/forms";

export const equalPassword = (controlName1: string, controlName2: string) => {
  return (formGroup: AbstractControl) => {
    const control1 = formGroup.get(controlName1);
    const control2 = formGroup.get(controlName2);

    if (!control1 || !control2) return null;

    if (control1.value === control2.value) {
      control2.setErrors(null);
      return null;
    }

    control2.setErrors({ valuesNotEqual: true });
    return null;
  };
};
