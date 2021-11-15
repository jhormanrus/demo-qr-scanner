import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from 'html5-qrcode';
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

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.demoForm = this.fb.group({
      one: this.fb.control('dato 1'),
      two: this.fb.control('dato 2'),
      three: this.fb.control('dato 3'),
      four: this.fb.control('dato 4'),
      five: this.fb.control('dato 5')
    })

    const onScanSuccess = (decodedText) => {
      try {
        this.decodedData = JSON.parse(decodedText)
        if (this.instanceOfObjeto(this.decodedData)) {
          this.invalid = false
          this.demoForm.patchValue({
            one: this.decodedData.one,
            two: this.decodedData.two,
            three: this.decodedData.three,
            four: this.decodedData.four,
            five: this.decodedData.five
          })
        } else {
          this.invalid = true
        }
      } catch {
        this.invalid = true
      }
    }
    var html5QrcodeScanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250, formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE] }, false)
    html5QrcodeScanner.render(onScanSuccess, null)
  }

  private instanceOfObjeto(object: any): object is Objeto {
    return object.discriminator === 'I-AM-OBJETO'
  }

  generate() {
    const obj: Objeto = {
      discriminator: 'I-AM-OBJECTO',
      one: this.demoForm.get('one').value,
      two: this.demoForm.get('two').value,
      three: this.demoForm.get('three').value,
      four: this.demoForm.get('four').value,
      five: this.demoForm.get('five').value,
    }
    this.data = JSON.stringify(obj)
  }

  printElem() {
    printJS('2print', 'html')
  }
}
