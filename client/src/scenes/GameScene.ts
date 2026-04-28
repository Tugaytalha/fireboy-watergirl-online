import Phaser from 'phaser';
import {
  TILE_SIZE,
  LEVEL_WIDTH_PX,
  LEVEL_HEIGHT_PX,
  DEATH_DELAY_MS,
  TileType,
} from '@fbwg/shared';
import type { LevelData, LevelObject } from '@fbwg/shared';
import { Fireboy } from '../entities/Fireboy';
import { Watergirl } from '../entities/Watergirl';
import { Diamond } from '../entities/Diamond';
import { PressurePlate } from '../entities/PressurePlate';
import { Lever } from '../entities/Lever';
import { Door } from '../entities/Door';
import { MovingPlatform } from '../entities/MovingPlatform';
import { Elevator } from '../entities/Elevator';
import { Crate } from '../entities/Crate';
import { Fan } from '../entities/Fan';
import { ExitDoor } from '../entities/ExitDoor';
import { HUD } from '../ui/HUD';
import { calculateRank } from '../utils/RankCalculator';
import { Character } from '../entities/Character';
import { NetworkManager } from '../network/NetworkManager.js';
import { GameEventType } from '@fbwg/shared';
import type { PlayerInput } from '@fbwg/shared';
// Level imports
import { levels } from '../levels';

export class GameScene extends Phaser.Scene {
  // Characters
  private fireboy!: Fireboy;
  private watergirl!: Watergirl;

  // Input
  private cursorsArrow!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keysWASD!: { W: Phaser.Input.Keyboard.Key; A: Phaser.Input.Keyboard.Key; D: Phaser.Input.Keyboard.Key };
  private keyR!: Phaser.Input.Keyboard.Key;
  private keyEsc!: Phaser.Input.Keyboard.Key;

  // Level data
  private levelData!: LevelData;
  private levelId = 1;
  private wallLayer!: Phaser.Tilemaps.TilemapLayer;
  private tilemap!: Phaser.Tilemaps.Tilemap;

  // Game objects
  private diamonds: Diamond[] = [];
  private plates: PressurePlate[] = [];
  private levers: Lever[] = [];
  private doors: Door[] = [];
  private movingPlatforms: MovingPlatform[] = [];
  private elevators: Elevator[] = [];
  private crates: Crate[] = [];
  private fans: Fan[] = [];
  private exitFire!: ExitDoor;
  private exitWater!: ExitDoor;

  // Hazard zones (overlap bodies)
  private lavaZones: Phaser.Physics.Arcade.StaticGroup | null = null;
  private waterZones: Phaser.Physics.Arcade.StaticGroup | null = null;
  private acidZones: Phaser.Physics.Arcade.StaticGroup | null = null;

  // Hazard wave animation
  private hazardWaveGraphics!: Phaser.GameObjects.Graphics;
  private hazardTime = 0;
  private lavaPositions: { px: number; py: number }[] = [];
  private waterPositions: { px: number; py: number }[] = [];
  private acidPositions: { px: number; py: number }[] = [];

  // State
  private hud!: HUD;
  private redCollected = 0;
  private blueCollected = 0;
  private isDead = false;
  private isComplete = false;

  // Online mode
  private isOnline = false;
  private localCharacter: 'fire' | 'water' = 'fire';
  private nm?: NetworkManager;
  private peerInputBuffer: PlayerInput = { frame: 0, left: false, right: false, up: false };
  private localExitReached = false;
  private peerExitReached = false;
  private frameCounter = 0;

  constructor() {
    super({ key: 'GameScene' });
  }

