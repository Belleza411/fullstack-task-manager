import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-auth-form',
  imports: [RouterLink],
  templateUrl: './auth-form.component.html',
  styleUrl: './auth-form.component.css'
})
export class AuthFormComponent {
  authType = input.required<'login' | 'sign-up'>()
  title = input.required();
  description = input.required();
  buttonText = input.required();
  link = input.required<string>();
  linkText = input.required();
  linkAText = input.required();
}
