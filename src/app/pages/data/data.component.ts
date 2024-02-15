import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { EStatusState, DataTableModel, ETableAlign } from '@model';
import { Datas, DatasFacade, DataType, DataTypesFacade, GlobalFacade } from '@store';
import { getLanguage, Message } from '@utils';
import { debounceTime, distinctUntilChanged, Subject, take, takeUntil, throttleTime } from 'rxjs';
import { DataTableComponent } from '@core/data-table/data-table.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  providers: [DatasFacade, DataTypesFacade],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataComponent implements OnInit, OnDestroy {
  constructor(
    private globalFacade: GlobalFacade,
    protected message: Message,
    protected route: ActivatedRoute,
    protected router: Router,
    public dataTypesFacade: DataTypesFacade,
    public datasFacade: DatasFacade,
    public translate: TranslateService,
  ) {}

  private destroyed$ = new Subject<void>();
  @ViewChild('tableData') tableData!: DataTableComponent;
  id = '';
  language = getLanguage();

  ngOnInit() {
    if (!this.router.url.includes('filter=')) {
      this.router.navigate([], {
        queryParams: { filter: '{"type":"Strategic"}' },
        queryParamsHandling: 'merge',
      });
    }
    this.globalFacade.setBreadcrumbs([
      {
        title: 'QUẢN LÝ DANH MỤC',
        link: '/data',
      },
      {
        title: 'Quản lý dữ liệu',
        link: '/data',
      },
    ]);
    const type = this.route.snapshot.queryParams.filter
      ? JSON.parse(this.route.snapshot.queryParams.filter).type
      : 'Strategic';
    this.dataTypesFacade.list$.pipe(takeUntil(this.destroyed$)).subscribe((list) => {
      if (list.length && !this.selectedDataType) {
        list.forEach((item) => {
          if (item.code === type) this.selectedDataType = item;
        });
      }
    });
    this.dataTypesFacade.get({ page: 1, size: -1 });
    this.searchDataValueChange();
    this.datasFacade.status$.pipe(takeUntil(this.destroyed$)).subscribe((status) => {
      switch (status) {
        case EStatusState.deleteOk:
        case EStatusState.putOk:
          this.tableData.changeData();
          break;
      }
    });
    this.dataTypesFacade.status$.pipe(takeUntil(this.destroyed$)).subscribe((status) => {
      switch (status) {
        case EStatusState.deleteOk:
          this.dataTypesFacade.get({ page: 1, size: -1 });
          break;
      }
    });
    this.datasFacade.id$.pipe(takeUntil(this.destroyed$), take(1)).subscribe((id) => {
      if (!!id) {
        this.id = id;
        this.datasFacade.setId(null);
      }
    });
    setTimeout(() => {
      this.setTable();
    });
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  filterLanguage(items: any[], key = 'name'): string {
    if (!!this.translate.defaultLang) {
      const lang = items?.filter((item) => item.language === this.translate.defaultLang);
      return !!lang.length ? lang[0][key] : '';
    }
    return '';
  }

  classRow(data: Datas, { id }: { id: string }) {
    return data.id === id ? 'bg-blue-100' : '';
  }

  selectedDataType?: DataType;

  onSelectDataType(type: DataType): void {
    this.selectedDataType = type;
    if (this.tableData) {
      this.tableData.paramTable.filter.type = this.selectedDataType.code;
      this.tableData.paramTable.page = 1;
      this.tableData.updateQueryParams();
      this.fullTextSearch.setValue('');
    }
  }

  handleDeleteDataType(data: any) {
    this.dataTypesFacade.delete(data.id);
    // this.selectedDataType = undefined;
  }

  fullTextSearch = new FormControl();

  searchDataValueChange() {
    this.fullTextSearch.valueChanges
      .pipe(debounceTime(300), throttleTime(300), distinctUntilChanged(), takeUntil(this.destroyed$))
      .subscribe((value) => {
        if (value) this.tableData.paramTable.filter.fullTextSearch = value;
        else delete this.tableData.paramTable.filter.fullTextSearch;
        this.tableData.paramTable.page = 1;
        this.tableData.updateQueryParams();
      });
  }

  @ViewChild('formLayoutTable') formLayoutTable!: any;
  @ViewChild('titleTemplate') titleTemplate!: any;
  columnsTable: DataTableModel<Datas>[] = [];

  private setTable() {
    this.columnsTable = [
      {
        name: '',
        title: 'routes.admin.Layout.Title',
        tableItem: {
          renderTemplate: this.titleTemplate,
        },
      },
      {
        name: 'order',
        title: 'routes.admin.Layout.Order',
        tableItem: {
          width: '80px',
          sort: null,
        },
      },
      {
        name: '',
        title: 'routes.admin.Layout.action',
        tableItem: {
          width: '120px',
          align: ETableAlign.center,
          actions: [
            {
              icon: (item) => (item.isVisible ? 'la-low-vision text-red-500' : 'las la-eye text-teal-500'),
              confirm: true,
              text: (item) => (!item.isVisible ? 'routes.admin.data.show' : 'routes.admin.data.hide'),
              onClick: (item) => this.datasFacade.put(item.id, { ...item, isVisible: !item.isVisible }),
            },
            {
              icon: () => 'la-edit',
              text: () => 'routes.admin.Layout.edit',
              onClick: (item) => this.router.navigate([this.language + '/data', item.id, 'edit']),
            },
            {
              icon: () => 'la-trash',
              textConfirm: () => 'components.data-table.wanttodeletethisrecord',
              text: () => 'routes.admin.Layout.delete',
              confirm: true,
              onClick: (item) => this.datasFacade.delete(item.id || ''),
            },
          ],
        },
      },
    ];
  }
}
