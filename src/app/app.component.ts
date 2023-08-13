import { Component } from '@angular/core';
import { Data } from 'src/model/data';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'zerodha-statement';
  public data: Data = new Data();

  constructor(private http: HttpClient) {

  }

  downloadStatement() {
    if(!this.data.userId) {
      alert('User Id is mandatory')
      return;
    } else if(!this.data.password) {
      alert('Password is mandatory')
      return;
    } else if(!this.data.mobileAppCode) {
      alert('App Code is mandatory')
      return;
    } else if(!this.data.dateFrom) {
      alert('From Date is mandatory')
      return;
    } else if(!this.data.dateTo) {
      alert('To Date is mandatory')
      return;
    }
    this.data.password = CryptoJS.AES.encrypt(this.data.password, 'ZaRo-ENcRypt_kYe').toString();
    let headers = new HttpHeaders();
    headers = headers.append('content-type', 'application/json');
    this.http.post(environment.url, this.data, {responseType: 'blob', headers: headers}).pipe().subscribe((data: any) => {
      if (data != null) {
        var newBlob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
        const data1 = window.URL.createObjectURL(newBlob);
        var link = document.createElement('a');
        link.href = data1;
        link.download = 'statement.docx';
        link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
        setTimeout(function () {
          window.URL.revokeObjectURL(data1);
          link.remove();
        }, 100);
      }
    });
  }
}