  init(data: { levelId?: number; online?: boolean; character?: 'fire' | 'water' }) {
    this.levelId = data.levelId ?? 1;
    this.isOnline = data.online ?? false;
    this.localCharacter = data.character ?? 'fire';
    this.isDead = false;
    this.isComplete = false;
    this.redCollected = 0;
    this.blueCollected = 0;
    this.localExitReached = false;
    this.peerExitReached = false;
    this.frameCounter = 0;
    this.peerInputBuffer = { frame: 0, left: false, right: false, up: false };
    this.hazardTime = 0;
    this.lavaPositions = [];
    this.waterPositions = [];
    this.acidPositions = [];
    this.diamonds = [];
    this.plates = [];
    this.levers = [];
    this.doors = [];
    this.movingPlatforms = [];
    this.elevators = [];
    this.crates = [];
    this.fans = [];

    // Wire up NetworkManager from registry if in online mode
    if (data.online) {
      this.nm = this.game.registry.get('networkManager') as NetworkManager | undefined;
      if (this.nm) {
        this.nm.onPeerInput((input) => {
          this.peerInputBuffer = input;
        });
        this.nm.onPeerEvent((event) => {
          if (event.type === GameEventType.LEVEL_COMPLETE) {
            this.peerExitReached = true;
          } else if (event.type === GameEventType.RESTART) {
            this.restartLevel();
          } else if (event.type === GameEventType.DEATH) {
            // peer died — trigger game over on our side too
            this.events.emit('character-death');
          }
        });
        this.nm.onPeerDisconnect(() => {
          // Show disconnect message then go back to menu
          this.scene.start('MenuScene');
        });
      }
    } else {
      this.nm = undefined;
    }
  }

  create() {
    // Load level
    this.levelData = levels[this.levelId - 1];
    if (!this.levelData) {
      this.scene.start('LevelSelectScene');
      return;
    }

    this.buildTilemap();
    this.createHazardZones();
    // Wave overlay — drawn above tilemap, below characters
    this.hazardWaveGraphics = this.add.graphics().setDepth(2);
    this.createObjects();
    this.createCharacters();
    this.setupCollisions();
    this.setupInput();
    this.setupEvents();

    // HUD
    this.hud = new HUD(this);
    this.hud.setLevelName(`Level ${this.levelData.id}: ${this.levelData.name}`);
    this.hud.startTimer();
  }

  update(_time: number, delta: number) {
    // Always animate hazard waves, even when paused/dead
    this.hazardTime += delta;
    this.drawHazardWaves();

    if (this.isDead || this.isComplete) return;

    this.handleInput();
    this.updateEntities();
    this.checkPressurePlates();
    this.checkExits();
    this.hud.update(delta);
  }

  // ─── Level Building ────────────────────────────────────────────────

  private drawHazardWaves() {
    if (!this.hazardWaveGraphics) return;
    this.hazardWaveGraphics.clear();
    const t = this.hazardTime / 1000; // seconds
    const T = TILE_SIZE;

    // Lava: slow rolling orange wave
    this.hazardWaveGraphics.fillStyle(0xffaa00, 0.9);
    for (const { px, py } of this.lavaPositions) {
      const surfaceY = py - T / 2;
      for (let i = 0; i < 8; i++) {
        const wx = px - T / 2 + i * 4 + 1;
        const wy = surfaceY + Math.sin(t * 2.5 + px / 35 + i * 0.9) * 2.5;
        this.hazardWaveGraphics.fillRect(wx, wy, 3, 3);
      }
    }

    // Water: gentle ripple, lighter blue
    this.hazardWaveGraphics.fillStyle(0x88ddff, 0.8);
    for (const { px, py } of this.waterPositions) {
      const surfaceY = py - T / 2;
      for (let i = 0; i < 8; i++) {
        const wx = px - T / 2 + i * 4 + 1;
        const wy = surfaceY + Math.sin(t * 1.8 + px / 35 + i * 1.1) * 2;
        this.hazardWaveGraphics.fillRect(wx, wy, 3, 2);
      }
    }

    // Acid: fast erratic bright-green wave
    this.hazardWaveGraphics.fillStyle(0xbbff44, 0.9);
    for (const { px, py } of this.acidPositions) {
      const surfaceY = py - T / 2;
      for (let i = 0; i < 8; i++) {
        const wx = px - T / 2 + i * 4 + 1;
        const wy = surfaceY + Math.sin(t * 4.0 + px / 35 + i * 0.7) * 2;
        this.hazardWaveGraphics.fillRect(wx, wy, 3, 3);
      }
    }
  }

