import { Component, signal, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../auth-service';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from '@openng/ngx-toastr';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './header.css',
})
export class Header {
  private httpClient = inject(HttpClient);
  private toastr = inject(ToastrService);
  private authService = inject(AuthService);

  readonly authState = this.authService.authState;
  readonly url = "http://localhost:3000/logout";

  isDropdownClosed = signal(true);
  isMenuClosed = signal(true);

  toggleDropdown() {
    this.isDropdownClosed.update(open => !open);
  }

  closeDropdown() {
    this.isDropdownClosed.set(true)
  }

  openMenu() {
    this.isMenuClosed.set(false)
  }

  closeMenu() {
    this.isMenuClosed.set(true)
  }

  logout() {
    this.httpClient.post<{ message: string }>(this.url, {}, { withCredentials: true }).subscribe({
      next: (data) => {
        this.toastr.success("", data.message, { timeOut: 1500, positionClass: 'toast-top-center' });
        this.authService.setLoggedIn(false)
      },
      error: (err) => this.toastr.error("", err.error.message)
    })
  }
}
