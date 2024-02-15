import { Component, OnDestroy, OnInit } from '@angular/core';
import { GlobalFacade, MeFacade } from '@store';
import { Subject, takeUntil } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import type { EChartsOption } from 'echarts';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  providers: [MeFacade],
})
export class DashboardComponent implements OnInit, OnDestroy {
  private destroyed$ = new Subject<void>();

  chartUser: EChartsOption;
  chart: EChartsOption;
  chartUser1: EChartsOption;
  chartUser2: EChartsOption;
  chartUser3: EChartsOption;
  chartBroker: EChartsOption;
  constructor(
    protected translate: TranslateService,
    private globalFacade: GlobalFacade,
    public meFacade: MeFacade,
  ) {}

  ngOnInit(): void {
    this.globalFacade.setBreadcrumbs([
      {
        title: 'DASHBOARD',
        link: '/dashboard',
      },
    ]);
    this.meFacade.getInfo();
    this.meFacade.getMonthlyStatistic();
    this.meFacade.monthlyStatistic$.pipe(takeUntil(this.destroyed$)).subscribe((data) => {
      if (data.length) {
        const label: any = [];
        const userCount: any = [];
        const commissionAmount: any = [];
        const profileCount: any = [];

        const offerCount: any = [];
        const proposalCount: any = [];
        const brokerCount: any = [];
        data.map((item) => {
          label.push(item.month + '/' + item.year.toString().substring(2, 4));
          userCount.push(item.userCount);
          commissionAmount.push(item.commissionAmount);
          profileCount.push(item.profileCount);

          offerCount.push(item.offerCount);
          proposalCount.push(item.proposalCount);
          brokerCount.push(item.brokerCount);
        });
        this.translate.get('routes.admin.Dashboard').subscribe((text: any) => {
          const options: EChartsOption = {
            tooltip: {
              trigger: 'axis',
            },
            grid: {
              top: '40px',
              left: '90px',
              bottom: '30px',
              right: '50px',
            },
            legend: { show: false },
            xAxis: {
              type: 'category',
              boundaryGap: true,
              axisLabel: {
                show: true,
              },
              axisLine: {
                show: true,
                lineStyle: {
                  color: '#000000',
                },
              },
              splitLine: {
                show: false,
              },
              axisTick: {
                show: true,
                lineStyle: {
                  color: '#000000',
                },
              },
              data: label,
            },
            yAxis: {
              show: true,
              type: 'value',
              axisLine: {
                show: true,
                lineStyle: {
                  color: '#000000',
                },
              },
              splitLine: {
                show: true,
                lineStyle: {
                  color: '#e5e7eb',
                },
              },
            },
          };
          this.chartUser = {
            ...options,
            series: [
              {
                name: text['usertotal'],
                type: 'bar',
                barWidth: '20px',
                itemStyle: {
                  color: '#EF4444',
                  borderRadius: 0,
                },
                data: userCount,
              },
            ],
          };
          this.chartUser1 = {
            ...options,
            series: [
              {
                name: text['TotalCommission'],
                type: 'bar',
                barWidth: '20px',
                itemStyle: {
                  color: '#F59E0B',
                  borderRadius: 0,
                },
                data: commissionAmount,
              },
            ],
          };
          this.chartUser2 = {
            ...options,
            series: [
              {
                name: text['Profiletotal'],
                type: 'bar',
                barWidth: '20px',
                itemStyle: {
                  color: '#3B82F6',
                  borderRadius: 0,
                },
                data: profileCount,
              },
            ],
          };
          this.chartUser3 = {
            ...options,
            series: [
              {
                name: text['TotalOffer'],
                type: 'bar',
                barWidth: '10px',
                itemStyle: {
                  color: '#3B82F6',
                  borderRadius: 0,
                },
                data: offerCount,
              },
              {
                name: text['TotalProposal'],
                type: 'bar',
                barWidth: '10px',
                itemStyle: {
                  color: '#EF4444',
                  borderRadius: 0,
                },
                data: proposalCount,
              },
            ],
          };
          console.log(brokerCount);
          this.chartBroker = {
            ...options,
            series: [
              {
                name: text['Total broker'],
                type: 'bar',
                barWidth: '20px',
                itemStyle: {
                  color: '#34B27C',
                  borderRadius: 0,
                },
                data: brokerCount,
              },
            ],
          };
        });
      }
    });

    this.meFacade.getPackageStatistic();
    this.meFacade.packageStatistic$.pipe(takeUntil(this.destroyed$)).subscribe((data) => {
      if (data.length) {
        this.chart = {
          color: ['#ddd', '#999', '#d6b002', '#11a6a1'],
          grid: {
            top: '0',
            left: '0',
            bottom: '0',
            right: '0',
          },
          tooltip: {
            trigger: 'item',
          },
          legend: {
            bottom: '0%',
            left: 'center',
          },
          series: [
            {
              name: 'Package',
              type: 'pie',
              radius: ['40%', '80%'],
              avoidLabelOverlap: false,
              itemStyle: {
                borderRadius: 0,
                borderColor: '#fff',
                borderWidth: 2,
              },
              label: {
                show: false,
                position: 'center',
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: '15',
                  fontWeight: 'bold',
                },
              },
              labelLine: {
                show: false,
              },
              data: data.map((item) => ({
                value: item.count,
                name: item.name,
                itemStyle: { color: item.backgroundColor },
              })),
            },
          ],
        };
      }
    });
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
