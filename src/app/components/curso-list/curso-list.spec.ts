import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideRouter } from "@angular/router";

import { CursoList } from "./curso-list";

describe("CursoList", () => {
  let component: CursoList;
  let fixture: ComponentFixture<CursoList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CursoList],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(CursoList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
