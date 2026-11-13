import { Routes } from '@angular/router';
import { Auth } from './auth/auth';
import { Profile } from './profile/profile';
import { SketchCreate } from './sketch-create/sketch-create';
import { SketchMain } from './sketch-main/sketch-main';
import { SketchView } from './sketch-view/sketch-view';
import { Homepage } from './homepage/homepage';
import { NotFound } from './not-found/not-found';
import { Leaderboards } from './leaderboards/leaderboards';

export const routes: Routes = [
    {
        path: "",
        component: Homepage,
        title: "Homepage"
    },
    {
        path: "auth",
        component: Auth,
        title: "Authentication"
    },
    {
        path: "profile",
        component: Profile,
        title: "Profile"
    },
    {
        path: "leaderboards",
        component: Leaderboards,
        title: "Leaderboards"
    },
    {
        path: "sketches",
        component: SketchMain,
        title: "Sketches"
    },
    {
        path: "sketches/new",
        component: SketchCreate,
        title: "Create a sketch!"
    },
    {
        path: "sketches/:id",
        component: SketchView,
        title: "Sketches"
    },
    {
        path: "**",
        component: NotFound,
        title: "Page not found"
    }
];
