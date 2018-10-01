import { Component, OnInit, OnDestroy } from "@angular/core";
import {
  FormGroup,
  FormControl,
  Validators
} from "../../../node_modules/@angular/forms";
import { AuthService } from "../shared/services/auth.service";
import { Subscription } from "../../../node_modules/rxjs";
import {
  Router,
  ActivatedRoute,
  Params
} from "../../../node_modules/@angular/router";
import { MaterialService } from "../shared/classes/material.service";

@Component({
  selector: "app-login-page",
  templateUrl: "./login-page.component.html",
  styleUrls: ["./login-page.component.css"]
})
export class LoginPageComponent implements OnInit, OnDestroy {
  form: FormGroup;
  aSub: Subscription;
  constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6)
      ])
    });
    this.route.queryParams.subscribe((params: Params) => {
      if (params["registered"]) {
        // Now you can login to system using your credentials
        MaterialService.toast("Now you can login to system using your credentials");
      } else if (params["accessDenied"]) {
        // At first authorize into system
        MaterialService.toast("At first authorize into system");
      } else if (params["sessionFailed"]) {
        MaterialService.toast("Please login in");
      }
    });
  }

  ngOnDestroy(): void {
    if (this.aSub) {
      this.aSub.unsubscribe();
    }
  }

  onSubmit() {
    this.form.disable();
    this.aSub = this.auth.login(this.form.value).subscribe(
      token => {
        this.form.enable();
        this.router.navigate(['/overview']);
      },
      error => {
        MaterialService.toast(error.error.message);
        this.form.enable();
      }
    );
  }
}
