import { Component } from '@angular/core';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-homepage',
  imports: [Header, Footer],
  templateUrl: './homepage.html',
  styleUrl: './homepage.css',
})
export class Homepage { }
