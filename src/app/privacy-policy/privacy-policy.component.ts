import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  OnDestroy,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { PrivacyPolicyService } from '../services/privacy-policy.service';
import { FooterComponent } from '../shared/footer/footer.component';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateService } from '@ngx-translate/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [RouterModule, CommonModule, FooterComponent, TranslateModule],
  templateUrl: './privacy-policy.component.html',
  styleUrls: [
    './privacy-policy.component.scss',
    './privacy-policy.component.responsive.scss',
  ],
})
export class PrivacyPolicyComponent implements OnInit, OnDestroy {
  privacyPolicyText: string = '';
  currentLanguage: 'en' | 'de' = 'en';
  currentSwitchImage: string = '/assets/animations/switch_left.png';

  constructor(
    private privacyPolicyService: PrivacyPolicyService,
    private router: Router,
    private translate: TranslateService,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.updateSwitchImage();
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.document.body.classList.add('privacy-page');
      const storedLang = localStorage.getItem('language') as 'en' | 'de' | null;
      const lang = storedLang ?? 'en';
      this.currentLanguage = lang;
      this.translate.setDefaultLang(lang);
      this.translate.use(lang);
      this.updateSwitchImage();
    }

    this.privacyPolicyText = this.privacyPolicyService.getPrivacyPolicy();
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.document.body.classList.remove('privacy-page');
    }
  }

  goHome(): void {
    this.router.navigate(['/']);
  }

  scrollToSection(sectionId: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (window.location.pathname !== '/home') {
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
