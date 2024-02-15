import { AttachmentTemplateModel, EStatusTransactions, StationFacade, TransactionsFacade } from '@store';
import { Component, OnInit, OnDestroy, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { getLanguage } from '@utils';
import { FormatDatePipe } from '@pipes';
import { FormatCurrencyPipe } from '@pipes';
import { environment } from '@src/environments/environment';
import * as echarts from 'echarts';


//@ts-ignore
import GLightbox from 'glightbox';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  providers: [StationFacade, TransactionsFacade,FormatDatePipe, FormatCurrencyPipe],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionComponent implements OnInit, OnDestroy {
  data: any = {};
  private destroyed$ = new Subject<void>();
  language = getLanguage();
  id: string;
  transactionId: string;
  stationName: string;
  currentPage: number;
  currentPageSize: number;
  listUpload: any[] = [];

  constructor(
    private route: ActivatedRoute,
    public stationFacade: StationFacade,
    public transactionsFacade: TransactionsFacade,
    private formatDate: FormatDatePipe,
    private formatCurrency: FormatCurrencyPipe,
    private router: Router,
  ) {
    this.route.queryParams.subscribe((params) => {
      this.stationName = params.stationName;
      this.currentPage = params.currentPage
      this.currentPageSize = params.currentPageSize
    });
    setTimeout(() => GLightbox(), 300);
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params.id;
    this.transactionId = this.route.snapshot.params.transactionId;
    this.transactionsFacade.getByTransactionId(this.transactionId);
    this.transactionsFacade.data$.subscribe(data => {this.data = data})

    this.transactionsFacade.getAttachments(this.transactionId)
    this.transactionsFacade.listAttachments$.subscribe(data => {
      this.listUpload = [];
      data?.map((attach: any) => {
        this.listUpload.push({
          uid: attach.id,
          name: this.formatDate.transform(attach.createdOnDate) + ' - ' + attach.docTypeName,
          status: 'done',
          url: attach?.file,
        });
      });
    })

    this.transactionsFacade.getAttachmentsTemplate(this.transactionId)
    this.transactionsFacade.listAttachmentsTemplate$.subscribe((data) => {
      delete data[0].createdByUserId;
      delete data[0].createdOnDate;
      this.infoUpload = data[0];
      if (this.infoUpload) {
        this.urlUpload =
          environment.apiUrl +
          'core/nodes/upload/physical/blob?isResize=true&width=1200&height=1200&destinationPhysicalPath=' +
          this.infoUpload.prefix;
      }
    })

    this.transactionsFacade.status$.pipe(takeUntil(this.destroyed$)).subscribe((status) => {
      switch (status) {
        case EStatusTransactions.postAttachmentManyOk:
        case EStatusTransactions.deleteAttachments_ByAttachmentIdOk:
          this.transactionsFacade.getAttachments(this.transactionId)
          break;
      }
    });

    this.transactionsFacade.getAutoScaleNumbersChart(this.transactionId)
    this.transactionsFacade.dataAutoScaleNumbersChart$.subscribe((data) => {
      this.listAutoScaleNumberChart = data
      setTimeout(() => this.updateChart(), 300)
    })
  }



  handleBack() {
    this.stationFacade.setTransactionId(this.transactionId);
    const queryParams = { stationName: this.stationName, indexTab: 4, page: this.currentPage, size: this.currentPageSize };
    this.router.navigate([this.language + '/station', this.id], { queryParams: queryParams });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }


  infoUpload?: AttachmentTemplateModel;
  urlUpload?: string;
  handleUpload(data: any) {
    if (data.type === 'success') {
      this.transactionsFacade.postAttachmentMany(this.transactionId,[
        { ...this.infoUpload, file: data.file.response.data.physicalPath },
      ])
    }
  }

  previewImage: any;
  previewVisible = false;
  handlePreview = async (file: NzUploadFile) => {
    this.previewImage = file.url || file.preview;
    this.previewVisible = true;
  };

  handleRemove = (file: NzUploadFile) => {
    this.transactionsFacade.deleteAttachments_ByAttachmentId(this.transactionId, file.uid)
    return true
  }

  // ------------------------------------------------------------------------------------------------

  listAutoScaleNumberChart: any;

  private getChartInstanceById(id: string): any {
    const element = document.getElementById(id) as HTMLElement;
    if (!element) {
      return;
    }
    return echarts.getInstanceByDom(element) || echarts.init(element);
  }

  isDataStage2 = false;

  private updateChart(): void {
    const stage1 = {
      weightTimeSecond: [] as any [],
      weightValue: [] as any[],
    };
    const stage2 = {
      weightTimeSecond: [] as any [],
      weightValue: [] as any [],
    };
    this.isDataStage2 = this.listAutoScaleNumberChart.stage2 && this.listAutoScaleNumberChart.stage2.length > 0;
    this.listAutoScaleNumberChart.stage1 &&
      this.listAutoScaleNumberChart.stage1.forEach((d: any) =>
        // @ts-ignore
        Object.keys(stage1).forEach((k) => stage1[k].push(d[k])),
      );
    this.listAutoScaleNumberChart.stage2 &&
      this.listAutoScaleNumberChart.stage2.forEach((d: any) =>
        // @ts-ignore
        Object.keys(stage2).forEach((k) => stage2[k].push(d[k])),
      );

    this.getChartInstanceById('radioOfAutoScaleNumberChart')?.setOption({
      title: [
        {
          text: `Cân lần 1, chốt số: ${this.formatCurrency.transform(this.data.firstWeight, '')}kg`,
          left: 'center',
          textStyle: {
            fontFamily: 'Segoe UI',
          },
        },
        this.isDataStage2
          ? {
              top: '50%',
              text: `Cân lần 2, chốt số: ${this.formatCurrency.transform(this.data.secondWeight, '')}kg`,
              left: 'center',
              textStyle: {
                fontFamily: 'Segoe UI',
              },
            }
          : undefined,
      ],
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross' },
      },
      xAxis: [
        {
          type: 'category',
          name: 'Số giây',
          boundaryGap: false,
          nameTextStyle: {
            color: 'rgba(38, 84, 225, 1)',
            fontWeight: 'bold',
            fontFamily: 'Segoe UI',
          },
          data: stage1.weightTimeSecond,
        },
        this.isDataStage2
          ? {
              type: 'category',
              name: 'Số giây',
              boundaryGap: false,
              nameTextStyle: {
                color: 'rgba(38, 84, 225, 1)',
                fontWeight: 'bold',
                fontFamily: 'Segoe UI',
              },
              data: stage2.weightTimeSecond,
              gridIndex: 1,
            }
          : undefined,
      ],
      yAxis: [
        {
          type: 'value',
          name: 'Khối lượng',
          nameTextStyle: {
            color: 'rgba(38, 84, 225, 1)',
            fontWeight: 'bold',
            fontFamily: 'Segoe UI',
          },
        },
        this.isDataStage2
          ? {
              type: 'value',
              name: 'Khối lượng',
              nameTextStyle: {
                color: 'rgba(38, 84, 225, 1)',
                fontWeight: 'bold',
                fontFamily: 'Segoe UI',
              },
              gridIndex: 1,
            }
          : undefined,
      ],
      toolbox: {
        right: 10,
        feature: {
          restore: {},
          saveAsImage: {},
        },
      },
      dataZoom: [
        {
          type: 'inside',
        },
        this.isDataStage2
          ? {
              type: 'inside',
              xAxisIndex: 1,
              yAxisIndex: 1,
            }
          : undefined,
      ],
      grid: [
        {
          bottom: this.isDataStage2 ? '60%' : '10%',
        },
        this.isDataStage2
          ? {
              top: '60%',
            }
          : undefined,
      ],
      series: [
        {
          name: 'KL',
          type: 'line',
          data: stage1.weightValue,
          smooth: true,
          areaStyle: {
            color: '#052388',
            opacity: 0.9,
          },
          lineStyle: {
            type: 'dashed',
          },
          markLine: {
            silent: false,
            symbolSize: 8,
            symbol: '',
            label: {
              distance: 20,
              formatter: `${this.formatCurrency.transform(this.data.firstWeight, 'kg')}`,
            },
            lineStyle: {
              type: 'solid',
              color: '#ec2a2a',
              width: 2,
            },
            data: [
              {
                yAxis: this.data.firstWeight,
              },
            ],
          },
        },
        this.isDataStage2
          ? {
              name: 'KL',
              type: 'line',
              data: stage2.weightValue,
              smooth: true,
              areaStyle: {
                color: '#0e6b04',
                opacity: 0.9,
              },
              lineStyle: {
                color: 'green',
                type: 'dashed',
              },
              markLine: {
                silent: false,
                symbolSize: 8,
                symbol: '',
                label: {
                  distance: 20,
                  formatter: `${this.formatCurrency.transform(this.data.secondWeight, 'kg')}`,
                },
                lineStyle: {
                  type: 'solid',
                  color: '#ec2a2a',
                  width: 2,
                },
                data: [
                  {
                    yAxis: this.data.secondWeight,
                  },
                ],
              },
              itemStyle: {
                color: 'green',
              },
              xAxisIndex: 1,
              yAxisIndex: 1,
            }
          : undefined,
      ],
    });
  }
}
