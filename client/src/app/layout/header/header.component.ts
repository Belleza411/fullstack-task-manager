import { Component, inject } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  private authService = inject(AuthService);
  private toastr = inject(ToastrService);

  onLogout() {
    this.authService.logout();
    this.toastr.success('Logged out successfully')
  }
}
