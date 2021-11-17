import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Html5Qrcode, Html5QrcodeScanner, Html5QrcodeSupportedFormats } from 'html5-qrcode';
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

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.demoForm = this.fb.group({
      one: this.fb.control('dato 1'),
      two: this.fb.control('dato 2'),
      three: this.fb.control('dato 3'),
      four: this.fb.control('dato 4'),
      five: this.fb.control('dato 5')
    })
    const html5QrCode = new Html5Qrcode("reader", { formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE], verbose: false })
    html5QrCode.start({ facingMode: 'environment' }, { fps: 10, qrbox: 250 }, (decodedText) => {
      try {
        this.decodedData = JSON.parse(decodedText)
        if (this.instanceOfObjeto(this.decodedData)) {
          html5QrCode.clear()
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
    Html5Qrcode.getCameras()
  }

  printElem() {
    printJS('2print', 'html')
  }
}
