import { Routes } from '@angular/router';
import { Auth } from './auth/auth';

export const routes: Routes = [
    {
        path: 'authenticate',
        component: Auth,
        title: 'Authenticate'
    }
];
