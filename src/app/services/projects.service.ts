import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export interface Project {
  id: string;
  title: string;
  description: string;
  implementationDetails: string;
  duration: string;
  technologies: string[];
  githubLink: string;
  liveLink: string;
  image: string;
  underlineImage?: string;
  underlineWidth?: string;
  underlineHeight?: string;
}

@Injectable({ providedIn: 'root' })
export class ProjectsService {
  constructor(private translate: TranslateService) {}
  private projects: Project[] = [
    {
      id: 'join',
      title: 'Join',
      description: 'JOIN.DESCRIPTION',
      implementationDetails: 'JOIN.IMPLEMENTATION_DETAILS',
      duration: 'JOIN.DURATION',
      technologies: ['CSS', 'HTML', 'Firebase', 'Angular', 'Typescript'],
      githubLink: 'https://github.com/AnthonyPizzuti/Join',
      liveLink: 'https://join.anthony-pizzuti.eu/',
      image: '/assets/animations/join.png',
      underlineImage: '/assets/animations/about_me_underline.png',
      underlineWidth: '150px',
      underlineHeight: '20px',
    },
    {
      id: 'elpolloloco',
      title: 'El Pollo Loco',
      description: 'EL_POLLO_LOCO.DESCRIPTION',
      implementationDetails: 'EL_POLLO_LOCO.IMPLEMENTATION_DETAILS',
      duration: 'EL_POLLO_LOCO.DURATION',
      technologies: ['JavaScript', 'HTML', 'CSS'],
      githubLink: 'https://github.com/AnthonyPizzuti/El-Pollo-Loco-2025',
      liveLink: 'https://elpolloloco.anthony-pizzuti.eu/',
      image: '/assets/animations/el_Pollo_Loco.png',
      underlineImage: '/assets/animations/about_me_underline.png',
      underlineWidth: '850px',
      underlineHeight: '28px',
    },
    {
      id: 'dabubble',
      title: 'DABubble',
      description: 'DABUBBLE.DESCRIPTION',
      implementationDetails: 'DABUBBLE.IMPLEMENTATION_DETAILS',
      duration: 'DABUBBLE.DURATION',
      technologies: ['JavaScript', 'HTML', 'CSS'],
      githubLink: '',
      liveLink: '',
      image: '/assets/animations/dABubble.png',
      underlineImage: '/assets/animations/about_me_underline.png',
      underlineWidth: '350px',
      underlineHeight: '28px',
    },
  ];

  getProjectById(id: string) {
    return this.projects.find((p) => p.id === id);
  }

  getProjects(): Project[] {
    return this.projects;
  }
}
