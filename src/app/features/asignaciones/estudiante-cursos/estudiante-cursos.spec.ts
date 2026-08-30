import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EstudianteCursos } from './estudiante-cursos';

describe('EstudianteCursos', () => {
  let component: EstudianteCursos;
  let fixture: ComponentFixture<EstudianteCursos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstudianteCursos],
    }).compileComponents();

    fixture = TestBed.createComponent(EstudianteCursos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
