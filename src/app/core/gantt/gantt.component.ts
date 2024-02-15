import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { uuidv4 } from '@utils';
import Draggabilly from 'draggabilly';
import dayjs, { Dayjs } from 'dayjs';
import { gsap } from 'gsap';

@Component({
  selector: 'g-gantt',
  templateUrl: './gantt.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GanttComponent implements OnChanges {
  @Input() data: TTask[] = [];
  @Input() event: {
    name: string;
    startDate: Dayjs;
    endDate?: Dayjs;
  }[] = [];

  public id: string = 'gantt-' + uuidv4();

  objectKeys = Object.keys;
  ngOnInit(): void {
    // this.task = this.data;
    // this.date = this.remainingMonths(this.dateStart);
    dayjs.locale('vi');

    setTimeout(() => {
      let wLeft = 0;
      let wRight = 0;
      const left: any = document.querySelector(`#${this.id} .left`);
      const right: any = document.querySelector(`#${this.id} .right`);
      new Draggabilly(document.querySelector(`#${this.id} .drag-side`)!, {
        axis: 'x',
      })
        .on('dragStart', () => {
          if (left && right) {
            const width = left.parentElement!.offsetWidth;
            if (left.style.flexBasis.indexOf('%') > 0) left.style.flexBasis = width / 2 + 'px';
            if (right.style.flexBasis.indexOf('%') > 0) right.style.flexBasis = width / 2 + 'px';
            wLeft = parseFloat(left.style.flexBasis.split('px')[0]);
            wRight = parseFloat(right.style.flexBasis.split('px')[0]);
          }
        })
        .on('dragMove', (_, __, moveVector) => {
          if (left && right) {
            const p = moveVector.x;
            left.style.flexBasis = wLeft + p + 'px';
            right.style.flexBasis = wRight - p + 'px';
          }
        });

      let height = 0;
      const dragVertical: any = document.querySelector(`#${this.id} .drag-vertical`);
      new Draggabilly(dragVertical, {
        axis: 'y',
      })
        .on('dragStart', () => {
          height = document.querySelector(`#${this.id} .overflow-scroll`).clientHeight;
        })
        .on('dragMove', (_, __, moveVector) => {
          document
            .querySelectorAll(`#${this.id} .overflow-scroll`)
            .forEach((e: any) => (e.style.height = height + moveVector.y + 'px'));
        })
        .on('dragEnd', () => {
          dragVertical.style.removeProperty('left');
          dragVertical.style.removeProperty('top');
        });

      let widthDrag = 0;
      let index = 0;
      document.querySelectorAll(`#${this.id} .drag`).forEach((e: any) =>
        new Draggabilly(e, {
          axis: 'x',
        })
          .on('dragStart', () => {
            if (e.parentElement) widthDrag = e.parentElement.offsetWidth;
            if (e.parentElement?.parentElement)
              index = Array.prototype.slice.call(e.parentElement.parentElement.children).indexOf(e.parentElement);
          })
          .on('dragMove', (_, __, moveVector) => {
            if (e.parentElement) e.parentElement.style.width = widthDrag + moveVector.x + 'px';
            (document.querySelector(
              `#${this.id} .left tbody > tr > td:nth-of-type(${index + 1})`,
            ) as any)!.style.width = widthDrag + moveVector.x + 'px';
          })
          .on('dragEnd', () => {
            e.style.removeProperty('left');
            e.style.removeProperty('top');
          }),
      );
    });
  }

  @Input() perRow: number = 3;
  @Input() widthColumnDay: number = 36;
  widthMonthYear = 110;
  date: any = {
    obj: {},
    total: 0,
  };
  dateStart = dayjs();
  remainingMonths(d: Dayjs, e: Dayjs) {
    let date = d.subtract(this.perRow * 2, 'days');
    let end = e;
    const addDate = date.daysInMonth() - date.date() + 1;
    if (addDate * (this.widthColumnDay / this.perRow) < this.widthMonthYear)
      date = date.subtract(Math.ceil(this.widthMonthYear / this.widthColumnDay) * this.perRow - addDate, 'days');

    const addEndDate = end.date() + 1;
    if (addEndDate * (this.widthColumnDay / this.perRow) < this.widthMonthYear)
      end = end.add(Math.ceil(this.widthMonthYear / this.widthColumnDay) * this.perRow - addEndDate, 'days');

    this.dateStart = date;
    const endMonth = end.month() - date.month() + 1 + (end.year() - date.year()) * 12;
    const objDate: any = {};
    let totalDay = date.date();
    let lengthDay = 0;
    for (let i = 0; i < endMonth; i++) {
      const currentDay = date.add(i, 'months');
      const month = currentDay.month();
      if (!objDate[currentDay.year()]) objDate[currentDay.year()] = {};
      if (!objDate[currentDay.year()][month]) objDate[currentDay.year()][month] = [];
      const dayInMonth = currentDay.daysInMonth();
      for (let j = totalDay; j <= dayInMonth; j += this.perRow) {
        if (j + this.perRow > dayInMonth) totalDay = j + this.perRow - dayInMonth;
        const nextDate = dayjs(
          currentDay.year() + '-' + (month < 10 ? '0' : '') + (month + 1) + '-' + (j < 10 ? '0' : '') + j,
        );
        if (nextDate < end.add(this.perRow, 'days')) objDate[currentDay.year()][month].push(nextDate);
      }
      lengthDay += objDate[currentDay.year()][month].length;
    }
    return { obj: objDate, total: lengthDay };
  }

  getScrollBarWidth = () => {
    const el = document.createElement('div');
    el.style.cssText = 'overflow:scroll; visibility:hidden; position:absolute;';
    document.body.appendChild(el);
    const width = el.offsetWidth - el.clientWidth;
    el.remove();
    return width;
  };

  @Input() maxHeight: number = 500;
  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.data?.currentValue && changes.data.currentValue.length > 0) {
      let start = dayjs();
      let end = dayjs().add(1, 'months');
      if (this.data.length && this.date.total === 0) {
        start = this.data[0].startDate;
        end = this.data[0].endDate || this.data[0].startDate.add(1, 'months');
        this.data.forEach((item) => {
          if (item.startDate < start) start = item.startDate;
          if (item.endDate && item.endDate > end) end = item.endDate;
        });
      }
      this.date = this.remainingMonths(start, end);
      this.task = this.data;
      this.indexTask = -1;
      this.indexTaskObj = {};
      setTimeout(() => {
        (document.querySelector(`#${this.id} .left .head`) as any)!.style.width =
          document.querySelector(`#${this.id} .left .body`)!.clientWidth + this.getScrollBarWidth() + 'px';
        document.querySelectorAll(`#${this.id} .left tbody > tr:nth-of-type(1) > td`).forEach((e: any, index, arr) => {
          (document.querySelector(
            `#${this.id} .left thead > tr:nth-of-type(1) > th:nth-of-type(${index + 1})`,
          ) as any)!.style.width = e.clientWidth + (arr.length - 1 === index ? this.getScrollBarWidth() : 0) + 'px';
        });
        document
          .querySelectorAll(`#${this.id} .overflow-scroll`)
          .forEach((e: any) => (e.style.height = this.maxHeight + 'px'));
      });
    }
  }

  loopGetDataset = (e: HTMLElement, key: string): HTMLElement => {
    if (e.parentElement && Object.prototype.hasOwnProperty.call(e.parentElement.dataset, key)) return e.parentElement;
    else if (e.parentElement) return this.loopGetDataset(e.parentElement, key);
    else return e;
  };
  handleHover = (e: any) => {
    if (e.target) {
      const index = parseInt(this.loopGetDataset(e.target as HTMLElement, 'index').dataset.index!) + 1;
      ['left', 'right'].forEach(
        (className) =>
          document
            .querySelector(`#${this.id} .${className} tbody > tr:nth-of-type(${index})`)
            ?.querySelectorAll('td')
            .forEach((td: HTMLTableCellElement) => td.classList.toggle('bg-blue-100')),
      );
    }
  };

  time: any = {};
  statusCollapse: any = {};
  task = this.data;
  handleCollapse = (e: any) => {
    const index = parseInt(this.loopGetDataset(e.target as HTMLElement, 'index').dataset.index);
    const level = parseInt(this.loopGetDataset(e.target as HTMLElement, 'level').dataset.level);
    const reversed = !!this.time[index] && !this.time[index].reversed();
    this.statusCollapse[index] = !reversed;

    if (reversed) this.time[index].reverse();
    else {
      this.time[index] = gsap.timeline({ defaults: { duration: 0.2, ease: 'power1.inOut' } });
      this.time[index].to(e.target, { transform: 'rotate(0deg)' }, '0');
      ['left', 'right'].forEach((className) => {
        let isCollapse = true;
        document.querySelectorAll(`#${this.id} .${className} tbody > tr`).forEach((tr: any) => {
          const trIndex = parseInt(tr.dataset.index);
          const trLevel = parseInt(tr.dataset.level);
          if (isCollapse && trIndex > index) {
            if (trLevel > level) {
              tr.querySelectorAll('td').forEach((td: any) => {
                this.time[index].to(td, { fontSize: '-0px', lineHeight: '-0px', height: '-0px', opacity: '-0' }, '0');
                const svg = td.querySelector('.la-angle-right');
                if (svg) this.time[index].to(svg, { fontSize: '-0px', lineHeight: '-0px' }, '0');
              });
            } else isCollapse = false;
          }
        });
      });
    }

    let isCheck = true;
    let currentLevel: number | undefined;
    this.task = this.task.map((item, trIndex) => {
      if (isCheck && trIndex > index) {
        if (item.level > level) {
          if (currentLevel !== undefined && currentLevel === item.level && !this.statusCollapse[trIndex])
            currentLevel = undefined;
          else if (this.statusCollapse[trIndex] && currentLevel === undefined) currentLevel = item.level;
          item.hidden = this.statusCollapse[index] || (currentLevel !== undefined && currentLevel !== item.level);
        } else isCheck = false;
      }
      return item;
    });
    this.indexTask = -1;
    this.indexTaskObj = {};
  };
  handleScroll = (e: any) => {
    (document.querySelector(`#${this.id} .event`) as any)!.style.top = e.target.scrollTop + 'px';
    ['left', 'right'].forEach((className) =>
      document.querySelector(`#${this.id} .${className} .overflow-scroll`)!.scrollTo({ top: e.target.scrollTop }),
    );
    if (e.target.dataset.scrollX)
      document.querySelector(`#${this.id} ${e.target.dataset.scrollX}`)!.scrollTo({ left: e.target.scrollLeft });
  };

  renderPath = (item: TTask, i: number, id: string, type: 'path' | 'arrow' = 'path') => {
    const endDate = item.endDate || item.startDate.add(i === 0 ? 0 : 1, 'day');
    const startTop = i * 24 + 4 + 8;
    const startLeft = (endDate.diff(this.dateStart, 'day') + this.perRow / 10) * (this.widthColumnDay / this.perRow);
    const listData = this.task.filter((item) => !item.hidden && item.id === id);
    if (listData.length) {
      const data = listData[0];
      const endTop = this.task.filter((item) => !item.hidden).indexOf(data) * 24 + (data.endDate ? 4 : 7);
      const endLeft =
        (data.startDate.diff(this.dateStart, 'day') + (data.endDate ? 0 : 1) + this.perRow / 8) *
          (this.widthColumnDay / this.perRow) +
        (data.endDate ? 3 : data.startDate.diff(endDate) > 0 ? -9 : 3);
      switch (type) {
        case 'arrow':
          return `M ${endLeft + 4.2} ${endTop - 4.5} L ${endLeft - 4.5} ${endTop - 4.5} L ${endLeft + 0.2} ${endTop} Z`;
        default:
          return endDate.diff(data.startDate, 'day') > 1
            ? `M ${startLeft - 1} ${startTop} L ${startLeft + this.widthColumnDay / this.perRow} ${startTop} L ${
                startLeft + this.widthColumnDay / this.perRow
              } ${startTop + 10} L ${endLeft} ${startTop + 10} L ${endLeft} ${endTop} `
            : `M ${startLeft - 1} ${startTop} L ${endLeft} ${startTop} L ${endLeft} ${endTop}`;
      }
    }
    return '';
  };

  filterHidden = (item: any) => !item.hidden;
  widthGantt = (year: string, month: string) =>
    (dayjs()
      .year(parseInt(year))
      .month(parseInt(month))
      .endOf('month')
      .diff(this.date.obj[year][month][this.date.obj[year][month].length - 1], 'days') < this.perRow
      ? dayjs().year(parseInt(year)).month(parseInt(month)).endOf('month').diff(this.date.obj[year][month][0], 'days') >
        this.date.obj[year][month][0].daysInMonth() - (this.widthMonthYear / this.widthColumnDay) * this.perRow
        ? this.date.obj[year][month][0].daysInMonth()
        : dayjs()
            .year(parseInt(year))
            .month(parseInt(month))
            .endOf('month')
            .diff(this.date.obj[year][month][0], 'days') + 1
      : this.date.obj[year][month][this.date.obj[year][month].length - 1].diff(
          this.date.obj[year][month][0].startOf('month'),
          'days',
        ) + this.perRow) *
      (this.widthColumnDay / this.perRow) +
    'px';

  indexTask = -1;
  indexTaskObj: any = {};
  increaseIndexTask = (index: number) => {
    if (this.indexTaskObj[index] === undefined) {
      this.indexTask += 1;
      this.indexTaskObj[index] = this.indexTask;
    }
    return this.indexTaskObj[index];
  };
}
type TTask = {
  id: string;
  name: string;
  assignee?: string;
  status?: string;
  priority?: string;
  planned?: number;
  work?: number;
  startDate: Dayjs;
  endDate?: Dayjs;
  percent?: number;
  level: number;
  success?: string;
  hidden?: boolean;
};
