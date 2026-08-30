import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AsignacionForm } from './asignacion-form';

describe('AsignacionForm', () => {
  let component: AsignacionForm;
  let fixture: ComponentFixture<AsignacionForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsignacionForm],
    }).compileComponents();

    fixture = TestBed.createComponent(AsignacionForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
