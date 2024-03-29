import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { GlobalFacade } from '@store';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  constructor(public globalFacade: GlobalFacade) {
    this.loadExternalStyles([
      'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;700&display=fallback',
      'style.css',
      'sweetalert2.css',
      'line-awesome.css',
      'glightbox.css',
    ]);

    this.loadExternalScript(['sweetalert2-build.js']);
  }

  ngOnInit(): void {
    this.globalFacade.autoLogin();
  }
  private loadExternalStyles(styleUrl: Array<any>) {
    styleUrl.forEach((item) => {
      const check = document.querySelector(`link[href="${item}"]`);
      if (!check) {
        const styleElement = document.createElement('link');
        styleElement.rel = 'stylesheet';
        styleElement.href = item;
        document.head.appendChild(styleElement);
      }
    });
  }

  private loadExternalScript(scriptUrl: Array<any>) {
    scriptUrl.forEach(function (item) {
      const check = document.querySelector(`script[src="${item}"]`);
      if (!check) {
        const scriptElement = document.createElement('script');
        scriptElement.src = item;
        scriptElement.async = false;
        scriptElement.defer = true;
        document.body.appendChild(scriptElement);
      }
    });
  }
}
