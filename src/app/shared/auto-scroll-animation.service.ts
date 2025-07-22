import { Injectable, ElementRef, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AutoScrollAnimationService {
  private observer!: IntersectionObserver;
  private animatedElements = new Map<Element, boolean>();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.initializeObserver();
      this.autoInitialize();
    }
  }

  private initializeObserver(): void {
    const options = {
      root: null,
      rootMargin: '-10% 0px -10% 0px',
      threshold: [0, 0.1, 0.3, 0.7, 1],
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const element = entry.target;
        const isVisible = entry.isIntersecting && entry.intersectionRatio > 0.1;
        if (isVisible) {
          this.enterElement(element);
        } else {
          this.leaveElement(element);
        }
      });
    }, options);
  }

  private autoInitialize(): void {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => this.scanAndAnimateElements(), 100);
      });
    } else {
      setTimeout(() => this.scanAndAnimateElements(), 100);
    }
    const mutationObserver = new MutationObserver(() => {
      setTimeout(() => this.scanAndAnimateElements(), 50);
    });
    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  private scanAndAnimateElements(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const selectors = [
      'section',
      '.hero-section',
      '.about-section',
      '.skills-section',
      '.projects-section',
      '.contact-section',
      'h1:not(.no-animate)',
      'h2:not(.no-animate)',
      'h3:not(.no-animate)',
      '.project-card',
      '.skill-card',
      '.card',
      '.feature-box',
      '.project-preview',
      '.skill-item',
      '.timeline-item',
      '.testimonial',
      '.contact-form',
      '.cta-button',
      '.social-links',
    ];

    selectors.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element, index) => {
        if (element.classList.contains('scroll-animated')) return;
        const animationType = this.getAnimationTypeForElement(element, index);
        const delay = this.getDelayForElement(element, index);
        this.applyAnimationToElement(
          element as HTMLElement,
          animationType,
          delay
        );
      });
    });
  }

  private getAnimationTypeForElement(element: Element, index: number): string {
    const tagName = element.tagName.toLowerCase();
    const className = element.className;
    if (element.closest('.three-cards-wrapper')) {
      if (window.innerWidth <= 768) {
        return 'none';
      }
      return 'fade';
    }
    if (tagName === 'h1') return 'slide-up';
    if (tagName === 'h2') return index % 2 === 0 ? 'slide-left' : 'slide-right';
    if (tagName === 'h3') return 'fade';
    if (className.includes('project-card')) return 'fade';
    if (className.includes('skill-card')) return 'slide-up';
    if (className.includes('hero')) return 'fade';
    if (className.includes('about')) return 'slide-left';
    if (className.includes('skills')) return 'slide-right';
    if (className.includes('contact')) return 'slide-up';
    return index % 3 === 0
      ? 'slide-up'
      : index % 3 === 1
      ? 'slide-left'
      : 'slide-right';
  }

  private getDelayForElement(element: Element, index: number): number {
    const baseDelay = Math.min(index * 100, 800);
    if (element.classList.contains('project-card')) {
      return baseDelay + (index % 4) * 150;
    }
    return baseDelay;
  }

  private applyAnimationToElement(
    element: HTMLElement,
    animationType: string,
    delay: number
  ): void {
    if (animationType === 'none') {
      return;
    }
    element.classList.add('scroll-animated', `scroll-${animationType}`);
    if (delay > 0) {
      element.style.setProperty('--animation-delay', `${delay}ms`);
    }
    element.classList.add('animate-out');
    this.observer.observe(element);
  }

  private enterElement(element: Element): void {
    element.classList.remove('animate-leave', 'animate-out');
    element.classList.add('animate-enter', 'animate-in');
    this.animatedElements.set(element, true);
    element.dispatchEvent(
      new CustomEvent('scrollEnter', {
        detail: { element, action: 'enter' },
      })
    );
  }

  private leaveElement(element: Element): void {
    if (this.animatedElements.get(element)) {
      const keepVisible =
        element.tagName.toLowerCase() === 'h1' ||
        element.tagName.toLowerCase() === 'h2' ||
        element.classList.contains('keep-visible');
      if (!keepVisible) {
        element.classList.remove('animate-enter', 'animate-in');
        element.classList.add('animate-leave', 'animate-out');
        element.dispatchEvent(
          new CustomEvent('scrollLeave', {
            detail: { element, action: 'leave' },
          })
        );
      }
    }
  }

  public enableAnimationForElement(
    element: HTMLElement,
    animationType: string = 'fade'
  ): void {
    this.applyAnimationToElement(element, animationType, 0);
  }

  public disableAnimationForElement(element: HTMLElement): void {
    element.classList.add('no-animate');
    this.observer.unobserve(element);
  }

  public destroy(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.animatedElements.clear();
    }
  }
}
