import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import * as printJS from 'print-js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  demoForm: FormGroup
  generatedUrl: string

  constructor(private fb: FormBuilder, private activated: ActivatedRoute) {}

  ngOnInit(): void {
    const onScanSuccess = (decodedText) => {
      html5QrcodeScanner.clear()
      window.location.href = decodedText
    }
    var html5QrcodeScanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250, formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE] }, false)
    html5QrcodeScanner.render(onScanSuccess, null)

    this.activated.queryParams.subscribe(params => {
      if (params.one && params.two && params.three && params.four && params.five) {
        this.demoForm = this.fb.group({
          one: this.fb.control(params.one),
          two: this.fb.control(params.two),
          three: this.fb.control(params.three),
          four: this.fb.control(params.four),
          five: this.fb.control(params.five)
        })
      } else {
        this.demoForm = this.fb.group({
          one: this.fb.control('dato 1'),
          two: this.fb.control('dato 2'),
          three: this.fb.control('dato 3'),
          four: this.fb.control('dato 4'),
          five: this.fb.control('dato 5')
        })
      }
    })
  }

  generateUrl() {
    this.generatedUrl = `${location.origin}/?one=${encodeURIComponent(this.demoForm.get('one').value)}&two=${encodeURIComponent(this.demoForm.get('two').value)}&three=${encodeURIComponent(this.demoForm.get('three').value)}&four=${encodeURIComponent(this.demoForm.get('four').value)}&five=${encodeURIComponent(this.demoForm.get('five').value)}`
  }

  printElem() {
    printJS('2print', 'html')
  }
}
