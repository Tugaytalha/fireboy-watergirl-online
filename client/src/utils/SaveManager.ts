import { SAVE_KEY, Rank } from '@fbwg/shared';
import type { SaveData } from '@fbwg/shared';

const DEFAULT_SAVE: SaveData = {
  unlockedLevel: 1,
  bestRanks: {},
  settings: {
    musicVolume: 0.7,
    sfxVolume: 0.8,
  },
};

export class SaveManager {
  private static instance: SaveManager;
  private data: SaveData;

  private constructor() {
    this.data = this.load();
  }

  static getInstance(): SaveManager {
    if (!SaveManager.instance) {
      SaveManager.instance = new SaveManager();
    }
    return SaveManager.instance;
  }

  private load(): SaveData {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as SaveData;
        return { ...DEFAULT_SAVE, ...parsed };
      }
    } catch {
      // Corrupted save data
    }
    return { ...DEFAULT_SAVE };
  }

  private save() {
    localStorage.setItem(SAVE_KEY, JSON.stringify(this.data));
  }

  get unlockedLevel(): number {
    return this.data.unlockedLevel;
  }

  get settings() {
    return this.data.settings;
  }

  getBestRank(levelId: number): Rank | undefined {
    return this.data.bestRanks[levelId];
  }

  completeLevel(levelId: number, rank: Rank) {
    // Update best rank (A > B > C)
    const current = this.data.bestRanks[levelId];
    const rankOrder = { [Rank.A]: 3, [Rank.B]: 2, [Rank.C]: 1 };
    if (!current || rankOrder[rank] > rankOrder[current]) {
      this.data.bestRanks[levelId] = rank;
    }

    // unlock next level
    if (levelId >= this.data.unlockedLevel) {
      this.data.unlockedLevel = levelId + 1;
    }

    this.save();
  }

  updateSettings(musicVolume: number, sfxVolume: number) {
    this.data.settings.musicVolume = musicVolume;
    this.data.settings.sfxVolume = sfxVolume;
    this.save();
  }
}
