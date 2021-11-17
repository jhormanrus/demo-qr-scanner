import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import * as printJS from 'print-js';
import { Objeto } from './objeto.model';

/**
  LIBRERÍAS USADAS:
  html5-qrcode                (importado aquí)
  print-js                    (importado aquí)
  @techiediaries/ngx-qrcode   (importado en app.module)
 */ 

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  demoForm: FormGroup
  data: string          //* data para generar qr
  decodedData: Objeto   //* data extraida del scaneo de código qr
  invalid = false       //* true si el qr escaneado es inválido (no es un objeto o no tiene el discriminador correcto 'I-AM-OBJETO')
  notFound = false      //* true si no se concedió permisos al uso de la cámara o el dispositivo no tiene cámara
  html5QrCode: Html5Qrcode

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    //* inicializar formulario de 5 inputs
    this.demoForm = this.fb.group({
      one: this.fb.control('dato 1'),
      two: this.fb.control('dato 2'),
      three: this.fb.control('dato 3'),
      four: this.fb.control('dato 4'),
      five: this.fb.control('dato 5')
    })
    //* inicializar html5QrCode con solo soporte a formato QR (formatsToSupport)
    this.html5QrCode = new Html5Qrcode("reader", { formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE], verbose: false })
    //* inicializar scanner
    this.initScanner()
  }

  initScanner() {
    //* inicializar scanner con preferencia a la camara trasera
    this.html5QrCode.start({ facingMode: 'environment' }, { fps: 10, qrbox: 250 }, (decodedText) => {
      //* try catch si decodedText realmente es un objeto
      try {
        //* parsear decodedText a JSON
        this.decodedData = JSON.parse(decodedText)
        //* si decodedData contiene el discriminador 'I-AM-OBJETO', detiene el scaneo; si no, se marca inválido
        if (this.instanceOfObjeto(this.decodedData)) {
          this.html5QrCode.clear()
        } else {
          this.decodedData = null
          this.invalid = true
        }
      } catch {
        this.invalid = true
      }
    }, null).catch(() => this.notFound = true) //* si scanner no inicializa, se marca como cámara no encontrada
  }

  //* validación si object tiene el discriminador 'I-AM-OBJETO'
  private instanceOfObjeto(object: any): object is Objeto {
    return object.discriminator === 'I-AM-OBJETO'
  }

  generate() {
    //* armar obj con datos del formulario
    const obj: Objeto = {
      discriminator: 'I-AM-OBJETO',
      one: this.demoForm.get('one').value,
      two: this.demoForm.get('two').value,
      three: this.demoForm.get('three').value,
      four: this.demoForm.get('four').value,
      five: this.demoForm.get('five').value,
    }
    //* transformar obj a string
    this.data = JSON.stringify(obj)
  }

  getPermission() {
    //* solicitar permiso al uso de la cámara
    Html5Qrcode.getCameras().then(devices => {
      //* si cámara existe, inicializar scanner
      if (devices && devices.length) {
        this.notFound = false
        this.initScanner()
      }
    })
  }

  printElem() {
    //* imprimir div de id 2print
    printJS('2print', 'html')
  }
}
