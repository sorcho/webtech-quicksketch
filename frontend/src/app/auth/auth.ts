import { Component, ChangeDetectionStrategy, inject, computed, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

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

  readonly paramsObservable = this.activatedRoute.queryParamMap;
  readonly paramsSignal = toSignal(this.paramsObservable, { requireSync: true });
  readonly isSignin = computed(() => (this.paramsSignal().get('mode') === 'signin' ? true : false));
  readonly activeForm = computed(() => (this.isSignin() ? this.signinForm : this.signupForm));

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
    const username = this.activeForm().controls.username.value;
    const password = this.activeForm().controls.password.value;

    (this.isSignin()) ? url = "http://localhost:3000/login" : url = "http://localhost:3000/signup";

    this.httpClient.post(url, { username: username, password: password }, { withCredentials: true }).subscribe({
      next: (data) => {
        console.log(data);
      },
      error: (err) => {
        console.warn(err);
      }
    });
  }
}
