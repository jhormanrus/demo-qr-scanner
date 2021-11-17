import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import * as printJS from 'print-js';
import { Objeto } from './objeto.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  demoForm: FormGroup
  data: string
  decodedData: Objeto
  invalid = false
  notFound = false
  html5QrCode: Html5Qrcode

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.demoForm = this.fb.group({
      one: this.fb.control('dato 1'),
      two: this.fb.control('dato 2'),
      three: this.fb.control('dato 3'),
      four: this.fb.control('dato 4'),
      five: this.fb.control('dato 5')
    })
    this.html5QrCode = new Html5Qrcode("reader", { formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE], verbose: false })
    this.initScanner()
  }

  initScanner() {
    this.html5QrCode.start({ facingMode: 'environment' }, { fps: 10, qrbox: 250 }, (decodedText) => {
      try {
        this.decodedData = JSON.parse(decodedText)
        if (this.instanceOfObjeto(this.decodedData)) {
          this.html5QrCode.clear()
        } else {
          this.decodedData = null
          this.invalid = true
        }
      } catch {
        this.invalid = true
      }
    }, null).catch(() => this.notFound = true)
  }

  private instanceOfObjeto(object: any): object is Objeto {
    return object.discriminator === 'I-AM-OBJETO'
  }

  generate() {
    const obj: Objeto = {
      discriminator: 'I-AM-OBJETO',
      one: this.demoForm.get('one').value,
      two: this.demoForm.get('two').value,
      three: this.demoForm.get('three').value,
      four: this.demoForm.get('four').value,
      five: this.demoForm.get('five').value,
    }
    this.data = JSON.stringify(obj)
  }

  getPermission() {
    Html5Qrcode.getCameras().then(devices => {
      if (devices && devices.length) {
        this.notFound = false
        const html5QrCode2 = new Html5Qrcode("reader", { formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE], verbose: false })
        this.initScanner()
      }
    })
  }

  printElem() {
    printJS('2print', 'html')
  }
}
