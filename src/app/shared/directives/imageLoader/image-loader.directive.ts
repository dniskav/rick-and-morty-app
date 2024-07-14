import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appImageLoader]',
  standalone: true
})
export class ImageLoaderDirective implements OnInit{
  @Input() appImageLoader: string = '';
  @Input() defaultImage: string = '';

  constructor(private el: ElementRef, private renderer: Renderer2) { }
  
  ngOnInit(): void {
    const imgElement: HTMLImageElement = this.el.nativeElement;
    const realImage = new Image();

    this.renderer.setAttribute(imgElement, 'src', this.defaultImage);
    this.renderer.addClass(imgElement, 'skeleton');

    realImage.src = this.appImageLoader;

    realImage.onload = () => {
      this.renderer.setAttribute(imgElement, 'src', this.appImageLoader);
      this.renderer.removeClass(imgElement, 'skeleton');
      this.renderer.addClass(imgElement, 'loaded');
    };

    realImage.onerror = () => console.log('error loading', this.appImageLoader)
  }
}
