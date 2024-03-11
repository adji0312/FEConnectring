import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailCateringComponent } from './detail-catering.component';

describe('DetailCateringComponent', () => {
  let component: DetailCateringComponent;
  let fixture: ComponentFixture<DetailCateringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailCateringComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailCateringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
