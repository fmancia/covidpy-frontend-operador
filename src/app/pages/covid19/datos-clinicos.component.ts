import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Subscription } from 'rxjs';
import { Covid19Service } from '../../services/Covid19Service';

import {FormDatosClinicos} from './model/formDatosClinicos.model';

declare var $: any;

@Component({
  selector: "datos-clinicos-selector",
  templateUrl: "./datos-clinicos.component.html",
  providers: [Covid19Service]
})
export class DatosClinicosComponent implements OnInit {

  public loading: boolean;
  public mensaje: string;

  //Formulario
  public formDatosClinicos: FormDatosClinicos;

  //Datos del formulario 
  public empresaTransporte: string;
  public tipoTransporte: string;
  public nroAsiento: string;
  public fechaPartida: Date;
  public fechaLlegada: Date;
  public ocupacion: string;
  public paisOrigenOptions=[{value:0,label:'Argentina'},{value:1,label:'Brasil'},{value:2,label:'Bolivia'},{value:3,label:'Uruguay'}];
  public paisOrigen: any;
  public ciudadOrigen: string;
  public paisesCirculacion: string;
  public sintomasFiebre: boolean;
  public sintomasTos: boolean = false;
  public dificultadRespirar: boolean;
  public dolorGarganta: boolean;
  public declarationAgreement: boolean;
  public sintomasOtro: string;

  private subscription: Subscription;
  public recaptchaAvailable = false;
  public telefValido: boolean;

  public idRegistro: number;
  public codigoVerif: string;

  constructor(
    private _router: Router,
    private service: Covid19Service,
    private _route: ActivatedRoute
  ) {
    this.loading = false;
    if (typeof localStorage !== "undefined") {
      localStorage.clear();
    }
  }

  ngOnInit() {
    console.log("datos clinicos");
    this.formDatosClinicos = new FormDatosClinicos();
    this.formDatosClinicos.sintomasFiebreValor='35.5';
    this._route.params.subscribe(params => {
      this.formDatosClinicos.idRegistro = params["idRegistro"];
      this.codigoVerif = params["codigoVerif"];
    });
    window.scrollTo(0, 0);
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  enviar(formDatosClinicos){
    this.service.registrarPaciente
    this.loading = true;
      this.service.guardarDatosClinicos(formDatosClinicos).subscribe(response => {
            
              this.loading = false;
              this.mensaje = "Se ha registrado con Éxito";
              //this.openMessageDialog();
              localStorage.setItem('token',response);
              //window.open("https://app.coronavirus.gov.py/login?token="+response);
              //this._router.navigate(["covid19/aislamiento/mensaje-final/"]);
              window.location.href = 'https://appcoronavirus.mspbs.gov.py/login?token='+response+'&redirect=/reporte-medico';
          }, error => {
            this.loading = false;
            this.mensaje = error.error;
            this.openMessageDialog();
            
          }
      );
  }
  
  openMessageDialog() {
    setTimeout(function() { $("#miModal").modal("toggle"); }, 1000);
  }

  keyPress(event: any) { 
    const pattern = /[0-9\+\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (pattern.test(inputChar)) {
      this.telefValido = true;
    }else {
      this.telefValido = false;
    }
  }

}
