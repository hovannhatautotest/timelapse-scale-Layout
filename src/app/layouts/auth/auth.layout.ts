import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { environment } from '@src/environments/environment';
@Component({
  selector: 'app-auth',
  templateUrl: './auth.layout.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthLayout {
  admin = environment.admin;
  constructor(
    public translate: TranslateService,
    protected router: Router,
  ) {}

  changeLanguage(value: string): void {
    const pathName = location.pathname.split('/');
    pathName[1] = value;
    this.translate.setDefaultLang(value);
    this.router.navigate([pathName.join('/')]);
  }
}
