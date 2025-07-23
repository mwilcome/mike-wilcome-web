import { Injectable, signal, computed, effect } from '@angular/core';
import Big from 'big.js';
import { Plant } from '@core/models/plant';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  blooms = signal<Big>(new Big(0));
  plants = signal<Plant[]>([]);
  lastSave = signal<number>(Date.now());
  isLoaded = signal<boolean>(false);

  bps = computed(() => this.plants().reduce((acc, p) => acc.add(p.production.mul(p.count)), new Big(0)));

  constructor() {
    this.loadSave();
    effect(() => { localStorage.setItem('garden-swarm', JSON.stringify(this.serialize())); }, { allowSignalWrites: true });
    setInterval(() => this.tick(), 1000);
  }

  tick() {
    this.blooms.update(b => b.add(this.bps()));
    this.lastSave.set(Date.now());
  }

  buyPlant(id: string) {
    const plant = this.plants().find(p => p.id === id);
    if (plant && this.blooms().gte(plant.cost)) {
      this.blooms.update(b => b.sub(plant.cost));
      this.plants.update(plants => plants.map(p => p.id === id ? { ...p, count: p.count.add(1) } : p));
      plant.cost = plant.cost.mul(1.1); // Exponential cost increase
    }
  }

  canAfford(plant: Plant): boolean {
    return this.blooms().gte(plant.cost);
  }

  loadSave() {
    const save = localStorage.getItem('garden-swarm');
    if (save) {
      const parsed = JSON.parse(save);
      this.blooms.set(new Big(parsed.blooms));
      this.plants.set(parsed.plants.map((p: any) => ({ id: p.id, count: new Big(p.count), production: new Big(p.production), cost: new Big(p.cost) })));
      const delta = (Date.now() - parsed.lastSave) / 1000;
      this.blooms.update(b => b.add(this.bps().mul(delta)));
    } else {
      this.plants.set([
        { id: 'seed', count: new Big(0), production: new Big(1), cost: new Big(10) },
        { id: 'flower', count: new Big(0), production: new Big(10), cost: new Big(100) },
        { id: 'tree', count: new Big(0), production: new Big(100), cost: new Big(1000) }
      ]);
    }
    this.isLoaded.set(true);
    this.lastSave.set(Date.now());
  }

  serialize() {
    return {
      blooms: this.blooms().toString(),
      plants: this.plants().map(p => ({ id: p.id, count: p.count.toString(), production: p.production.toString(), cost: p.cost.toString() })),
      lastSave: this.lastSave()
    };
  }
}
