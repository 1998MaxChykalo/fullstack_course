import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '../../../node_modules/@angular/forms';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '../../../node_modules/@angular/router';
import { Subscription } from '../../../node_modules/rxjs';
import { MaterialService } from '../shared/classes/material.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent implements OnInit, OnDestroy {
  private aSub: Subscription;

  public form: FormGroup;

  constructor(
    private auth: AuthService,
    private router: Router) { }

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl(null, [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6)
      ])
    });
  }

  onSubmit() {
    this.form.disable();
    this.aSub = this.auth.register(this.form.value)
      .subscribe(
        () => {
          this.router.navigate(['/login'],{
            queryParams: {
              registered: true
            }
          })
        },
        error => {
          MaterialService.toast(error.error.message);
          this.form.enable();
        }
      );
  }

  ngOnDestroy(): void {
    if (this.aSub) {
      this.aSub.unsubscribe();
    }
  }
}
