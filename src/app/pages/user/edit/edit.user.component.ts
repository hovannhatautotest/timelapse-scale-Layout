import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subject, take, takeUntil } from 'rxjs';

import { FormComponent } from '@core';
import { EStatusState, EFormRuleType, EFormType, FormModel } from '@model';
import { GlobalFacade, UserFacade } from '@store';
import { getLanguage } from '@utils';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit.user.component.html',
  providers: [UserFacade],
})
export class EditUserComponent implements OnInit, OnDestroy {
  @ViewChild('form') form!: FormComponent;
  private destroyed$ = new Subject<void>();
  id = '';
  isCustomer?: boolean;
  columnsForm: FormModel[] = [];
  language = getLanguage();

  constructor(
    protected translate: TranslateService,
    protected route: ActivatedRoute,
    public userFacade: UserFacade,
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
        link: '/internal-account',
      },
    ]);

    this.id = this.route.snapshot.params.id;
    if (this.id) {
      this.userFacade.getById(this.id);
    }

    this.userFacade.status$.pipe(takeUntil(this.destroyed$)).subscribe((status) => {
      switch (status) {
        case EStatusState.postOk:
        case EStatusState.putOk:
          this.handleBack();
          break;
      }
    });
    setTimeout(() => {
      this.columnsForm = [
        {
          name: 'name',
          title: 'routes.admin.user.userName',
          formItem: {
            col: 12,
            rules: [{ type: EFormRuleType.required }],
          },
        },
        {
          name: 'userName',
          title: 'User Name',
          formItem: {
            col: 6,
            rules: [{ type: EFormRuleType.required }, { type: EFormRuleType.email }],
          },
        },
        {
          name: 'phoneNumber',
          title: 'routes.admin.user.phoneNumber',
          formItem: {
            col: 6,
            type: EFormType.number,
            rules: [
              { type: EFormRuleType.minlength, value: 8 },
              { type: EFormRuleType.maxlength, value: 12 },
            ],
          },
        },
        {
          name: 'partnerId',
          title: 'routes.admin.user.partner',
          formItem: {
            // condition: (item: any) =>
            //   item.roleListCode.filter((item: any) => item === 'USER') == 'USER' ||
            //   item.roleListCode.filter((item: any) => item === 'BROKER') == 'BROKER',
            col: 6,
            type: EFormType.select,
            // list: self.listPartner,
            // onSearch: (value: string) => {
            //   self.servicePartner.get({
            //     page: 1,
            //     size: 10,
            //     filter: JSON.stringify({ fullTextSearch: value })
            //   }).subscribe((res: any) => {
            //     if (self.listPartner.length > 0) {
            //       for (let i = self.listPartner.length - 1; i >= 0; i--) {
            //         self.listPartner.splice(self.listPartner[i], 1);
            //       }
            //     }
            //     res.data.content.filter((item: any) => item.isActive == true).map((item: any) => self.listPartner.push({ ...item, value: item.id, label: item.name }));
            //   });
          },
        },
        {
          name: 'isActive',
          title: 'routes.admin.user.activate/deactivate',
          formItem: {
            col: 6,
            type: EFormType.switch,
            // condition: (item: any) =>
            //   (item.roleListCode.filter((item: any) => item === 'USER') == 'USER' && environment.admin) ||
            //   (item.roleListCode.filter((item: any) => item === 'BROKER') == 'BROKER' && environment.admin),
          },
        },
        {
          name: 'birthdate',
          title: 'routes.admin.user.birthdate',
          formItem: {
            type: EFormType.date,
            col: 6,
          },
        },
        {
          name: 'email',
          title: 'Email',
          formItem: {
            col: 6,
            rules: [{ type: EFormRuleType.required }, { type: EFormRuleType.email }],
          },
        },
      ];
    });
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  handleSubmit(form: FormGroup) {
    if (form.valid) {
      const data = {
        ...form.value,
        roleListCode: [form.get('role')?.value],
      };
      this.id ? this.userFacade.put(this.id, data) : this.userFacade.post(data);
    }
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
}
