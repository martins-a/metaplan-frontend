import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetaCreatePageComponent } from './meta-create-page.component';

describe('MetaCreatePage', () => {
  let component: MetaCreatePageComponent;
  let fixture: ComponentFixture<MetaCreatePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MetaCreatePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MetaCreatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
