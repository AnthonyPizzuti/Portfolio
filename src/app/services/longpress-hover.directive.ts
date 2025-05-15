import { Directive, ElementRef, Renderer2, HostListener } from '@angular/core';

@Directive({
  selector: '[appLongpressHover]',
})
export class LongpressHoverDirective {
  private timeout: any;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('touchstart')
  onTouchStart() {
    this.timeout = setTimeout(() => {
      this.renderer.addClass(this.el.nativeElement, 'longpress-hover');
    }, 500); // 500ms gedrückt halten = longpress
  }

  @HostListener('touchend')
  @HostListener('touchcancel')
  onTouchEnd() {
    clearTimeout(this.timeout);
    this.renderer.removeClass(this.el.nativeElement, 'longpress-hover');
  }
}
