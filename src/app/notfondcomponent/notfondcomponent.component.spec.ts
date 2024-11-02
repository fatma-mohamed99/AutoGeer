import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotfondcomponentComponent } from './notfondcomponent.component';

describe('NotfondcomponentComponent', () => {
  let component: NotfondcomponentComponent;
  let fixture: ComponentFixture<NotfondcomponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotfondcomponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotfondcomponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
