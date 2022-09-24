import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil, tap } from 'rxjs/operators';

import { FormComponent } from './components/form/form.component';
import { MatDialog } from '@angular/material/dialog';
import { PokedexFirestoreService } from 'src/app/core/pokedex-firestore.service';
import { Pokemon } from './interfaces/pokemon.interface';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-pokemon',
  templateUrl: './pokemon.component.html',
  styleUrls: ['./pokemon.component.css'],
})
export class PokemonComponent implements OnInit {
  allPokemon$: Observable<Pokemon[]>;
  selectedPokemon?: Pokemon;
  destroyed$ = new Subject<void>();

  constructor(
    private readonly pokedexService: PokedexFirestoreService,
    private readonly dialog: MatDialog,
    db: AngularFirestore
  ) {}

  ngOnInit(): void {
    this.allPokemon$ = this.pokedexService.getAll();
  }

  addPokemon() {
    const dialogRef = this.dialog.open(FormComponent, {
      data: {},
      width: '40%',
    });

    dialogRef
      .afterClosed()
      .pipe(
        filter(Boolean),
        tap((pokemon) => this.pokedexService.create(pokemon as Pokemon)),
        takeUntil(this.destroyed$)
      )
      .subscribe();
  }

  updatePokemon() {
    const dialogRef = this.dialog.open(FormComponent, {
      data: { ...this.selectedPokemon },
      width: '40%',
    });

    dialogRef
      .afterClosed()
      .pipe(
        filter(Boolean),
        tap((pokemon) => this.pokedexService.update(pokemon as Pokemon)),
        tap((pokemon) => this.selectPokemon(pokemon as Pokemon)),
        takeUntil(this.destroyed$)
      )
      .subscribe();
  }

  selectPokemon(pokemon: Pokemon) {
    this.selectedPokemon = pokemon;
  }

  deletePokemon() {
    this.pokedexService.delete(this.selectedPokemon!.id);
    this.selectedPokemon = undefined;
  }

  ngOnDestroy() {
    this.destroyed$.next();
  }
}
