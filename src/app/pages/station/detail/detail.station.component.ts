import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataTableComponent } from '@core/data-table/data-table.component';
import { DataTableModel } from '@model';
import { FormatDatePipe } from '@pipes';
import {
  GlobalFacade,
  StationFacade,
  TransactionsFacade,
  CustomersFacade,
  TransactionReportsFacade,
  ItemsFacade,
  PartnerReport,
  UserFacade,
  Customer,
  TransactionModel,
  Report,
  FileLogFacade,
  FileLog,
} from '@store';
import { getLanguage } from '@utils';
import { Subject, debounceTime, delay, fromEvent, of, take, takeUntil, throttleTime } from 'rxjs';
import dayjs from 'dayjs';
import { DatePipe } from '@angular/common';
import * as echarts from 'echarts';
import { environment } from '@src/environments/environment';
import * as moment from 'moment';
import { NzFormatBeforeDropEvent, NzFormatEmitEvent, NzTreeNodeOptions } from 'ng-zorro-antd/tree';


@Component({
  selector: 'app-detail.station',
  templateUrl: './detail.station.component.html',
  providers: [
    StationFacade,
    TransactionsFacade,
    CustomersFacade,
    TransactionReportsFacade,
    ItemsFacade,
    GlobalFacade,
    FormatDatePipe,
    UserFacade,
    FileLogFacade
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailStationComponent implements OnInit, OnDestroy {
  @ViewChild('transactionDataTable') transactionDataTable: DataTableComponent;
  @ViewChild('customerDataTable') customerDataTable: DataTableComponent;
  @ViewChild('recordId') recordId: TemplateRef<HTMLTemplateElement>;
  transactionColumnsTable: DataTableModel<TransactionModel>[] = [];
  customerColumnsTable: DataTableModel<any>[] = [];
  urlUpload = environment.apiUrl + 'core/nodes/upload/physical/blob?destinationPhysicalPath=upload/import/';

  private destroyed$ = new Subject<void>();
  language = getLanguage();

  stationName: string;
  id: string;
  transactionId: string;
  date: Date;
  selectedIndex : number;
  selectedDateRange: Date[] = [];
  type: string;
  fromDate: string;
  toDate: string;
  itemCode = '';
  customerCode = '';
  partnerCode = '';
  selectedTransactionType = '';
  isImport = '';
  customers: Customer[] = [];
  partners: Customer[] = [];
  transactionTypes = [
    {
      name: 'Tất cả các phiếu',
      code: '',
    },
    {
      name: 'Phiếu nhập tay',
      code: 'true',
    },
    {
      name: 'Phiếu tự động',
      code: 'false',
    },
  ];
  fullTextSearch = '';

  constructor(
    public router: Router,
    public stationFacade: StationFacade,
    public transactionsFacade: TransactionsFacade,
    public customersFacade: CustomersFacade,
    public transactionReportsFacade: TransactionReportsFacade,
    public itemsFacade: ItemsFacade,
    private formatDate: FormatDatePipe,
    private globalFacade: GlobalFacade,
    private route: ActivatedRoute,
    public userFacade: UserFacade,
    public fileLogFacade: FileLogFacade,
  ) {
    this.route.queryParams.subscribe((params) => {
      this.stationName = params.stationName;
      this.selectedIndex = Number(params.indexTab);
    });
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params.id;

    this.itemsFacade.getItem(this.id);
    this.customersFacade.getCustomerList(this.id, 'CUSTOMER');
    this.customersFacade.getPartnerList(this.id, 'PARTNER');
    if (this.selectedIndex == 0) {
      this.getDaysList(0)
    } else if(this.selectedIndex == 4) {
      this.stationFacade.query$.subscribe((query) => {
        this.currentPage = query.currentPage
        this.currentPageSize = query.currentPageSize
        this.isImport = query.isImport
        this.customerCode = query.customerCode
        this.partnerCode = query.partnerCode
        this.itemCode = query.itemCode
        this.fromDate = query.fromDate
        this.toDate = query.toDate

        const sevenDaysAgo = moment(this.fromDate, 'DDMMYYYY').toDate()
        const today = moment(this.toDate, 'DDMMYYYY').toDate()
        this.selectedDateRange = [sevenDaysAgo, today];


        this.stationFacade.getTransaction({
          id: this.id,
          page: this.currentPage,
          size: this.currentPageSize,
          filter: JSON.stringify({
            isImport: this.isImport,
            customerCode: this.customerCode,
            partnerCode: this.partnerCode,
            itemCode: this.itemCode,
            fromDate: this.fromDate,
            toDate: this.toDate
          })
        });
      })
    }

    this.globalFacade.setBreadcrumbs([
      {
        title: 'routes.admin.station.manageStation',
        link: '/navigation',
      },
      {
        title: 'routes.admin.station.station',
        link: '/station',
      },
    ]);

    this.stationFacade.transactionId$.pipe(takeUntil(this.destroyed$), take(1)).subscribe((transactionId) => {
      if(transactionId) {
        this.transactionId = transactionId;
        this.stationFacade.setTransactionId(null)
      }
    })


    this.transactionReportsFacade.reports$.subscribe((data) => {
      this.listDataReport = data;
      this.updateChart();
    });
    this.autoResizeChart();
  }

  //chart
  listDataReport: Report[] = [];
  private updateChart() {
    const data = {
      date: [] as string[],
      totalImportGoodsWeight: [] as number[],
      totalExportGoodsWeight: [] as number[],
      totalImportVehicles: [] as number[],
      totalExportVehicles: [] as number[],
      totalImpurityWeight: [] as number[],
    };
    this.listDataReport.forEach((d: any) =>
      // @ts-ignore
      Object.keys(data).forEach((k) => data[k].unshift(d[k])),
    );

    this.getChartInstanceById('totalGoodsWeightChart')?.setOption(
      this.generateBarChartOptions(data.date, [
        { name: 'KL Nhập (KG)', data: data.totalImportGoodsWeight },
        { name: 'KL Xuất (KG)', data: data.totalExportGoodsWeight },
      ]),
    );

    this.getChartInstanceById('totalVehiclesChart')?.setOption(
      this.generateBarChartOptions(data.date, [
        { name: 'Số xe nhập', data: data.totalImportVehicles },
        { name: 'Số xe xuất', data: data.totalExportVehicles },
      ]),
    );

    this.getChartInstanceById('totalImpurityWeightChart')?.setOption(
      this.generateBarChartOptions(data.date, [{ name: 'Tạp chất', data: data.totalImpurityWeight }], false),
    );

    this.getChartInstanceById('radioOfIIGWeightChart')?.setOption({
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: data.date },
      yAxis: { type: 'value' },
      series: [
        {
          data: data.totalImpurityWeight.map((iw: number, index: number) =>
            ((iw / data.totalImportGoodsWeight[index]) * 100).toFixed(2),
          ),
          type: 'line',
          smooth: true,
        },
      ],
    });

    this.getChartInstanceById('radioOfIWPieChart')?.setOption({
      tooltip: { trigger: 'item' },
      series: [
        {
          type: 'pie',
          radius: '50%',
          data: [
            {
              value: data.totalImpurityWeight.reduce((acc, cur) => acc + cur, 0),
              name: 'Tổng tạp chất (KG)',
            },
            {
              value: data.totalImportGoodsWeight.reduce((acc, cur) => acc + cur, 0),
              name: 'Tổng KL nhập (KG)',
            },
          ],
        },
      ],
    });
  }

  private generateBarChartOptions(xAxisData: any[], series: any[], showLegend = true) {
    return {
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      legend: { show: showLegend, top: 'bottom' },
      xAxis: { type: 'category', data: xAxisData },
      yAxis: { type: 'value' },
      series: series.map((s) => {
        return { ...s, type: 'bar' };
      }),
    };
  }

  private getChartInstanceById(id: string) {
    const element = document.getElementById(id) as HTMLElement;
    if (!element) {
      return null;
    }
    return echarts.getInstanceByDom(element) || echarts.init(element);
  }

  private autoResizeChart() {
    fromEvent(window, 'resize')
      .pipe(throttleTime(500), debounceTime(500), takeUntil(this.destroyed$))
      .subscribe(() => this.resizeAllChart());
  }

  private resizeAllChart() {
    this.getChartInstanceById('totalGoodsWeightChart')?.resize();
    this.getChartInstanceById('totalVehiclesChart')?.resize();
    this.getChartInstanceById('totalImpurityWeightChart')?.resize();
    this.getChartInstanceById('radioOfIIGWeightChart')?.resize();
    this.getChartInstanceById('radioOfIWPieChart')?.resize();
  }
  //end chart

  filterItem(data: any) {
    this.selectedIndex == 4 && data == null ? this.itemCode = "" : this.itemCode = data

    switch (this.selectedIndex) {
      case 0:
        this.transactionReportsFacade.getReport(
          this.id,
          this.fromDate,
          this.toDate,
          this.itemCode,
          this.customerCode,
          this.partnerCode,
        );
        break;
      case 1:
        this.transactionReportsFacade.getReport(
          this.id,
          this.fromDate,
          this.toDate,
          this.itemCode,
          this.customerCode,
          this.partnerCode,
        );
        break;
      case 4:
        this.stationFacade.getTransaction({
          id: this.id,
          filter: `{"isImport":"${this.isImport}","customerCode":"${this.customerCode}","partnerCode":"${this.partnerCode}","itemCode":"${this.itemCode}","fromDate":"${this.fromDate}","toDate":"${this.toDate}"}`,
        });
        break;
    }
  }

  filterPartner(data: any) {
    this.selectedIndex == 4 && data == null ? this.partnerCode = "" : this.partnerCode = data
    switch (this.selectedIndex) {
      case 0:
        this.transactionReportsFacade.getReport(
          this.id,
          this.fromDate,
          this.toDate,
          this.itemCode,
          this.customerCode,
          this.partnerCode,
        );
        break;
      case 1:
        this.transactionReportsFacade.getReport(
          this.id,
          this.fromDate,
          this.toDate,
          this.itemCode,
          this.customerCode,
          this.partnerCode,
        );
        break;
      case 4:
        this.stationFacade.getTransaction({
          id: this.id,
          filter: `{"isImport":"${this.isImport}","customerCode":"${this.customerCode}","partnerCode":"${this.partnerCode}","itemCode":"${this.itemCode}","fromDate":"${this.fromDate}","toDate":"${this.toDate}"}`,
        });
        break;
    }
  }

  filterCustomer(data: any) {
    this.selectedIndex == 4 && data == null ? this.customerCode = "" : this.customerCode = data
    switch (this.selectedIndex) {
      case 0:
        this.transactionReportsFacade.getReport(
          this.id,
          this.fromDate,
          this.toDate,
          this.itemCode,
          this.customerCode,
          this.partnerCode,
        );
        break;
      case 1:
        this.transactionReportsFacade.getReport(
          this.id,
          this.fromDate,
          this.toDate,
          this.itemCode,
          this.customerCode,
          this.partnerCode,
        );
        break;
      case 4:
        this.stationFacade.getTransaction({
          id: this.id,
          filter: `{"isImport":"${this.isImport}","customerCode":"${this.customerCode}","partnerCode":"${this.partnerCode}","itemCode":"${this.itemCode}","fromDate":"${this.fromDate}","toDate":"${this.toDate}"}`,
        });
        break;
    }
  }

  filterTransactionType(data: any) {
    this.selectedIndex == 4 && data == null ? this.isImport = "" : this.isImport = data

    this.stationFacade.getTransaction({
      id: this.id,
      filter: `{"isImport":"${this.isImport}","customerCode":"${this.customerCode}","partnerCode":"${this.partnerCode}","itemCode":"${this.itemCode}","fromDate":"${this.fromDate}","toDate":"${this.toDate}"}`,
    });
  }

  onSearch(data: any) {
    this.stationFacade.getTransaction({
      id: this.id,
      filter: `{"isImport":"${this.isImport}","customerCode":"${this.customerCode}","partnerCode":"${this.partnerCode}","itemCode":"${this.itemCode}","fromDate":"${this.fromDate}","toDate":"${this.toDate}","fullTextSearch":"${data}"}`,
    });
  }

  filteDateRange(data: any) {
    if (data.length > 0) {
      this.fromDate = dayjs(data[0]).format('DDMMYYYY');
      this.toDate = dayjs(data[1]).format('DDMMYYYY');
    } else {
      const today = new Date();
      const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      this.selectedDateRange = [sevenDaysAgo, today];

      const datePipe = new DatePipe('en-US');
      this.toDate = datePipe.transform(today, 'ddMMyyyy');
      this.fromDate = datePipe.transform(sevenDaysAgo, 'ddMMyyyy');
    }

    switch (this.selectedIndex) {
      case 0:
        this.transactionReportsFacade.getReport(
          this.id,
          this.fromDate,
          this.toDate,
          this.itemCode,
          this.customerCode,
          this.partnerCode,
        );
        break;
      case 1:
        this.transactionReportsFacade.getReport(
          this.id,
          this.fromDate,
          this.toDate,
          this.itemCode,
          this.customerCode,
          this.partnerCode,
        );
        break;
      case 2:
        this.transactionReportsFacade.getPartnerReport(this.type, this.fromDate, this.toDate, this.id);
        break;
      case 3:
        this.transactionReportsFacade.getPartnerReport(this.type, this.fromDate, this.toDate, this.id);
        break;
      case 4:
        this.stationFacade.getTransaction({
          id: this.id,
          filter: `{"isImport":"${this.isImport}","customerCode":"${this.customerCode}","partnerCode":"${this.partnerCode}","itemCode":"${this.itemCode}","fromDate":"${this.fromDate}","toDate":"${this.toDate}"}`,
        });
        break;
    }
  }
  onSelectedIndexChange($event: any) {
    this.selectedIndex = $event;
    this.pageIndex = 1;
    this.currentPageIndex = 1;
    this.isImport = ''
    this.customerCode = ''
    this.partnerCode = ''
    this.itemCode = ''

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {stationName: this.stationName, indexTab: this.selectedIndex },
      // queryParamsHandling: 'merge',
    });

    switch (this.selectedIndex) {
      case 0:
        this.getDaysList(this.selectedIndex);
        break;
      case 1:
        this.getDaysList(this.selectedIndex);
        break;
      case 2:
        this.type = 'supplier';
        this.getDaysList(this.selectedIndex);
        this.transactionReportsFacade.partnerReports$.subscribe((data) => (this.allItems = data));
        this.currentPageIndex = 1;
        break;
      case 3:
        this.type = 'customer';
        this.getDaysList(this.selectedIndex);
        this.drawCustomerDataTable()
        this.transactionReportsFacade.partnerReports$.subscribe((data) => (this.allItems = data));
        this.currentPageIndex = 1;
        break;
      case 4:
        this.getDaysList(this.selectedIndex);
        this.drawDataTable();
        break;
      case 5:
        this.fileLogFacade.get(this.id, 1, -1)
        this.fileLogFacade.list$.subscribe((data) => {
          if (data) {
            this.listDataFileLog = data
            this.setDataNodes(this.listDataFileLog)
          }
        })
        break;
    }
  }

  reload() {
    switch (this.selectedIndex) {
      case 0:
        this.transactionReportsFacade.getReport(
          this.id,
          this.fromDate,
          this.toDate,
          this.itemCode,
          this.customerCode,
          this.partnerCode,
        );
        break;
      case 1:
        this.transactionReportsFacade.getReport(
          this.id,
          this.fromDate,
          this.toDate,
          this.itemCode,
          this.customerCode,
          this.partnerCode,
        );
        break;
      case 2:
        this.transactionReportsFacade.getPartnerReport(this.type, this.fromDate, this.toDate, this.id);
        break;
      case 3:
        this.transactionReportsFacade.getPartnerReport(this.type, this.fromDate, this.toDate, this.id);
        break;
      case 4:
        this.stationFacade.getTransaction({
          id: this.id,
          filter: `{"isImport":"${this.isImport}","customerCode":"${this.customerCode}","partnerCode":"${this.partnerCode}","itemCode":"${this.itemCode}","fromDate":"${this.fromDate}","toDate":"${this.toDate}"}`,
        });
        break;
    }
  }

  isMenuVisible: boolean = false;
  showMenu(): void {
    this.isMenuVisible = true;
  }
  hideMenu(): void {
    setTimeout(() => {
      this.isMenuVisible = false;
    }, 100);
  }

  handelExportExcel(excelType: string, type: number) {
    this.transactionsFacade.getExcel({
      fromDate: this.fromDate,
      toDate: this.toDate,
      stationId: this.id,
      customerCode: this.customerCode,
      partnerCode: this.partnerCode,
      itemCode: this.itemCode,
      _type: type,
      excelType,
    });
  }

  downloadTransactionTemplate() {
    this.transactionsFacade.getImportTemplate()
  }

  handleuploadTransaction(data: any) {
    this.transactionsFacade.postImportExcel(data.file.response.data.physicalPath, this.id)
    setTimeout(() => {
      this.stationFacade.getTransaction({
        id: this.id,
        page: this.pageIndex,
        size: this.pageSize,
        filter: JSON.stringify({
          isImport: this.isImport,
          customerCode: this.customerCode,
          partnerCode: this.partnerCode,
          itemCode: this.itemCode,
          fromDate: this.fromDate,
          toDate: this.toDate
        })
      });
    },500)
  }

  handleDeleteTransaction(transactionId: string) {
    this.transactionsFacade.deleteImportExcel(transactionId);
    setTimeout(() => {
      this.stationFacade.getTransaction({
        id: this.id,
        page: this.pageIndex,
        size: this.pageSize,
        filter: JSON.stringify({
          isImport: this.isImport,
          customerCode: this.customerCode,
          partnerCode: this.partnerCode,
          itemCode: this.itemCode,
          fromDate: this.fromDate,
          toDate: this.toDate
        })
      });
    },500)
  }

  allItems: any[] = [];
  totalItems = this.allItems.length;
  pageSize = 20;
  currentPageIndex = 1;
  pageIndex = 1;

  get displayedItems(): PartnerReport[] {
    const startIndex = (this.currentPageIndex - 1) * this.pageSize;
    const endIndex = this.currentPageIndex * this.pageSize;
    return this.allItems.slice(startIndex, endIndex);
  }

  onPageIndexChange(pageIndex: number) {
    this.currentPageIndex = pageIndex;
  }

  classRow(data: TransactionModel, {transactionId}: {transactionId : string}) {
    return data.transactionId == transactionId ? 'bg-blue-100' : '';
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  getDaysList(index: number) {
    const today = new Date();
    const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    this.selectedDateRange = [sevenDaysAgo, today];

    const datePipe = new DatePipe('en-US');
    this.toDate = datePipe.transform(today, 'ddMMyyyy');
    this.fromDate = datePipe.transform(sevenDaysAgo, 'ddMMyyyy');

    switch (index) {
      case 0:
        this.transactionReportsFacade.getReport(this.id, this.fromDate, this.toDate, '', '', '');
        break;
      case 1:
        this.transactionReportsFacade.getReport(this.id, this.fromDate, this.toDate, '', '', '');
        break;
      case 2:
        this.transactionReportsFacade.getPartnerReport(this.type, this.fromDate, this.toDate, this.id);
        break;
      case 3:
        this.transactionReportsFacade.getPartnerReport(this.type, this.fromDate, this.toDate, this.id);
        break;
      case 4:
        setTimeout(() => {
          this.stationFacade.getTransaction({
            id: this.id,
            filter: JSON.stringify({
              isImport: this.isImport,
              customerCode: this.customerCode,
              partnerCode: this.partnerCode,
              itemCode: this.itemCode,
              fromDate: this.fromDate,
              toDate: this.toDate
            })
          });
        },300)
        break;
    }
  }

  private drawDataTable() {
    setTimeout(() => {
      this.transactionColumnsTable = [
        {
          name: 'recordId',
          title: 'routes.admin.station.recordId',
          tableItem: {
            renderTemplate: this.recordId,
            width: '120px',
          },
        },
        {
          name: 'createdDate',
          title: 'routes.admin.station.createdDate',
          tableItem: {
            width: '80px',
            render: (item) => this.formatDate.transform(item?.createdDate, 'DD/MM/YYYY'),
          },
        },
        {
          name: 'seller',
          title: 'routes.admin.station.seller',
          tableItem: {
            width: '160px',
          },
        },
        {
          name: 'buyer',
          title: 'routes.admin.station.buyer',
          tableItem: {
            width: '160px',
          },
        },
        {
          name: 'firstWeighTime',
          title: 'routes.admin.station.firstWeighTime',
          tableItem: {
            width: '100px',
            render: (item) => this.formatDate.transform(item?.firstWeighTime, 'DD/MM/YYYY HH:mm'),
          },
        },
        {
          name: 'firstWeight',
          title: 'routes.admin.station.firstWeight',
          tableItem: {
            width: '80px',
          },
        },
        {
          name: 'secondWeightTime',
          title: 'routes.admin.station.secondWeightTime',
          tableItem: {
            width: '100px',
            render: (item) => this.formatDate.transform(item?.secondWeighTime, 'DD/MM/YYYY HH:mm'),
          },
        },
        {
          name: 'secondWeight',
          title: 'routes.admin.station.secondWeight',
          tableItem: {
            width: '80px',
          },
        },
        {
          name: 'netWeight',
          title: 'routes.admin.station.netWeight',
          tableItem: {
            width: '80px',
          },
        },

        {
          name: 'note',
          title: 'routes.admin.station.note',
          tableItem: {
            width: '100px',
          },
        },
      ];
    });
  }

  private drawCustomerDataTable() {
    setTimeout(() => {
      this.customerColumnsTable = [
        {
          name: 'name',
          title: 'routes.admin.station.name',
          tableItem: {
            width: '120px',
          },
        },
        {
          name: 'totalGoodWeight',
          title: 'routes.admin.station.totalGoodWeight',
          tableItem: {
            width: '80px'
          },
        }
      ];
    });
  }

  handelOnClick(transactionId: string) {
    this.stationFacade.setQuery({
      id: this.id,
      currentPage: this.currentPage,
      currentPageSize: this.currentPageSize,
      isImport: this.isImport,
      customerCode: this.customerCode,
      partnerCode: this.partnerCode,
      itemCode: this.itemCode,
      fromDate: this.fromDate || '',
      toDate: this.toDate || ''
    })

    this.router.navigate([this.language + '/station', this.id, 'transaction', transactionId], {
      queryParams: { stationName: this.stationName, currentPage: this.currentPage, currentPageSize: this.currentPageSize}
    })

  }

  currentPage: number;
  currentPageSize: number
  getTransactionList(data: any) {
    this.currentPage = data.page
    this.currentPageSize = data.size

    this.stationFacade.getTransaction({
      id: this.id,
      page: data.page,
      size: data.size,
      filter: JSON.stringify({
        isImport: this.isImport,
        customerCode: this.customerCode,
        partnerCode: this.partnerCode,
        itemCode: this.itemCode,
        fromDate: this.fromDate,
        toDate: this.toDate
      })
    });
    this.drawDataTable()
  }

  // ---------Start File log----------------
  listDataFileLog: any = [];
  totalItemFileLog: number = 0;
  nodes: NzTreeNodeOptions[] = [];
  searchValueNodes = '';
  setDataNodes(data: FileLog[]) {
    if (data && data.length > 0) {
      const result: NzTreeNodeOptions[] = [];
      function loopChildNodes(dataChildNodes: FileLog[]) {
        const resultChildNodes: any[] = [];
        dataChildNodes.forEach((iChildNodes) => {
          const objNode = {
            title: iChildNodes.fileName,
            key: iChildNodes.id,
            expanded: false,
            hasChild: iChildNodes.hasChild,
            isGroup: iChildNodes.subChild,
            isLeaf: !iChildNodes.subChild,
            children:
              iChildNodes.subChild && iChildNodes.subChild.length > 0
                ? loopChildNodes(iChildNodes.subChild)
                : undefined,
          };
          resultChildNodes.push(objNode);
        });
        return resultChildNodes;
      }

      data.forEach((i) => {
        result.push({
          title: i.fileName,
          key: i.id,
          expanded: false,
          hasChild: i.hasChild,
          isGroup: true,
          children: i.subChild && i.subChild.length > 0 ? loopChildNodes(i.subChild) : undefined,
        });
      });
      this.nodes = result;
    }
  }

  beforeDropNodes(arg: NzFormatBeforeDropEvent) {
    if (arg.pos === 0) {
      return of(true).pipe(delay(1000));
    } else {
      return of(false);
    }
  }

  dataByIdFileLog?: FileLog;
  contentFileLog = '';
  clickSeeMore = 1;
  isVisibleSeeMore = false;
  async onClickNodes(event: NzFormatEmitEvent) {
    if (event.node && !event.node.origin.hasChild) {
      const id = event.keys && event.keys[0];
      if (id) {
        this.fileLogFacade.getById(id)
        this.fileLogFacade.data$.pipe().subscribe(data =>{
          this.dataByIdFileLog = data;
          this.isVisibleSeeMore = true;
          this.clickSeeMore = 1;
          this.contentFileLog = '';
          this.seeMoreFileLog(20);
        }
        )
      }
    }
  }

  seeMoreFileLog(line: number) {
    this.isVisibleSeeMore = (this.dataByIdFileLog?.content &&
      this.dataByIdFileLog?.content.length > this.clickSeeMore * line) as boolean;
    this.contentFileLog = this.contentFileLog.concat(
      (this.contentFileLog ? '\n' : '') +
        this.dataByIdFileLog?.content.slice((this.clickSeeMore - 1) * line, this.clickSeeMore * line).join('\n') || '',
    );
    this.clickSeeMore++;
  }

  onClickDeleteFileLog(id?: string) {
    if (id) {
      this.fileLogFacade.delete(id)
      this.fileLogFacade.get(this.id, 1, -1)
      this.fileLogFacade.list$.subscribe((data) => {
        if (data) {
          this.listDataFileLog = data
          this.setDataNodes(this.listDataFileLog)
        }
      })
    }
  }
  // ----------End File Log -------------
}
