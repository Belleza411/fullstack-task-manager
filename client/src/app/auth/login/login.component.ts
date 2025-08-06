import { Component, DestroyRef, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthFormComponent } from "../../shared/auth-form/auth-form.component";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { isFieldError } from '../../core/error/isFieldError';
import { ErrorMessageComponent } from '../../shared/error-message/error-message.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  imports: [AuthFormComponent, ReactiveFormsModule, ErrorMessageComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private authService = inject(AuthService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  form = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)])
  })

  hasError(fieldName: string, errorType: string) {
    return isFieldError(this.form, fieldName, errorType)
  }

  onSubmit() {
    const username = this.form.value.username!;
    const password = this.form.value.password!;

    console.log(username);
    console.log(password);
    
    const subscription = this.authService.login({ username, password }).subscribe({
      next: () => {
        this.router.navigate(['tasks']),
        this.toastr.success('You are logged in successfully')
      },
      error: (err) => console.log('Login error: ' + err)
    });

    this.destroyRef.onDestroy(() => subscription.unsubscribe())
  }
}
