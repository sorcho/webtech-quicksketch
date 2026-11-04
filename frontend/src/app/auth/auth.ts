import { Component, ChangeDetectionStrategy, inject, computed, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from '@openng/ngx-toastr';

@Component({
  selector: 'app-auth',
  imports: [RouterLink, ReactiveFormsModule],
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

  readonly paramsObservable = this.activatedRoute.queryParamMap;
  readonly paramsSignal = toSignal(this.paramsObservable, { requireSync: true });
  readonly isSignin = computed(() => (this.paramsSignal().get('mode') === 'signin' ? true : false));
  readonly activeForm = computed(() => (this.isSignin() ? this.signinForm : this.signupForm));

  // TODO: implement these signals correctly
  readonly hasLowercaseSignal = signal('');
  readonly hasUppercaseSignal = signal('');
  readonly hasDigitSignal = signal('');
  readonly hasSixCharactersSignal = signal('');

  regex = new RegExp("^((?=\\S*?[A-Z])(?=\\S*?[a-z])(?=\\S*?[0-9])\\S{6,})$")

  signinForm = this.formBuilder.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  // TODO: update deprecated usage of formBuilder.group
  signupForm = this.formBuilder.group({
    username: ['', Validators.required],
    password: ['', [Validators.required, Validators.pattern(this.regex)]],
    repeat_password: ['', Validators.required],
  }, { validators: this.equalPasswordCheck });

  equalPasswordCheck(group: FormGroup) {
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

    if (!this.isSignin() && password.invalid) {
      this.toastr.warning('', "The password isn't strong enough.", { timeOut: 1500, positionClass: 'toast-top-center' });
      return;
    }

    if (!this.isSignin() && (repeat_password.value !== password.value)) {
      this.toastr.warning('', "The passwords don't match.", { timeOut: 1500, positionClass: 'toast-top-center' });
      return;
    }


    this.httpClient.post<{ message: string }>(url, { username: username.value, password: password.value }, { withCredentials: true }).subscribe({
      next: (data) => {
        console.log(data);
        this.toastr.success('', data.message, { timeOut: 1500, positionClass: 'toast-top-center' });
        (this.isSignin()) ? this.router.navigateByUrl('/') : this.router.navigateByUrl('/auth?mode=signin');
      },
      error: (err) => {
        this.toastr.error('', err.error.message, { timeOut: 2500, positionClass: 'toast-top-center' });
        console.warn(err);
      }
    });
  }
}
