import { Routes } from '@angular/router';
import { Homepage } from './homepage/homepage';
import { Login } from './login/login';
import { Signup } from './signup/signup';
import { Profile } from './profile/profile';
import { Guessers } from './guessers/guessers';
import { Drawers } from './drawers/drawers';
import { Sketches } from './sketches/sketches';

export const routes: Routes = [
    {
        path: '',
        title: 'Homepage',
        component: Homepage
    },
    {
        path: 'login',
        title: 'Login',
        component: Login
    },
    {
        path: 'signup',
        title: 'Registration',
        component: Signup
    },
    {
        path: 'profile',
        title: 'Profile',
        component: Profile
    },
    {
        path: 'leaderboard/best_guessers',
        title: 'Best guessers',
        component: Guessers
    },
    {
        path: 'leaderboard/best_drawers',
        title: 'Best drawers',
        component: Drawers
    },
    {
        path: 'sketches',
        title: 'Sketches',
        component: Sketches
    }
];
