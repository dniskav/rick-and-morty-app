import { Directive, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appTableSort]',
  standalone: true
})
export class TableSortDirective {
  @Input() appTableSort: string = ''; 
  @Output() sort = new EventEmitter<{ column: string, direction: number }>();

  private currentSort: number = 0; 

  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.setInitialIcon();
  }

  @HostListener('click') onClick() {
    this.toggleSort();
    this.emitSortEvent();
  }

  private setInitialIcon() {
    this.renderer.setProperty(this.el.nativeElement, 'textContent', '⮃');
  }

  private toggleSort() {
    if (this.currentSort <= 0) {
      this.currentSort = 1;
      this.renderer.setProperty(this.el.nativeElement, 'textContent', '⇩');
    } else {
      this.currentSort = -1;
      this.renderer.setProperty(this.el.nativeElement, 'textContent', '⇧');
    }
  }

  private emitSortEvent() {
    this.sort.emit({ column: this.appTableSort, direction: this.currentSort });
  }
}
