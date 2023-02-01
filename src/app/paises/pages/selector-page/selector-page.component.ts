import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { switchMap, tap } from 'rxjs';
import { PaisSmall } from '../../interfaces/paises.interface';
import { PaisesService } from '../../services/paises.service';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styleUrls: ['./selector-page.component.css']
})
export class SelectorPageComponent implements OnInit {

  miFormulario: FormGroup = this.fb.group({
    region: ['', Validators.required],
    pais: ['', Validators.required],
    frontera: ['', Validators.required],
  })

  regiones: string[] = [];
  paises: PaisSmall[] = [];
  //fronteras: string[] = [];
  fronteras: PaisSmall[] = [];

  cargando: boolean = false;

  constructor(private fb: FormBuilder,
              private paisesService: PaisesService) { }

  ngOnInit(): void {

    this.regiones = this.paisesService.regiones;

    // this.miFormulario.get('region')?.valueChanges
    //   .subscribe(region => {

    //     this.paisesService.getPaisesPorRegion(region)
    //       .subscribe(paises => {
    //         this.paises = paises;
    //       })
    //   })

    // Cuando cambia la región
    this.miFormulario.get('region')?.valueChanges
      .pipe(
        tap((_) => {
          this.miFormulario.get('pais')?.reset('');
          this.cargando = true;
        }),
        switchMap(region => this.paisesService.getPaisesPorRegion(region))
      )
      .subscribe(paises => {
        this.paises = paises;
        this.cargando = false;
      })    

      // Cuando cambia el país
      this.miFormulario.get('pais')?.valueChanges
        .pipe(
          tap(() => {
            this.fronteras = [];
            this.miFormulario.get('frontera')?.reset('');
            this.cargando = true;
          }),
          switchMap(codigo => this.paisesService.gepPaisPorCodigo(codigo)),
          switchMap(pais => this.paisesService.getPaisesPorCodigos(pais?.borders!))
        )
        .subscribe(paises => {
          //this.fronteras = pais?.borders || [];
          this.fronteras = paises;
          this.cargando = false;
        })
  }

  guardar() {
    console.log('mi formulario')
  }

}
