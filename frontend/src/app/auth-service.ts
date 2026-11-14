import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { computed, inject, PLATFORM_ID, Service, signal } from '@angular/core';

@Service()
export class AuthService {
    userId?: number;
    readonly url = "http://localhost:3000/me"
    private readonly _authState = signal<'unknown' | 'authenticated' | 'anonymous'>('unknown');
    readonly authState = this._authState.asReadonly();
    readonly isLoggedIn = computed(() => this.authState() === 'authenticated');

    private httpClient = inject(HttpClient);
    private platformId = inject(PLATFORM_ID);

    setLoggedIn(value: boolean) {
        (value) ? this._authState.set("authenticated") : this._authState.set("anonymous");
    }

    checkSession() {
        if (!isPlatformBrowser(this.platformId)) return;
        this.httpClient.get(this.url, { withCredentials: true }).subscribe({
            next: (data: any) => {
                this._authState.set("authenticated");
                this.userId = data.id
            },
            error: () => this._authState.set("anonymous"),
        });
    }
}
