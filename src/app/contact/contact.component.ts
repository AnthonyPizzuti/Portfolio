import { NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent {
  isError: boolean = false;
  isChecked: boolean = false;
  showError: boolean = false;
  sendButtonDisabled: string = './../../assets/buttons/send-button-disable.png';
  sendButtonEnabled: string = './../../assets/buttons/send-button-enable.png';
  checkBoxDefault: string =
    './../../assets/buttons/check_box_outline_blank.png';
  checkBoxHover: string = './../../assets/buttons/check.png';
  checkBoxChecked: string = './../../assets/buttons/checked.png';
  http = inject(HttpClient);

  contactData = {
    name: '',
    email: '',
    message: '',
  };

  mailTest = true;

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
    if (ngForm.submitted && ngForm.form.valid && !this.mailTest) {
      this.http
        .post(this.post.endPoint, this.post.body(this.contactData))
        .subscribe({
          next: (response) => {
            ngForm.resetForm();
          },
          error: (error) => {
            console.error(error);
          },
          complete: () => console.info('send post complete'),
        });
    } else if (ngForm.submitted && ngForm.form.valid && this.mailTest) {
      ngForm.resetForm();
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
}
