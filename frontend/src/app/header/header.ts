import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})

export class Header {
  isMenuOpen = signal(0);

  toggleHamburger() {
    if (this.isMenuOpen()) {
      this.isMenuOpen.set(1);
      console.log("i opened the hamburger");
    } else {
      this.isMenuOpen.set(0);
      console.log("i closed the hamburger");
    }
  };
}
