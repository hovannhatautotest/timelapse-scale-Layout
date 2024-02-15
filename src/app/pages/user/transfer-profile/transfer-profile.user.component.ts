import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormComponent } from '@core/form/form.component';
import { EFormRuleType, EFormType, FormModel } from '@model';
import { TranslateService } from '@ngx-translate/core';
import { EStatusUser, GlobalFacade, UserFacade } from '@store';
import { getLanguage } from '@utils';
import { Subject, takeUntil } from 'rxjs';

const date = new Date();
date.setDate(date.getDate() - 1);
@Component({
  selector: 'app-transfer-profile-user',
  templateUrl: './transfer-profile.user.component.html',
  providers: [UserFacade],
})
export class TransferProfileUserComponent implements OnInit, OnDestroy {
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
        case EStatusUser.putTransferProfileOk:
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
    if (form.valid) this.userFacade.putTransferProfile({ ...form.value, id });
  }

  handleBack() {
    this.router.navigate([this.language + '/user/' + this.route.snapshot.params.id]);
  }

  columnsForm: FormModel[] = [
    {
      name: 'destUserId',
      title: 'routes.admin.user.destUserId',
      formItem: {
        type: EFormType.select,
        facade: this.userFacade.listUser$,
        rules: [{ type: EFormRuleType.required }],
        onSearch: (value: string) =>
          this.userFacade.getListUser({
            page: 1,
            size: 10,
            filter: JSON.stringify({ fullTextSearch: value }),
          }),
      },
    },
    {
      name: 'option',
      title: 'routes.admin.user.option',
      formItem: {
        type: EFormType.radio,
        list: [
          { value: 'APPROVED_PROFILES', label: 'routes.admin.user.APPROVED_PROFILES' },
          { value: 'ALL_PROFILES', label: 'routes.admin.user.ALL_PROFILES' },
        ],
        rules: [{ type: EFormRuleType.required }],
      },
    },
  ];
}
