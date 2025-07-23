import { Injectable, signal, computed, effect } from '@angular/core';
import Big from 'big.js';
import { Plant } from '../models/plant';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  blooms = signal<Big>(new Big(0));
  plants = signal<Plant[]>([]);
  lastSave = signal<number>(Date.now());

  bps = computed(() => this.plants().reduce((acc, p) => acc.add(p.production.mul(p.count)), new Big(0)));

  constructor() {
    this.loadSave();
    effect(() => { localStorage.setItem('garden-swarm', JSON.stringify(this.serialize())); }, { allowSignalWrites: true });
    setInterval(() => this.tick(), 1000);
  }

  tick() {
    this.blooms.update(b => b.add(this.bps()));
  }

  buyPlant(plant: Plant) {
    if (this.blooms().gte(plant.cost)) {
      this.blooms.update(b => b.sub(plant.cost));
      // Update plant count logic here
    }
  }

  loadSave() {
    const save = localStorage.getItem('garden-swarm');
    if (save) {
      // Parse and set state; compute offline delta
      const delta = Date.now() - this.lastSave();
      this.blooms.update(b => b.add(this.bps().mul(delta / 1000)));
    } else {
      // Initialize default plants
      this.plants.set([{ id: 'seed', count: new Big(0), production: new Big(1), cost: new Big(10) }]);
    }
    this.lastSave.set(Date.now());
  }

  serialize() {
    return { blooms: this.blooms().toString(), plants: this.plants().map(p => ({ ...p, count: p.count.toString(), production: p.production.toString(), cost: p.cost.toString() })), lastSave: this.lastSave() };
  }
}
