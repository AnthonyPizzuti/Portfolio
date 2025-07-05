import { Component } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about-me',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './about-me.component.html',
  styleUrls: [
    './about-me.component.scss',
    './about-me.component.responsive.scss',
  ],
})
export class AboutMeComponent {
  constructor(private translate: TranslateService) {}
}
