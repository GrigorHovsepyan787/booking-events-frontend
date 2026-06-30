import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  let component: FooterComponent;

  beforeEach(() => {
    component = new FooterComponent();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have current year set', () => {
    const currentYear = new Date().getFullYear();
    expect(component.currentYear()).toBe(currentYear);
  });

  describe('current year', () => {
    it('should be a valid year', () => {
      const year = component.currentYear();
      expect(year).toBeGreaterThan(2000);
      expect(year).toBeLessThanOrEqual(new Date().getFullYear());
    });

    it('should be a number', () => {
      expect(typeof component.currentYear()).toBe('number');
    });
  });
});