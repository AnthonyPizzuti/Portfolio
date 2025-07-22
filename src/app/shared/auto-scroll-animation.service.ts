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
    // Warte bis DOM geladen ist
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => this.scanAndAnimateElements(), 100);
      });
    } else {
      setTimeout(() => this.scanAndAnimateElements(), 100);
    }

    // Beobachte auch dynamische Änderungen
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

    // Definiere welche Elemente automatisch animiert werden sollen
    const selectors = [
      // Hauptsektionen
      'section',
      '.hero-section',
      '.about-section',
      '.skills-section',
      '.projects-section',
      '.contact-section',

      // Überschriften
      'h1:not(.no-animate)',
      'h2:not(.no-animate)',
      'h3:not(.no-animate)',

      // Karten und Container
      '.project-card',
      '.skill-card',
      '.card',
      '.feature-box',

      // Spezielle Portfolio Elemente
      '.project-preview',
      '.skill-item',
      '.timeline-item',
      '.testimonial',

      // Formulare und Buttons
      '.contact-form',
      '.cta-button',
      '.social-links',
    ];

    selectors.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element, index) => {
        // Überspringe bereits animierte Elemente
        if (element.classList.contains('scroll-animated')) return;

        // Bestimme Animation basierend auf Element-Typ und Position
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

    // Spezielle Behandlung für Three-Cards - nur auf Desktop
    if (element.closest('.three-cards-wrapper')) {
      // Prüfe Bildschirmgröße - auf Tablet/Mobile keine Animation
      if (window.innerWidth <= 1200) {
        return 'none'; // Keine Animation auf Mobile
      }
      return 'fade'; // Nur Opacity-Animation für Three-Cards auf Desktop
    }

    // Spezifische Animationen basierend auf Element-Typ
    if (tagName === 'h1') return 'slide-up';
    if (tagName === 'h2') return index % 2 === 0 ? 'slide-left' : 'slide-right';
    if (tagName === 'h3') return 'fade';

    if (className.includes('project-card')) return 'fade';
    if (className.includes('skill-card')) return 'slide-up';
    if (className.includes('hero')) return 'fade';
    if (className.includes('about')) return 'slide-left';
    if (className.includes('skills')) return 'slide-right';
    if (className.includes('contact')) return 'slide-up';

    // Standard Animation basierend auf Position
    return index % 3 === 0
      ? 'slide-up'
      : index % 3 === 1
      ? 'slide-left'
      : 'slide-right';
  }

  private getDelayForElement(element: Element, index: number): number {
    // Gestaffelte Delays für besseren Effekt
    const baseDelay = Math.min(index * 100, 800); // Max 800ms delay

    // Zusätzliche Delays für bestimmte Elemente
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
    // Keine Animation anwenden wenn 'none' zurückgegeben wird
    if (animationType === 'none') {
      return;
    }

    // Füge Animation-Klassen hinzu
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
