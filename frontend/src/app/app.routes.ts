import { Routes } from '@angular/router';
import { Auth } from './auth/auth';
import { Profile } from './profile/profile';
import { LbGuessers } from './lb-guessers/lb-guessers';
import { LbDrawers } from './lb-drawers/lb-drawers';
import { SketchCreate } from './sketch-create/sketch-create';
import { SketchMain } from './sketch-main/sketch-main';
import { SketchView } from './sketch-view/sketch-view';
import { Homepage } from './homepage/homepage';
import { NotFound } from './not-found/not-found';

export const routes: Routes = [
    {
        path: "",
        component: Homepage
    },
    {
        path: "auth",
        component: Auth
    },
    {
        path: "profile",
        component: Profile
    },
    {
        path: "leaderboard/best-guessers",
        component: LbGuessers
    },
    {
        path: "leaderboard/best-drawers",
        component: LbDrawers
    },
    {
        path: "sketches",
        component: SketchMain
    },
    {
        path: "sketches/new",
        component: SketchCreate
    },
    {
        path: "sketches/:id",
        component: SketchView
    },
    {
        path: "**",
        component: NotFound
    }
];
