import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SvgIconComponent } from './svg-icon.component';

describe('SvgIconComponent', () => {
  let fixture: ComponentFixture<SvgIconComponent>;
  let component: SvgIconComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SvgIconComponent);
    component = fixture.componentInstance;
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should return correct href from getter', () => {
    component.icon = 'settings';
    expect(component.href).toBe('/assets/svg/settings.svg#settings');
  });

  it('should render <use> element with correct href', () => {
    component.icon = 'user';
    fixture.detectChanges();

    const use = fixture.nativeElement.querySelector('use');
    expect(use.getAttribute('href')).toBe('/assets/svg/user.svg#user');
  });
});
