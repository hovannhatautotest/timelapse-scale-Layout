import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormComponent } from '@core/form/form.component';
import { EFormRuleType, EFormType, FormModel } from '@model';
import { TranslateService } from '@ngx-translate/core';
import { EStatusUser, GlobalFacade, UserFacade } from '@store';
import { getLanguage } from '@utils';
import { Subject, take, takeUntil } from 'rxjs';

@Component({
  selector: 'app-password-user',
  templateUrl: './password.user.component.html',
  providers: [UserFacade],
})
export class PasswordUserComponent implements OnInit, OnDestroy {
  isCustomer?: boolean;
  private destroyed$ = new Subject<void>();
  @ViewChild('form') form!: FormComponent;
  language = getLanguage();

  constructor(
    protected translate: TranslateService,
    protected route: ActivatedRoute,
    protected userFacade: UserFacade,
    protected router: Router,
    protected globalFacade: GlobalFacade,
  ) {}

  ngOnInit(): void {
    this.globalFacade.setBreadcrumbs([
      {
        title: 'routes.admin.user.manageAccount',
        link: '/navigation',
      },
      {
        title: 'routes.admin.user.internalAccount',
        link: '/user',
      },
    ]);
    this.userFacade.status$.pipe(takeUntil(this.destroyed$)).subscribe((status) => {
      switch (status) {
        case EStatusUser.putPasswordOk:
          this.handleBack();
          break;
      }
    });
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  handleSubmit(form: FormGroup) {
    const id = this.route.snapshot.params.id;
    if (form.valid) this.userFacade.putPassword(id, form.get('password')?.value);
  }

  handleBack() {
    this.userFacade.setId(this.route.snapshot.params.id);
    this.userFacade.query$.pipe(takeUntil(this.destroyed$), take(1)).subscribe((query) => {
      this.router.navigate(
        [this.language + '/user'],
        !!query
          ? {
              relativeTo: this.route,
              queryParams: query,
              queryParamsHandling: 'merge',
            }
          : {},
      );
    });
  }

  columnsForm: FormModel[] = [
    {
      name: 'password',
      title: 'routes.admin.user.password',
      formItem: {
        rules: [{ type: EFormRuleType.required }],
        type: EFormType.password,
      },
    },
    {
      name: 'confirmPassword',
      title: 'routes.admin.user.confirmPassword',
      formItem: {
        rules: [
          { type: EFormRuleType.required },
          {
            type: EFormRuleType.custom,
            validator: ({ value }: AbstractControl): ValidationErrors | null => {
              if (this.form && !!value && value !== this.form.validateForm.get('password')?.value)
                return { custom: true };
              return null;
            },
            message: 'routes.admin.user.messageConfirmPassword',
          },
        ],
        type: EFormType.password,
      },
    },
  ];
}
