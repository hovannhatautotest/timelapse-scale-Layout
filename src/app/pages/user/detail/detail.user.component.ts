import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EStatusUser, GlobalFacade, PartnerMeFacade, RoleFacade, User, UserFacade } from '@store';
import { getLanguage } from '@utils';
import { Subject, take, takeUntil, withLatestFrom } from 'rxjs';
import { environment } from '@src/environments/environment';
import { TransferItem } from 'ng-zorro-antd/transfer';

@Component({
  selector: 'app-detail-user',
  templateUrl: './detail.user.component.html',
  providers: [UserFacade, RoleFacade, PartnerMeFacade],
})
export class DetailUserComponent implements OnInit, OnDestroy {
  private destroyed$ = new Subject<void>();
  language = getLanguage();
  viewMore = false;
  admin = environment.admin;
  roles: TransferItem[] = [];
  selectRoles: string[] = [];

  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    public userFacade: UserFacade,
    protected globalFacade: GlobalFacade,
    public roleFacade: RoleFacade,
    public partnerMeFacade: PartnerMeFacade,
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
        case EStatusUser.putLockOk:
        case EStatusUser.putUnlockOk:
        case EStatusUser.putDowngradeBrokerOk:
        case EStatusUser.putAssignRoleOk:
          this.userFacade.getById(this.route.snapshot.params.id);
          break;
      }
    });
    this.userFacade.data$
      .pipe(takeUntil(this.destroyed$), withLatestFrom(this.roleFacade.roles$))
      .subscribe(([data, list]) => {
        this.roles = [];
        this.selectRoles = [];
        if (data && list && list.length > 0) {
          this.roles = list.map((r) => {
            if (data.roleListCode?.includes(r.code)) this.selectRoles.push(r.code);
            return {
              id: r.id,
              code: r.code,
              title: r.name,
              direction: data.roleListCode?.includes(r.code) ? 'right' : 'left',
            };
          });
          this.selectRoles.sort();
        }
        let check = false;
        for (let i = 0; i < this.roles.length; i++) {
          if (this.roles[i].direction === 'left' && this.roles[i].code === 'BROKER') this.roles[i].disabled = true;
          else if (this.roles[i].direction === 'right' && this.roles[i].code === 'BROKER') check = true;
        }
        if (check) {
          for (let i = 0; i < this.roles.length; i++) {
            if (this.roles[i].direction === 'left' && this.roles[i].code === 'USER') this.roles[i].disabled = true;
          }
        }
      });
    if (this.admin) {
      this.roleFacade.get({ page: 1, size: 30, filter: JSON.stringify({ exceptListRole: 'PARTNER' }) });
      this.userFacade.getById(this.route.snapshot.params.id);
    } else this.partnerMeFacade.getById(this.route.snapshot.params.id);
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
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

  onChangeRoles(ret: any): void {
    const code = ret.list.map((i: any) => i.code);
    if (ret.from === 'left') this.selectRoles = [...this.selectRoles, ...code];
    else this.selectRoles = this.selectRoles.filter((r: any) => !code.includes(r));
  }

  checkDisable({ roleListCode }: User): boolean {
    const roles = [...roleListCode];
    return JSON.stringify(roles?.sort()) === JSON.stringify(this.selectRoles);
  }
  putAssignRole() {
    if (this.selectRoles?.length) {
      if (this.roles.some((obj) => obj.code === 'BROKER' && obj.direction === 'right')) {
        this.selectRoles = this.selectRoles.filter((role) => role !== 'USER');
      }
      this.userFacade.putAssignRole(this.route.snapshot.params.id, this.selectRoles);
      for (let i = 0; i < this.roles.length; i++) {
        if (this.roles[i].direction === 'left' && this.roles[i].code === 'BROKER') this.roles[i].disabled = true;
      }
    }
  }
}
