import { Injectable, signal, computed, effect } from '@angular/core';
import Big from 'big.js';
import { Plant, Seed } from '@core/models/plant';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  blooms = signal<Big>(new Big(0));
  plants = signal<Plant[]>([]);
  seeds = signal<Seed[]>([]); // New: Seed inventory for planting in grid
  weather = signal<'sunny' | 'rainy' | 'stormy'>('sunny'); // New: Weather affects production
  essence = signal<Big>(new Big(0)); // New: Prestige currency for permanent buffs
  lastSave = signal<number>(Date.now());
  isLoaded = signal<boolean>(false);
  offlineGains = signal<Big>(new Big(0));

  // New: Multiplier based on weather
  weatherMultiplier = computed(() => {
    switch (this.weather()) {
      case 'rainy': return new Big(1.5); // Boost growth
      case 'stormy': return new Big(0.5); // Debuff
      default: return new Big(1); // Sunny: normal
    }
  });

  // New: Global multiplier from essence (e.g., +5% per essence)
  globalMultiplier = computed(() => new Big(1).add(this.essence().mul(0.05)));

  // Updated: BPS now factors in weather and global multipliers
  bps = computed(() => this.plants().reduce((acc, p) => acc.add(p.production.mul(p.count)), new Big(0))
    .mul(this.weatherMultiplier())
    .mul(this.globalMultiplier()));

  constructor() {
    this.loadSave();
    effect(() => { localStorage.setItem('garden-swarm', JSON.stringify(this.serialize())); }, { allowSignalWrites: true });
    setInterval(() => this.tick(), 1000);

    // New: Random weather change every 60 seconds (for demo; can be event-based later)
    setInterval(() => {
      const weathers: Array<'sunny' | 'rainy' | 'stormy'> = ['sunny', 'rainy', 'stormy'];
      this.weather.set(weathers[Math.floor(Math.random() * weathers.length)]);
    }, 60000);
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

  // New: Prestige reset – grants essence based on blooms, resets garden
  prestige() {
    const div = this.blooms().div(new Big('1e12'));
    const gainedEssence = div.minus(div.mod(1)); // Equivalent to floor() for positive values
    this.essence.update(e => e.add(gainedEssence));
    this.blooms.set(new Big(0));
    this.plants.set(this.plants().map(p => ({ ...p, count: new Big(0) }))); // Reset counts but keep types unlocked
    this.seeds.set([]); // Reset seeds
    // Weather remains unchanged (or reset if desired)
  }

  loadSave() {
    const save = localStorage.getItem('garden-swarm');
    if (save) {
      const parsed = JSON.parse(save);
      this.blooms.set(new Big(parsed.blooms || 0));
      this.plants.set((parsed.plants || []).map((p: any) => ({ id: p.id, count: new Big(p.count), production: new Big(p.production), cost: new Big(p.cost) })));
      this.seeds.set((parsed.seeds || []).map((s: any) => ({ id: s.id, count: new Big(s.count || 0) }))); // Default to [] if undefined
      this.weather.set(parsed.weather || 'sunny'); // Default to 'sunny'
      this.essence.set(new Big(parsed.essence || 0)); // Default to 0
      const lastSaveTime = parsed.lastSave || Date.now();
      const delta = (Date.now() - lastSaveTime) / 1000; // Handle missing lastSave
      const gains = this.bps().mul(delta);
      this.offlineGains.set(gains); // Store for display
      this.blooms.update(b => b.add(gains));
    } else {
      // Initial defaults (moved here for reuse)
      const defaultPlants: Plant[] = [
        { id: 'seed', count: new Big(0), production: new Big(1), cost: new Big(10) },
        { id: 'flower', count: new Big(0), production: new Big(10), cost: new Big(100) },
        { id: 'tree', count: new Big(0), production: new Big(100), cost: new Big(1000) }
      ];
      this.plants.set(defaultPlants);
      this.seeds.set([]); // Start with no seeds; earn via gameplay later
    }
    // Migration: Ensure base plants if empty (for old saves)
    if (this.plants().length === 0) {
      const defaultPlants: Plant[] = [
        { id: 'seed', count: new Big(0), production: new Big(1), cost: new Big(10) },
        { id: 'flower', count: new Big(0), production: new Big(10), cost: new Big(100) },
        { id: 'tree', count: new Big(0), production: new Big(100), cost: new Big(1000) }
      ];
      this.plants.set(defaultPlants);
    }
    this.isLoaded.set(true);
    this.lastSave.set(Date.now());
  }

  serialize() {
    return {
      blooms: this.blooms().toString(),
      plants: this.plants().map(p => ({ id: p.id, count: p.count.toString(), production: p.production.toString(), cost: p.cost.toString() })),
      seeds: this.seeds().map(s => ({ id: s.id, count: s.count.toString() })), // New
      weather: this.weather(), // New
      essence: this.essence().toString(), // New
      lastSave: this.lastSave()
    };
  }
}
