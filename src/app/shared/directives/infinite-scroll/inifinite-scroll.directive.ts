import {
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  signal
} from '@angular/core';
import {
  fromEvent,
  map,
  throttleTime,
  pairwise,
  startWith,
  filter,
  Subscription
} from 'rxjs';

@Directive({
  selector: '[infiniteScroll]',
  standalone: true
})
export class InfiniteScrollDirective implements OnInit, OnDestroy {
  @Output() closeToBottom = new EventEmitter();
  @Input() threshold = 100;

  private scrollTop = signal<number>(0);
  private subscriptions: Subscription[] = [];

  constructor(private el: ElementRef) {}

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  ngOnInit(): void {
    this.initScrollEvent();
  }

  initScrollEvent(): void {
    const scroll$ = fromEvent(this.el.nativeElement, 'scroll').pipe(
      map(() => this.el.nativeElement.scrollTop)
    );
    const wheel$ = fromEvent(this.el.nativeElement, 'wheel').pipe(
      map(() => this.el.nativeElement.scrollTop)
    );
    const touchMove$ = fromEvent(this.el.nativeElement, 'touchmove').pipe(
      map(() => this.el.nativeElement.scrollTop)
    );

    this.subscriptions.push(
      scroll$
        .pipe(
          throttleTime(200),
          startWith(0),
          pairwise(),
          filter(([prev, curr]) => this.isUserScrollingDown(prev, curr)),
          map(() => this.onScroll())
        )
        .subscribe((isNearBottom) => {
          if (isNearBottom) {
            this.closeToBottom.emit();
          }
        })
    );

    this.subscriptions.push(
      wheel$
        .pipe(
          throttleTime(200),
          startWith(0),
          pairwise(),
          filter(([prev, curr]) => this.isUserScrollingDown(prev, curr)),
          map(() => this.onScroll())
        )
        .subscribe((isNearBottom) => {
          if (isNearBottom) {
            this.closeToBottom.emit();
          }
        })
    );

    this.subscriptions.push(
      touchMove$
        .pipe(
          throttleTime(200),
          startWith(0),
          pairwise(),
          filter(([prev, curr]) => this.isUserScrollingDown(prev, curr)),
          map(() => this.onScroll())
        )
        .subscribe((isNearBottom) => {
          if (isNearBottom) {
            this.closeToBottom.emit();
          }
        })
    );
  }

  private isUserScrollingDown(previous: number, current: number): boolean {
    return current > previous;
  }

  private onScroll(): boolean {
    const scrollTop = this.el.nativeElement.scrollTop;
    const scrollHeight = this.el.nativeElement.scrollHeight;
    const clientHeight = this.el.nativeElement.clientHeight;
    return scrollTop + clientHeight >= scrollHeight - this.threshold;
  }
}