  private buildTilemap() {
    const { width, height, tiles } = this.levelData;

    this.tilemap = this.make.tilemap({
      tileWidth: TILE_SIZE,
      tileHeight: TILE_SIZE,
      width,
      height,
    });

    const tileset = this.tilemap.addTilesetImage('tileset', 'tileset', TILE_SIZE, TILE_SIZE)!;
    this.wallLayer = this.tilemap.createBlankLayer('walls', tileset, 0, 0)!;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const tileId = tiles[y][x];
        if (tileId === TileType.WALL) {
          this.wallLayer.putTileAt(1, x, y);
        }
      }
    }

    // Exclude hazard tiles (2=lava,3=water,4=acid) from tilemap collision so characters fall through them
    this.wallLayer.setCollisionByExclusion([-1, 0, 2, 3, 4]);
  }

  private createHazardZones() {
    const { width, height, tiles } = this.levelData;
    this.lavaZones = this.physics.add.staticGroup();
    this.waterZones = this.physics.add.staticGroup();
    this.acidZones = this.physics.add.staticGroup();

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const tileId = tiles[y][x];
        const px = x * TILE_SIZE + TILE_SIZE / 2;
        const py = y * TILE_SIZE + TILE_SIZE / 2;

        if (tileId === TileType.LAVA) {
          this.wallLayer.putTileAt(2, x, y);
          // Full-tile zone: characters falling INTO the pit trigger death
          const zone = this.add.zone(px, py, TILE_SIZE, TILE_SIZE);
          this.physics.add.existing(zone, true);
          this.lavaZones!.add(zone);
          this.lavaPositions.push({ px, py });
          // Lava sparks erupt from surface
          this.add.particles(px, py - TILE_SIZE / 2 + 4, 'particle_lava', {
            speedY: { min: -70, max: -25 },
            speedX: { min: -12, max: 12 },
            lifespan: 1000,
            scale: { start: 1.1, end: 0 },
            alpha: { start: 1, end: 0 },
            frequency: 160,
            quantity: 1,
            gravityY: 80,
          });
        } else if (tileId === TileType.WATER) {
          this.wallLayer.putTileAt(3, x, y);
          const zone = this.add.zone(px, py, TILE_SIZE, TILE_SIZE);
          this.physics.add.existing(zone, true);
          this.waterZones!.add(zone);
          this.waterPositions.push({ px, py });
          // Water droplets bubble up then fall back
          this.add.particles(px, py - TILE_SIZE / 2 + 4, 'particle_water', {
            speedY: { min: -28, max: -8 },
            speedX: { min: -6, max: 6 },
            lifespan: 1400,
            scale: { start: 0.8, end: 0 },
            alpha: { start: 0.9, end: 0 },
            frequency: 280,
            quantity: 1,
            gravityY: 30,
          });
        } else if (tileId === TileType.GREEN_ACID) {
          this.wallLayer.putTileAt(4, x, y);
          const zone = this.add.zone(px, py, TILE_SIZE, TILE_SIZE);
          this.physics.add.existing(zone, true);
          this.acidZones!.add(zone);
          this.acidPositions.push({ px, py });
          // Acid bubbles pop energetically
          this.add.particles(px, py - TILE_SIZE / 2 + 4, 'particle_acid', {
            speedY: { min: -50, max: -15 },
            speedX: { min: -8, max: 8 },
            lifespan: 800,
            scale: { start: 0.9, end: 0 },
            alpha: { start: 1, end: 0 },
            frequency: 200,
            quantity: 1,
            gravityY: 60,
          });
        }
      }
    }
  }

  private createObjects() {
    // Diamonds
    for (const d of this.levelData.diamonds) {
      this.diamonds.push(new Diamond(this, d.x, d.y, d.type));
    }

    // Exit doors
    const [exFx, exFy] = this.levelData.exits.fireboy;
    const [exWx, exWy] = this.levelData.exits.watergirl;
    this.exitFire = new ExitDoor(this, exFx, exFy, 'fire');
    this.exitWater = new ExitDoor(this, exWx, exWy, 'water');

    // Dynamic objects
    for (const obj of this.levelData.objects) {
      this.createObject(obj);
    }
  }

  private createObject(obj: LevelObject) {
    const id = obj.id ?? `${obj.type}_${obj.x}_${obj.y}`;

    switch (obj.type) {
      case 'door':
        this.doors.push(new Door(this, obj.x, obj.y, id, obj.height ?? 2));
        break;
      case 'lever':
        this.levers.push(new Lever(this, obj.x, obj.y, id, obj.targets ?? []));
        break;
      case 'pressure_plate':
        this.plates.push(
          new PressurePlate(this, obj.x, obj.y, id, obj.activator ?? 'both', obj.targets ?? []),
        );
        break;
      case 'moving_platform':
        if (obj.path) {
          this.movingPlatforms.push(new MovingPlatform(this, obj.path, id, obj.speed));
        }
        break;
      case 'elevator':
        if (obj.path && obj.path.length >= 2) {
          this.elevators.push(
            new Elevator(this, obj.x, obj.path[0].y, obj.path[1].y, id, obj.speed),
          );
        }
        break;
      case 'crate':
        this.crates.push(new Crate(this, obj.x, obj.y));
        break;
      case 'fan':
        if (obj.direction) {
          this.fans.push(new Fan(this, obj.x, obj.y, id, obj.direction, obj.zoneLength));
        }
        break;
    }
  }

  private createCharacters() {
    const [fbX, fbY] = this.levelData.spawns.fireboy;
    const [wgX, wgY] = this.levelData.spawns.watergirl;
    this.fireboy = new Fireboy(this, fbX, fbY);
    this.watergirl = new Watergirl(this, wgX, wgY);
  }

  // ─── Collisions ───────────────────────────────────────────────────

  private setupCollisions() {
    // Characters ↔ walls
    this.physics.add.collider(this.fireboy, this.wallLayer);
    this.physics.add.collider(this.watergirl, this.wallLayer);

    // Characters ↔ hazards (overlap, not collide)
    // Fireboy dies on water, safe on lava
    this.physics.add.overlap(this.fireboy, this.waterZones!, () => this.fireboy.die());
    this.physics.add.overlap(this.fireboy, this.acidZones!, () => this.fireboy.die());
    // Watergirl dies on lava, safe on water
    this.physics.add.overlap(this.watergirl, this.lavaZones!, () => this.watergirl.die());
    this.physics.add.overlap(this.watergirl, this.acidZones!, () => this.watergirl.die());

    // Characters ↔ diamonds
    this.physics.add.overlap(this.fireboy, this.diamonds, (_, diamond) => {
      const d = diamond as Diamond;
      if (d.diamondType === 'red' && !d.collected) {
        d.collect();
        this.redCollected++;
        this.hud.updateDiamonds(this.redCollected, this.blueCollected);
      }
    });
    this.physics.add.overlap(this.watergirl, this.diamonds, (_, diamond) => {
      const d = diamond as Diamond;
      if (d.diamondType === 'blue' && !d.collected) {
        d.collect();
        this.blueCollected++;
        this.hud.updateDiamonds(this.redCollected, this.blueCollected);
      }
    });

    // Characters ↔ levers
    this.physics.add.overlap(this.fireboy, this.levers, (_, lever) => {
      (lever as Lever).toggle();
    });
    this.physics.add.overlap(this.watergirl, this.levers, (_, lever) => {
      (lever as Lever).toggle();
    });

    // Characters ↔ doors (collide — block when closed)
    this.physics.add.collider(this.fireboy, this.doors);
    this.physics.add.collider(this.watergirl, this.doors);

    // Characters ↔ moving platforms
    for (const platform of this.movingPlatforms) {
      this.physics.add.collider(this.fireboy, platform);
      this.physics.add.collider(this.watergirl, platform);
    }

    // Characters ↔ elevators
    for (const elevator of this.elevators) {
      this.physics.add.collider(this.fireboy, elevator);
      this.physics.add.collider(this.watergirl, elevator);
    }

    // Characters ↔ crates
    for (const crate of this.crates) {
      this.physics.add.collider(this.fireboy, crate, () => {
        this.fireboy.isPushing = true;
      });
      this.physics.add.collider(this.watergirl, crate, () => {
        this.watergirl.isPushing = true;
      });
      this.physics.add.collider(crate, this.wallLayer);
      // Crates collide with other crates
      for (const other of this.crates) {
        if (other !== crate) {
          this.physics.add.collider(crate, other);
        }
      }
    }

    // Characters ↔ exit doors — checked each frame via physics.overlap() in checkExits()

    // Fan wind zones
    for (const fan of this.fans) {
      this.physics.add.overlap(this.fireboy, fan.windZone, () => {
        fan.applyWind(this.fireboy.body as Phaser.Physics.Arcade.Body);
      });
      this.physics.add.overlap(this.watergirl, fan.windZone, () => {
        fan.applyWind(this.watergirl.body as Phaser.Physics.Arcade.Body);
      });
    }
  }

  // ─── Input ─────────────────────────────────────────────────────────

  private setupInput() {
    this.cursorsArrow = this.input.keyboard!.createCursorKeys();
    this.keysWASD = {
      W: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      A: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      D: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };
    this.keyR = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    this.keyEsc = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
  }

  private handleInput() {
    // Reset push state each frame
    this.fireboy.isPushing = false;
    this.watergirl.isPushing = false;

    if (this.isOnline && this.nm) {
      // ── Online mode: local player controls their character, peer input drives the other ──
      this.frameCounter++;

      if (this.localCharacter === 'fire') {
        const left = this.cursorsArrow.left.isDown;
        const right = this.cursorsArrow.right.isDown;
        const up = this.cursorsArrow.up.isDown;
        this.fireboy.handleInput(left, right, up);
        this.nm.sendInput({ frame: this.frameCounter, left, right, up });
        this.watergirl.handleInput(
          this.peerInputBuffer.left,
          this.peerInputBuffer.right,
          this.peerInputBuffer.up,
        );
      } else {
        const left = this.keysWASD.A.isDown;
        const right = this.keysWASD.D.isDown;
        const up = this.keysWASD.W.isDown;
        this.watergirl.handleInput(left, right, up);
        this.nm.sendInput({ frame: this.frameCounter, left, right, up });
        this.fireboy.handleInput(
          this.peerInputBuffer.left,
          this.peerInputBuffer.right,
          this.peerInputBuffer.up,
        );
      }
    } else {
      // ── Offline mode: both characters controlled locally ──
      this.fireboy.handleInput(
        this.cursorsArrow.left.isDown,
        this.cursorsArrow.right.isDown,
        this.cursorsArrow.up.isDown,
      );
      this.watergirl.handleInput(
        this.keysWASD.A.isDown,
        this.keysWASD.D.isDown,
        this.keysWASD.W.isDown,
      );
    }

    // Restart
    if (Phaser.Input.Keyboard.JustDown(this.keyR)) {
      this.restartLevel();
    }

    // Pause
    if (Phaser.Input.Keyboard.JustDown(this.keyEsc)) {
      this.scene.launch('PauseScene', { levelId: this.levelId });
      this.scene.pause();
    }
  }

  // ─── Game Logic ────────────────────────────────────────────────────

  private setupEvents() {
    this.events.on('character-death', () => {
      if (this.isDead) return;
      this.isDead = true;
      this.hud.stopTimer();
      if (this.isOnline && this.nm) {
        this.nm.sendGameEvent({ type: GameEventType.DEATH });
      }
      this.time.delayedCall(DEATH_DELAY_MS, () => {
        this.scene.start('GameOverScene', { levelId: this.levelId });
      });
    });
  }

  private updateEntities() {
    for (const platform of this.movingPlatforms) {
      platform.update();
    }
    for (const elevator of this.elevators) {
      elevator.update();
    }

    // Exit occupied state is updated each frame in checkExits()
  }

  private checkPressurePlates() {
    for (const plate of this.plates) {
      const fbOverlap = this.physics.overlap(this.fireboy, plate);
      const wgOverlap = this.physics.overlap(this.watergirl, plate);

      let crateOverlap = false;
      for (const crate of this.crates) {
        if (this.physics.overlap(crate, plate)) {
          crateOverlap = true;
          break;
        }
      }

      const shouldBePressed =
        (fbOverlap && plate.canBeActivatedBy('fire')) ||
        (wgOverlap && plate.canBeActivatedBy('water')) ||
        crateOverlap;

      if (shouldBePressed && !plate.isPressed) {
        plate.press();
        this.handleTargets(plate.targets, true);
      } else if (!shouldBePressed && plate.isPressed) {
        plate.release();
        this.handleTargets(plate.targets, false);
      }
    }
  }

  private handleTargets(targets: string[], activate: boolean) {
    for (const targetId of targets) {
      // Doors
      const door = this.doors.find((d) => d.doorId === targetId);
      if (door) {
        activate ? door.open() : door.close();
      }
      // Elevators
      const elevator = this.elevators.find((e) => e.elevatorId === targetId);
      if (elevator) {
        activate ? elevator.activate() : elevator.deactivate();
      }
      // Moving platforms
      const platform = this.movingPlatforms.find((p) => p.platformId === targetId);
      if (platform) {
        activate ? platform.activate() : platform.deactivate();
      }
      // Fans
      const fan = this.fans.find((f) => f.fanId === targetId);
      if (fan) {
        activate ? fan.activate() : fan.deactivate();
      }
    }
  }

  private checkExits() {
    const fireOnExit = this.physics.overlap(this.fireboy, this.exitFire);
    const waterOnExit = this.physics.overlap(this.watergirl, this.exitWater);

    this.exitFire.setOccupied(fireOnExit);
    this.exitWater.setOccupied(waterOnExit);

    if (this.isOnline && this.nm) {
      // Determine which exit belongs to the local player
      const localOnExit = this.localCharacter === 'fire' ? fireOnExit : waterOnExit;

      if (localOnExit && !this.localExitReached) {
        this.localExitReached = true;
        this.nm.sendGameEvent({ type: GameEventType.LEVEL_COMPLETE });
      }

      if (this.localExitReached && this.peerExitReached) {
        this.completeLevel();
      }
    } else {
      if (fireOnExit && waterOnExit) {
        this.completeLevel();
      }
    }
  }

  private completeLevel() {
    if (this.isComplete) return;
    this.isComplete = true;
    this.hud.stopTimer();

    const timeTaken = this.hud.getElapsedSeconds();
    const rank = calculateRank(
      this.levelData.par,
      timeTaken,
      this.redCollected,
      this.blueCollected,
    );

    this.time.delayedCall(500, () => {
      this.scene.start('LevelCompleteScene', {
        levelId: this.levelId,
        levelName: this.levelData.name,
        time: timeTaken,
        redCollected: this.redCollected,
        blueCollected: this.blueCollected,
        totalRed: this.levelData.par.diamonds.red,
        totalBlue: this.levelData.par.diamonds.blue,
        rank,
      });
    });
  }

  private restartLevel() {
    if (this.isOnline && this.nm) {
      this.nm.sendGameEvent({ type: GameEventType.RESTART });
    }
    this.scene.restart({ levelId: this.levelId, online: this.isOnline, character: this.localCharacter });
  }

  shutdown() {
    this.hud?.destroy();
    this.hazardWaveGraphics?.destroy();
  }
}
