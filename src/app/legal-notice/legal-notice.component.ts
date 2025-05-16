import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { LegalNoticeService } from '../services/legal-notice.service';
import { FooterComponent } from '../shared/footer/footer.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateService } from '@ngx-translate/core';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-legal-notice',
  standalone: true,
  imports: [CommonModule, RouterModule, FooterComponent, TranslateModule],
  templateUrl: './legal-notice.component.html',
  styleUrls: [
    './legal-notice.component.scss',
    './legal-notice.component.responsive.scss',
  ],
})
export class LegalNoticeComponent implements OnInit, OnDestroy {
  legalNoticeText: SafeHtml = '';
  currentLanguage: 'en' | 'de' = 'en';
  currentSwitchImage: string = '/assets/animations/switch_left.png';

  constructor(
    private legalNoticeService: LegalNoticeService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private translate: TranslateService,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.updateSwitchImage();
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.document.body.classList.add('legal-page');
      const storedLang =
        typeof localStorage !== 'undefined'
          ? (localStorage.getItem('language') as 'en' | 'de')
          : null;
      const lang = storedLang ? storedLang : 'en';
      this.currentLanguage = lang;
      this.translate.setDefaultLang(lang);
      this.translate.use(lang);
      this.updateSwitchImage();
    }

    const rawHtml = this.legalNoticeService.getLegalNotice();
    this.legalNoticeText = this.sanitizer.bypassSecurityTrustHtml(rawHtml);
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.document.body.classList.remove('legal-page');
    }
  }

  goHome(): void {
    this.router.navigate(['/']);
  }

  scrollToSection(sectionId: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      const path = window.location.pathname;
      if (path !== '/home') {
        this.router.navigate(['/home']).then(() => {
          setTimeout(() => {
            const el = this.document.getElementById(sectionId);
            el?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        });
      } else {
        const el = this.document.getElementById(sectionId);
        el?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  switchLanguage(lang: 'en' | 'de'): void {
    if (lang !== this.currentLanguage) {
      this.currentLanguage = lang;
      this.translate.use(lang);
      this.updateSwitchImage();
    }
  }

  updateSwitchImage(): void {
    this.currentSwitchImage =
      this.currentLanguage === 'en'
        ? './../../assets/animations/switch_left.png'
        : './../../assets/animations/switch_right.png';
  }

  goBack(): void {
    this.router.navigate(['/projects']);
  }
}
