import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Params, Router } from '../../../../node_modules/@angular/router';
import { FormGroup, FormControl, Validators } from '../../../../node_modules/@angular/forms';
import { CategoriesService } from '../../shared/services/categories.service';
import { switchMap } from '../../../../node_modules/rxjs/operators';
import { of } from '../../../../node_modules/rxjs';
import { MaterialService } from '../../shared/classes/material.service';
import { Category } from '../../shared/interfaces/Category';
import { Message } from '../../shared/interfaces/Message';

@Component({
  selector: 'app-categories-form',
  templateUrl: './categories-form.component.html',
  styleUrls: ['./categories-form.component.css']
})
export class CategoriesFormComponent implements OnInit {
  @ViewChild('input') input: ElementRef;
  image: File;
  category: Category;
  imagePreview = '';
  form: FormGroup;
  isNew: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private categoriesService: CategoriesService,
    private router: Router) { }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required)
    });

    this.form.disable();

    this.route.params.pipe(
      switchMap(
        (params: Params) => {
          if (params['id']) {
            this.isNew = false;
            return this.categoriesService.getById(params['id']);
          }
          return of(null);
        }
      )
    ).subscribe(
      (category: Category) => {
        if (category) {
          this.category = category;
          this.form.patchValue({
            name: category.name,
          });
          this.imagePreview = category.imageSrc;
          MaterialService.updateTextInputs();
        }
        this.form.enable();
      },
      error => MaterialService.toast(error.error.message)
    );
  }

  triggerClick() {
    this.input.nativeElement.click();
  }
  onFileUpload(event: any) {
    const file = event.target.files[0];
    this.image = file;

    const reader = new FileReader();

    reader.onload = () => {
      this.imagePreview = reader.result;
    };

    reader.readAsDataURL(file);

  }
  onSubmit() {
    let obs$;
    this.form.disable();
    if (this.isNew) {
      obs$ = this.categoriesService.create(this.form.value.name, this.image);
    } else {
      obs$ = this.categoriesService.update(this.category._id, this.form.value.name, this.image);
    }

    obs$.subscribe(
      (category: Category) => {
        this.category = category;
        MaterialService.toast('CHANGES_WAS_SAVED')
        this.form.enable();
      },
      error => {
        MaterialService.toast(error.error.message);
        this.form.enable();
      },
      () => this.router.navigate(['/categories'])
    )
  }

  deleteCategory() {
    const decision = window.confirm(`DELETE_CONFIRMATION ${this.category.name}?`);

    if (decision) {
      this.categoriesService.delete(this.category._id)
        .subscribe(
          (response: Message) => { MaterialService.toast(response.message); },
          error => MaterialService.toast(error.error.message),
          () => this.router.navigate(['/categories'])
        );
    }
  }
}
