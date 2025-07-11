import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-meta-create-page',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './meta-create-page.component.html',
  styleUrl: './meta-create-page.component.scss'
})
export class MetaCreatePageComponent {
  myMetaForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.myMetaForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.maxLength(100)]],
      objective: ['', [Validators.required, Validators.min(0.01)]],
      completed: [false]
    });
  }

  onSubmit(): void {
    if (this.myMetaForm.valid) {
      console.log('Form submitted:', this.myMetaForm.value);
    }
  }

  resetForm(): void {
    this.myMetaForm.reset({
      name: '',
      description: '',
      objective: '',
      completed: false
    });
  }
}
