import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateService } from '@ngx-translate/core';
import { AutoScrollAnimationService } from './shared/auto-scroll-animation.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule, TranslateModule],
  template: ` <router-outlet></router-outlet> `,
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  @ViewChild('contactSection') contactSection!: ElementRef;
  currentLanguage: 'en' | 'de' = 'en';
  currentSwitchImage: string = '/assets/animations/switch_left.png';
  isDetailRoute = false;

  constructor(private router: Router, private translate: TranslateService, private autoScrollService: AutoScrollAnimationService) {
    const storedLang = (typeof localStorage !== 'undefined') ? localStorage.getItem('language') as 'en' | 'de' : null;
    const lang = storedLang ? storedLang : 'en';
    this.currentLanguage = lang;
    this.translate.setDefaultLang(lang);
    this.translate.use(lang);
    this.updateSwitchImage();

    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        )
      )
      .subscribe((event: NavigationEnd) => {
        this.isDetailRoute =
          event.urlAfterRedirects.startsWith('/projects/') &&
          event.urlAfterRedirects !== '/projects';
      });
  }

  scrollToContact() {
    this.contactSection.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

  switchLanguage(lang: 'en' | 'de'): void {
    if (lang !== this.currentLanguage) {
      this.currentLanguage = lang;
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('language', lang);
      }
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
}
