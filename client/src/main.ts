import Phaser from 'phaser';
import { LEVEL_WIDTH_PX, LEVEL_HEIGHT_PX, GRAVITY_Y } from '@fbwg/shared';
import { BootScene } from './scenes/BootScene';
import { PreloadScene } from './scenes/PreloadScene';
import { MenuScene } from './scenes/MenuScene';
import { LevelSelectScene } from './scenes/LevelSelectScene';
import { GameScene } from './scenes/GameScene';
import { PauseScene } from './scenes/PauseScene';
import { LevelCompleteScene } from './scenes/LevelCompleteScene';
import { GameOverScene } from './scenes/GameOverScene';
import { LobbyScene } from './scenes/LobbyScene';
import { SettingsScene } from './scenes/SettingsScene';
import { TutorialScene } from './scenes/TutorialScene';
import { CreditsScene } from './scenes/CreditsScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: LEVEL_WIDTH_PX,
  height: LEVEL_HEIGHT_PX,
  pixelArt: true,
  backgroundColor: '#1a1a2e',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: GRAVITY_Y },
      debug: false,
    },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [
    BootScene,
    PreloadScene,
    MenuScene,
    LevelSelectScene,
    GameScene,
    PauseScene,
    LevelCompleteScene,
    GameOverScene,
    LobbyScene,
    SettingsScene,
    TutorialScene,
    CreditsScene,
  ],
};

new Phaser.Game(config);
