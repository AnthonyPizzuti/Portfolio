import { NgIf, CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    RouterModule,
    TranslateModule,
    CommonModule,
    HttpClientModule,
  ],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent {
  showSuccess = false;
  isError: boolean = false;
  isChecked: boolean = false;
  showError: boolean = false;
  checkBoxDefault: string =
    './../../assets/buttons/check_box_outline_blank.png';
  checkBoxHover: string = './../../assets/buttons/check.png';
  checkBoxChecked: string = './../../assets/buttons/checked.png';
  http = inject(HttpClient);
  showPrivacyPolicy: boolean = false;

  private router: Router = inject(Router);
  private translate: TranslateService = inject(TranslateService);
  private successTimer?: ReturnType<typeof setTimeout>;

  constructor() {}

  contactData = {
    name: '',
    email: '',
    message: '',
  };

  post = {
    endPoint: 'https://anthony-pizzuti.eu/sendMail.php',
    body: (payload: any) => JSON.stringify(payload),
    options: {
      headers: {
        'Content-Type': 'text/plain',
        responseType: 'text',
      },
    },
  };

  onSubmit(ngForm: NgForm) {
    if (ngForm.submitted && ngForm.form.valid) {
      this.http
        .post(this.post.endPoint, this.post.body(this.contactData))
        .subscribe({
          next: (response) => {
            ngForm.resetForm();
            this.triggerSuccessMessage();
          },
          error: (error) => {
            console.error(error);
          },
          complete: () => console.info('send post complete'),
        });
    }
  }

  validateInput(): void {
    this.isError = this.contactData.name.trim() === '';
  }

  toggleCheckbox() {
    this.isChecked = !this.isChecked;
  }

  validateCheckbox(): void {
    this.showError = !this.isChecked;
  }

  getCheckboxImage(): string {
    if (this.isChecked) {
      return this.checkBoxChecked;
    }
    return this.checkBoxDefault;
  }

  openPrivacyPolicy(): void {
    this.showPrivacyPolicy = true;
  }

  closePrivacyPolicy(): void {
    this.showPrivacyPolicy = false;
  }

  private triggerSuccessMessage() {
    this.showSuccess = true;
    if (this.successTimer) {
      clearTimeout(this.successTimer);
    }
    this.successTimer = setTimeout(() => {
      this.showSuccess = false;
      this.successTimer = undefined;
    }, 5000);
  }
}
