import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss'],
})
export class SkillsComponent {
  animationState: 'closed' | 'opening' | 'open' | 'closing' = 'closed';

  toggleSticker() {
    if (this.animationState === 'closed' || this.animationState === 'closing') {
      this.animationState = 'opening';
      setTimeout(() => (this.animationState = 'open'), 800);
    } else if (
      this.animationState === 'open' ||
      this.animationState === 'opening'
    ) {
      this.animationState = 'closing';
      setTimeout(() => (this.animationState = 'closed'), 800);
    }
  }
}
