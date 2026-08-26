import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting, HttpTestingController } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute, convertToParamMap, provideRouter } from "@angular/router";

import { CursoForm } from "./curso-form";

describe("CursoForm", () => {
  let component: CursoForm;
  let fixture: ComponentFixture<CursoForm>;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CursoForm],
      providers: [
        provideRouter([{ path: "cursos", component: CursoForm }]),
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({}) } },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CursoForm);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    await fixture.whenStable();
  });

  afterEach(() => http.verify());

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("loads and updates a course with an alphanumeric id", async () => {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [CursoForm],
      providers: [
        provideRouter([{ path: "cursos", component: CursoForm }]),
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: convertToParamMap({ id: "YYMmwOEDXMg" }) },
          },
        },
      ],
    }).compileComponents();

    const editFixture = TestBed.createComponent(CursoForm);
    const editComponent = editFixture.componentInstance;
    const editHttp = TestBed.inject(HttpTestingController);
    editFixture.detectChanges();

    const getRequest = editHttp.expectOne("http://localhost:3000/cursos/YYMmwOEDXMg");
    expect(getRequest.request.method).toBe("GET");
    getRequest.flush({ id: "YYMmwOEDXMg", nombre: "Realidad Nacional" });
    expect(editComponent.idCurso).toBe("YYMmwOEDXMg");
    expect(editComponent.form.getRawValue()).toEqual({ nombre: "Realidad Nacional" });

    editComponent.form.setValue({ nombre: "Realidad Nacional Actualizada" });
    editComponent.guardar();

    const putRequest = editHttp.expectOne("http://localhost:3000/cursos/YYMmwOEDXMg");
    expect(putRequest.request.method).toBe("PUT");
    expect(putRequest.request.body).toEqual({ nombre: "Realidad Nacional Actualizada" });
    putRequest.flush({ id: "YYMmwOEDXMg", nombre: "Realidad Nacional Actualizada" });
    editHttp.expectOne("http://localhost:3000/cursos").flush([]);
  });
});
