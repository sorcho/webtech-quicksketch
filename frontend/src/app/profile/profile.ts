import { Component } from '@angular/core';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-profile',
  imports: [Header, Footer],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile { }
