import { App } from './app';
import { Router } from '@angular/router';
import { runInInjectionContext, Injector } from '@angular/core';

describe('App', () => {
  it('should create the app', () => {
    const router = { events: { pipe: () => ({ subscribe: () => {} }) } } as unknown as Router;
    let app: App;
    runInInjectionContext(Injector.create({}), () => {
      app = new App(router);
    });
    expect(app).toBeTruthy();
  });
});
