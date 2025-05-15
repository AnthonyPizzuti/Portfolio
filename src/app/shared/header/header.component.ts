import { CommonModule } from '@angular/common';
import { Component, Input, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
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
