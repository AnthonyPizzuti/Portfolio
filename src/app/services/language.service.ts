import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  currentLanguage: 'en' | 'de' = 'en';

  constructor(private translate: TranslateService) {
    const storedLang =
      typeof localStorage !== 'undefined'
        ? (localStorage.getItem('language') as 'en' | 'de')
        : null;
    const lang = storedLang ? storedLang : 'en';
    this.currentLanguage = lang;
    this.translate.setDefaultLang(lang);
    this.translate.use(lang);
  }

  switchLanguage(lang: 'en' | 'de'): void {
    if (lang !== this.currentLanguage) {
      this.currentLanguage = lang;
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('language', lang);
      }
      this.translate.use(lang);
    }
  }
}
