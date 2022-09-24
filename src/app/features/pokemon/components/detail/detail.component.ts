
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Pokemon } from '../../interfaces/pokemon.interface';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
})
export class DetailComponent implements OnInit {
  @Input() pokemon: Pokemon;
  @Output() updatePokemon = new EventEmitter<void>();
  @Output() deletePokemon = new EventEmitter<void>();

  constructor() {}

  ngOnInit(): void {}

  update() {
    this.updatePokemon.emit();
  }

  delete() {
    this.deletePokemon.emit();
  }
}