import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subject, take, takeUntil } from 'rxjs';
import dayjs from 'dayjs';

import { EStatusState, DataTableModel, ETableAlign, QueryFilter } from '@model';
import { FormatDatePipe } from '@pipes';
import { GlobalFacade, RoleFacade, UserFacade, User, MeFacade } from '@store';
import { getLanguage } from '@utils';
import { environment } from '@src/environments/environment';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  providers: [UserFacade, FormatDatePipe, RoleFacade, MeFacade],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserComponent implements OnInit, OnDestroy {
  @ViewChild('tableAccount') tableAccount: any;
  @ViewChild('name') name!: TemplateRef<HTMLTemplateElement>;
  @ViewChild('isEmailVerified') isEmailVerified!: TemplateRef<HTMLTemplateElement>;
  columnsTable: DataTableModel<User>[] = [];
  private destroyed$ = new Subject<void>();
  id?: string = '';
  language = getLanguage();
  admin = environment.admin;
  listResellerType: any = {
    USER: 'routes.admin.user.normal',
    BROKER: 'routes.admin.user.broker',
    PARTNER: 'routes.admin.user.partner',
  };
  listType = Object.keys(this.listResellerType).map((key) => ({ label: this.listResellerType[key], value: key }));
  constructor(
    protected translate: TranslateService,
    protected route: ActivatedRoute,
    protected router: Router,
    protected userFacade: UserFacade,
    protected formatDate: FormatDatePipe,
    protected globalFacade: GlobalFacade,
    protected roleFacade: RoleFacade,
    public meFacade: MeFacade,
  ) {}

  ngOnInit(): void {
    if (!this.admin) this.meFacade.getInfo();
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
    if (this.admin) this.roleFacade.get({ page: 1, size: -1, filter: JSON.stringify({ exceptListRole: 'PARTNER' }) });

    this.userFacade.status$.pipe(takeUntil(this.destroyed$)).subscribe((status) => {
      switch (status) {
        case EStatusState.deleteOk:
          this.tableAccount.changeData();
          break;
      }
    });

    this.userFacade.id$.pipe(takeUntil(this.destroyed$), take(1)).subscribe((id) => {
      if (!!id) {
        this.id = id;
        this.userFacade.setId(null);
      }
    });

    setTimeout(() => {
      this.columnsTable = [
        {
          name: 'name',
          title: 'routes.admin.user.userName',
          tableItem: {
            renderTemplate: this.name,
          },
        },
        {
          name: 'userName',
          title: 'Email',
          tableItem: {
            width: '260px',
          },
        },
        {
          name: 'partner',
          title: 'routes.admin.user.partner',
          tableItem: {
            width: '150px',
            render: (data: any) => data?.partner?.name,
          },
        },
        {
          name: 'phoneNumber',
          title: 'routes.admin.user.phoneNumber',
          tableItem: {},
        },
        {
          name: 'lastActivityDate',
          title: 'routes.admin.user.lastActivityDate',
          tableItem: {
            width: '160px',
            render: (item) => this.formatDate.transform(item?.lastActivityDate, 'HH:mm:ss dd/MM/YY'),
          },
        },
        {
          name: '',
          title: 'routes.admin.Layout.action',
          tableItem: {
            width: '105px',
            align: ETableAlign.center,
            actions: [
              {
                icon: () => 'la-key',
                text: () => 'routes.admin.user.changePassword',
                onClick: (data) => this.router.navigate([this.language + '/user', data.id, 'password']),
              },
              {
                icon: () => 'la-edit',
                text: () => 'routes.admin.Layout.edit',
                onClick: (data) => this.router.navigate([this.language + '/user', data.id, 'edit']),
              },
              {
                icon: () => 'la-trash',
                text: () => 'routes.admin.Layout.delete',
                textConfirm: () => 'components.data-table.wanttodeletethisrecord',
                confirm: true,
                onClick: (data) => this.userFacade.delete(data.id || ''),
              },
            ],
          },
        },
      ];
      if (!this.admin) this.columnsTable.pop();
    });
  }

  classRow(data: User, { id }: { id: string }) {
    return data.id === id ? 'bg-blue-100' : '';
  }

  filteDateRange(data: any) {
    const dataS = dayjs(data[0]).format('YYYY-MM-DD, 00:00:00');
    const dataE = dayjs(data[1]).format('YYYY-MM-DD, 23:59:59');
    const rs = [dataS, dataE];
    if (data.length == 0) {
      if (data) this.tableAccount.filter('DateRange', null, []);
    } else if (data) this.tableAccount.filter('DateRange', null, rs);
  }

  filterUsers(event: QueryFilter) {
    const filter = {
      ...JSON.parse(event.filter),
      IsEmployee: true,
    };
    const body: QueryFilter = {
      ...event,
      filter: JSON.stringify(filter),
    };
    this.userFacade.getList(body);
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
