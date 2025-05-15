import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutMeComponent } from '../about-me/about-me.component';
import { SkillsComponent } from '../skills/skills.component';
import { ProjectsComponent } from '../projects/projects.component';
import { ContactComponent } from '../contact/contact.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { HeaderComponent } from '../shared/header/header.component';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from './../services/language.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    AboutMeComponent,
    SkillsComponent,
    ProjectsComponent,
    ContactComponent,
    FooterComponent,
    TranslateModule,
  ],
  template: `
    <app-header></app-header>
    <app-about-me></app-about-me>
    <app-skills></app-skills>
    <app-projects></app-projects>
    <app-contact></app-contact>
    <app-footer></app-footer>
  `,
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  currentLanguage: 'en' | 'de' = 'en';
  currentSwitchImage: string = '/assets/animations/switch_left.png';

  constructor(private router: Router, private languageService: LanguageService) {
  }
}