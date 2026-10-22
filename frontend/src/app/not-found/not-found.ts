import { Component } from '@angular/core';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-not-found',
  imports: [Header, Footer],
  templateUrl: './not-found.html',
  styleUrl: './not-found.css',
})
export class NotFound { }
