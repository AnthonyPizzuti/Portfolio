import { CommonModule } from '@angular/common';
import { Component, Input, Inject, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../../services/language.service';
import {
  trigger,
  transition,
  query,
  style,
  stagger,
  animate,
} from '@angular/animations';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './header.component.html',
  styleUrls: [
    './header.component.scss',
    './header.component.nav-links.scss',
    './header.component.mobile-menu.scss',
    './header.component.responsive.scss',
  ],
  animations: [
    trigger('typeWrite', [
      transition(':enter', [
        query(
          '.letter-big, .letter-small',
          [
            style({ opacity: 0, transform: 'translateY(5px)' }),
            stagger('80ms', [
              animate(
                '200ms ease-out',
                style({ opacity: 1, transform: 'none' })
              ),
            ]),
          ],
          { optional: true }
        ),
      ]),
    ]),
  ],
})
export class HeaderComponent implements AfterViewInit {
  constructor(
    private router: Router,
    private languageService: LanguageService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.currentLanguage = this.languageService.currentLanguage;
    this.updateSwitchImage();
  }

  @Input() isDetailRoute = false;
  currentLanguage: 'en' | 'de' = 'en';
  currentSwitchImage = '/assets/animations/switch_left.png';
  isNavOpen: boolean = false;
  showTitle = false;

  ngAfterViewInit() {
    setTimeout(() => (this.showTitle = true), 0);
  }

  switchLanguage(lang: 'en' | 'de'): void {
    if (lang !== this.currentLanguage) {
      this.languageService.switchLanguage(lang);
      this.currentLanguage = lang;
      this.updateSwitchImage();
    }
  }

  updateSwitchImage(): void {
    this.currentSwitchImage =
      this.currentLanguage === 'en'
        ? './../../assets/animations/switch_left.png'
        : './../../assets/animations/switch_right.png';
  }

  scrollToTop(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  goHome(): void {
    this.router.navigate(['/']);
  }

  toggleNav(): void {
    this.isNavOpen = !this.isNavOpen;
  }
}
