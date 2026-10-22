import { Component } from '@angular/core';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-auth',
  imports: [Header, Footer],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
})
export class Auth { }
