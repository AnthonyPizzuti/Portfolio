import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  currentLanguage: string = 'en';

  switchLanguage(lang: string) {
    this.currentLanguage = lang;
    document.documentElement.lang = lang;
    // Hier kannst du eine Übersetzungslogik einfügen
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
