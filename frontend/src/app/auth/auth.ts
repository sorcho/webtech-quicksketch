import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, Validators, FormBuilder, FormGroup, AbstractControl, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from '@openng/ngx-toastr';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth-service';

@Component({
  selector: 'app-auth',
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './auth.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './auth.css',
})

export class Auth {
  private formBuilder = inject(FormBuilder);
  private activatedRoute = inject(ActivatedRoute);
  private httpClient = inject(HttpClient);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  private authService = inject(AuthService);

  readonly paramsObservable = this.activatedRoute.queryParamMap;
  readonly paramsSignal = toSignal(this.paramsObservable, { requireSync: true });
  readonly isSignin = computed(() => (this.paramsSignal().get('mode') === 'signin' ? true : false));
  readonly activeForm = computed(() => (this.isSignin() ? this.signinForm : this.signupForm));
  readonly regexRules = [
    { label: "At least one lowercase character", regex: /[a-z]/ },
    { label: "At least one uppercase character", regex: /[A-Z]/ },
    { label: "At least one digit", regex: /\d/ },
    { label: "At least six characters", regex: /.{6,}/ },
  ];

  signinForm = this.formBuilder.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  signupForm = this.formBuilder.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
    repeat_password: ['', Validators.required],
  }, { validators: this.equalPasswordCheck });

  equalPasswordCheck(group: AbstractControl) {
    const password = group.get('password');
    const repeat_password = group.get('repeat_password');

    if (password?.value === repeat_password?.value) {
      return null;
    } else {
      return { passwordMismatch: true };
    }
  }

  onSubmit() {
    var url: string = '';

    const username = this.activeForm().controls.username;
    const password = this.activeForm().controls.password;
    const repeat_password = this.signupForm.controls['repeat_password'];

    (this.isSignin()) ? url = "http://localhost:3000/login" : url = "http://localhost:3000/signup";

    if (!this.isSignin() && !this.regexRules.every((rule) => {
      if (password.value === null) return;
      return rule.regex.test(password.value);
    }
    )) {
      this.toastr.warning('', "The password isn't strong enough.", { timeOut: 1500, positionClass: 'toast-top-center' });
      return;
    }

    if (!this.isSignin() && (repeat_password.value !== password.value)) {
      this.toastr.warning('', "The passwords don't match.", { timeOut: 1500, positionClass: 'toast-top-center' });
      return;
    }

    this.httpClient.post<{ message: string }>(url, { username: username.value, password: password.value }, { withCredentials: true }).subscribe({
      next: (data) => {
        this.authService.setLoggedIn(true);
        this.toastr.success('', data.message, { timeOut: 1500, positionClass: 'toast-top-center' });
        (this.isSignin()) ? this.router.navigateByUrl('/') : this.router.navigateByUrl('/auth?mode=signin');
      },
      error: (err) => {
        this.toastr.error('', err.error.message, { timeOut: 2500, positionClass: 'toast-top-center' });
      }
    });
  }
}
