import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectsService, Project } from '../services/projects.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../services/language.service';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './project-details.component.html',
  styleUrls: [
    './project-details.component.scss',
    './project-details.component.responsive.scss',
    './project-details.component.nav-links.scss',
  ],
})
export class ProjectDetailsComponent implements OnInit, OnDestroy {
  projectId: string = '';
  project: Project | undefined;
  currentLanguage: 'en' | 'de' = 'en';
  currentSwitchImage = '/assets/animations/switch_left.png';
  isNavOpen: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectsService: ProjectsService,
    private translate: TranslateService,
    private languageService: LanguageService,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.currentLanguage = this.languageService.currentLanguage;
    this.updateSwitchImage();
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.document.body.classList.add('no-body-padding');
    }
    this.currentLanguage = this.languageService.currentLanguage;
    this.translate.use(this.currentLanguage);
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.project = this.projectsService.getProjectById(id);
      }
    });
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.document.body.classList.remove('no-body-padding');
    }
  }

  goHome(): void {
    this.router.navigate(['/']);
  }

  toggleNav(): void {
    this.isNavOpen = !this.isNavOpen;
  }

  scrollToSection(sectionId: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    const path = window.location.pathname;
    const scroll = () => {
      const el = this.document.getElementById(sectionId);
      el?.scrollIntoView({ behavior: 'smooth' });
    };
    if (path !== '/home') {
      this.router.navigate(['/home']).then(() => {
        setTimeout(scroll, 100);
      });
    } else {
      scroll();
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

  goToNextProject(): void {
    const projects = this.projectsService.getProjects();
    if (!this.project) return;
    const currentIndex = projects.findIndex((p) => p.id === this.project!.id);
    const nextIndex = (currentIndex + 1) % projects.length;
    const nextProject = projects[nextIndex];
    this.router.navigate(['/projects', nextProject.id]);
  }

  goBack(): void {
    this.router.navigate(['/projects']);
  }
}
