import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {MyMeta} from '../../models/my-meta';
import {MetaApiService} from '../../services/meta-api.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-meta-create-page',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './meta-create-page.component.html',
  styleUrl: './meta-create-page.component.scss'
})
export class MetaCreatePageComponent implements OnInit {
  myMetaForm: FormGroup;
  metaApiService = inject(MetaApiService);

  metaId: string | null = null;

  constructor(private fb: FormBuilder, private route: ActivatedRoute) {
    this.myMetaForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.maxLength(100)]],
      objective: ['', [Validators.required, Validators.min(0.01)]],
      completed: [false]
    });
  }

  onSubmit(): void {
    if (this.myMetaForm.valid) {
      const formValue = this.myMetaForm.value;
      const meta: MyMeta = {
        completed: formValue.completed,
        description: formValue.description,
        name: formValue.name,
        objective: formValue.objective,
        reserve: 0,
      }
      if ( this.metaId ) {
        meta.id = this.metaId;
        this.metaApiService.editMeta(meta).subscribe(meta => {
          alert('edited successfully');
        });
      } else {
        this.metaApiService.addMeta(meta).subscribe(meta => {
          alert('created successfully');
        });
      }

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

  ngOnInit(): void {
    this.metaId = this.route.snapshot.queryParamMap.get('id');
    console.log('Path parameter (snapshot):', this.metaId);
  }
}
