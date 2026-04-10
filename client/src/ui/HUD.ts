import Phaser from 'phaser';

export class HUD {
  private scene: Phaser.Scene;
  private timerText!: Phaser.GameObjects.Text;
  private redDiamondText!: Phaser.GameObjects.Text;
  private blueDiamondText!: Phaser.GameObjects.Text;
  private levelNameText!: Phaser.GameObjects.Text;
  private container!: Phaser.GameObjects.Container;

  private elapsedMs = 0;
  private isRunning = false;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.create();
  }

  private create() {
    const style: Phaser.Types.GameObjects.Text.TextStyle = {
      fontSize: '14px',
      color: '#ffffff',
      fontFamily: 'monospace',
    };

    // Background bar
    const bg = this.scene.add.graphics();
    bg.fillStyle(0x000000, 0.5);
    bg.fillRect(0, 0, this.scene.scale.width, 28);

    this.levelNameText = this.scene.add.text(10, 6, '', style);
    this.timerText = this.scene.add.text(this.scene.scale.width / 2 - 30, 6, '00:00', style);

    // Red diamond icon + count
    const rdIcon = this.scene.add.sprite(this.scene.scale.width - 160, 14, 'diamond_red').setScale(0.5);
    this.redDiamondText = this.scene.add.text(this.scene.scale.width - 145, 6, '0', style);

    // Blue diamond icon + count
    const bdIcon = this.scene.add.sprite(this.scene.scale.width - 100, 14, 'diamond_blue').setScale(0.5);
    this.blueDiamondText = this.scene.add.text(this.scene.scale.width - 85, 6, '0', style);

    this.container = this.scene.add.container(0, 0, [
      bg,
      this.levelNameText,
      this.timerText,
      rdIcon,
      this.redDiamondText,
      bdIcon,
      this.blueDiamondText,
    ]);
    this.container.setDepth(100);
    this.container.setScrollFactor(0);
  }

  setLevelName(name: string) {
    this.levelNameText.setText(name);
  }

  startTimer() {
    this.elapsedMs = 0;
    this.isRunning = true;
  }

  stopTimer() {
    this.isRunning = false;
  }

  getElapsedSeconds(): number {
    return Math.floor(this.elapsedMs / 1000);
  }

  update(delta: number) {
    if (this.isRunning) {
      this.elapsedMs += delta;
      const totalSec = Math.floor(this.elapsedMs / 1000);
      const min = String(Math.floor(totalSec / 60)).padStart(2, '0');
      const sec = String(totalSec % 60).padStart(2, '0');
      this.timerText.setText(`${min}:${sec}`);
    }
  }

  updateDiamonds(red: number, blue: number) {
    this.redDiamondText.setText(String(red));
    this.blueDiamondText.setText(String(blue));
  }

  destroy() {
    this.container.destroy();
  }
}
