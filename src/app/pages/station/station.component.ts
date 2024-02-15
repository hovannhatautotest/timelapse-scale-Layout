import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormatDatePipe } from '@pipes';
import { GlobalFacade, StationFacade } from '@store';
import { getLanguage } from '@utils';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-station',
  templateUrl: './station.component.html',
  providers: [StationFacade, GlobalFacade, FormatDatePipe],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StationComponent implements OnInit, OnDestroy {
  private destroyed$ = new Subject<void>();
  language = getLanguage();
  id: string;
  fullTextSearch = '';

  constructor(
    public router: Router,
    public stationFacade: StationFacade,
    private globalFacade: GlobalFacade,
  ) {}

  ngOnInit(): void {
    this.stationFacade.get({});

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
  }

  onSearch(data: string) {
    this.stationFacade.get({ filter: `{"fullTextSearch":"${data}"}` });
  }

  onClick(id: string, name: string) {
    const queryParams = { stationName: name, indexTab: 0 };
    this.router.navigate([this.language + '/station', id], { queryParams: queryParams });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
