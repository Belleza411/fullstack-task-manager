import { Component, DestroyRef, inject } from '@angular/core';
import { AuthFormComponent } from "../../shared/auth-form/auth-form.component";
import { FormGroup, FormControl, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { equalPassword } from '../../core/utils/equalPassword';
import { isFieldError } from '../../core/error/isFieldError';
import { ErrorMessageComponent } from '../../shared/error-message/error-message.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  imports: [AuthFormComponent, ReactiveFormsModule, ErrorMessageComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  
  form = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(5)]),
    confirmPassword: new FormControl('', [Validators.required, Validators.minLength(5)])
  }, {
    validators: [equalPassword('password', 'confirmPassword')]
  })

  hasError(fieldName: string, errorType: string) {
    return isFieldError(this.form, fieldName, errorType)
  }

  get isPasswordsEqual() {
    return this.form.get('confirmPassword')?.hasError('valuesNotEqual') && this.form.get('confirmPassword')?.touched; 
  }

  onSubmit() {
    const username = this.form.value.username!;
    const password = this.form.value.password!;
    const confirmPassword = this.form.value.confirmPassword!;

    const subscription = this.authService.register({ username, password, confirmPassword }).subscribe({
      next: () => {
        this.router.navigate(['/auth/login']),
        this.toastr.success('You are successfully registered')
      },
      error: err => console.log('Registration Failed: ' + err)
    });

    this.destroyRef.onDestroy(() => subscription.unsubscribe())
  }
}
