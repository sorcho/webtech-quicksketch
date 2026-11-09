import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { inject, PLATFORM_ID, Service, signal } from '@angular/core';

@Service()
export class AuthService {
    readonly url = "http://localhost:3000/me"
    private readonly _isLoggedIn = signal(false);
    readonly isLoggedIn = this._isLoggedIn.asReadonly();

    private httpClient = inject(HttpClient);
    private platformId = inject(PLATFORM_ID);

    setLoggedIn(value: boolean) {
        this._isLoggedIn.set(value);
    }

    checkSession() {
        if (!isPlatformBrowser(this.platformId)) return;
        this.httpClient.get(this.url, { withCredentials: true }).subscribe({
            next: () => this._isLoggedIn.set(true),
            error: () => this._isLoggedIn.set(false),
        });
    }
}
