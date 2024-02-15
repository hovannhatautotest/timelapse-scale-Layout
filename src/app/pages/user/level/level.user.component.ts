import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormComponent } from '@core/form/form.component';
import { EFormType, FormModel } from '@model';
import { TranslateService } from '@ngx-translate/core';
import { EStatusUser, GlobalFacade, UserFacade } from '@store';
import { getLanguage } from '@utils';
import { Subject, takeUntil } from 'rxjs';

const date = new Date();
date.setDate(date.getDate() - 1);
@Component({
  selector: 'app-level-user',
  templateUrl: './level.user.component.html',
  providers: [UserFacade],
})
export class LevelUserComponent implements OnInit, OnDestroy {
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
        case EStatusUser.putRoleOk:
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
    if (form.valid) this.userFacade.putRole({ ...form.value, id });
  }

  handleBack() {
    this.router.navigate([this.language + '/user/' + this.route.snapshot.params.id]);
  }

  columnsForm: FormModel[] = [
    {
      name: 'brokerExpiresAt',
      title: 'routes.admin.user.brokerExpiresAt',
      formItem: {
        col: 6,
        type: EFormType.date,
        showTime: true,
        disabledDate: (current) => current < date,
      },
    },
    {
      name: 'roleCode',
      title: 'routes.admin.user.level',
      formItem: {
        type: EFormType.radio,
        col: 6,
        list: [{ label: 'routes.admin.user.broker', value: 'BROKER' }],
        value: 'BROKER',
      },
    },
    {
      name: 'brokerNote',
      title: 'routes.admin.user.brokerNote',
      formItem: {
        type: EFormType.textarea,
      },
    },
  ];
}
