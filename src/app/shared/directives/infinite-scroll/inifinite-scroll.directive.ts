import {
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  filter,
  fromEvent,
  map,
  pairwise,
  startWith,
  throttleTime,
} from 'rxjs';
import { SubSink } from 'subsink';

@Directive({
  selector: '[inifiniteScroll]',
  standalone: true,
})
export class InifiniteScrollDirective implements OnInit, OnDestroy {
  @Output() closeToBottom = new EventEmitter();
  @Input() threshold = 100;

  private window!: Window;
  private subs = new SubSink();

  constructor(private el: ElementRef) {}

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
    this.initScrollEvent ();
  }
  
  initScrollEvent (): void {
    const scroll$ = fromEvent(this.el.nativeElement, 'scroll').pipe(map(() => this.el.nativeElement.scrollTop));
    const wheel$ = fromEvent(this.el.nativeElement, 'wheel').pipe(map(() => this.el.nativeElement.scrollTop));
    const touchMove$ = fromEvent(this.el.nativeElement, 'touchmove').pipe(map(() => this.el.nativeElement.scrollTop));

    this.subs.sink = scroll$
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
    });

    this.subs.sink = wheel$
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
      });

      this.subs.sink = touchMove$
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
      });
  }

  private isUserScrollingDown(previous: number, current: number): boolean {
    return current > previous;
  }

  onScroll(): boolean {
    const scrollTop = this.el.nativeElement.scrollTop; 
    const scrollHeight = this.el.nativeElement.scrollHeight; 
    const clientHeight = this.el.nativeElement.clientHeight; 
    return scrollTop + clientHeight >= scrollHeight - this.threshold; 
  }
}
