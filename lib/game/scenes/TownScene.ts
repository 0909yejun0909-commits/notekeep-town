import Phaser from "phaser";

export interface HouseData {
  folderId: string;
  name: string;
  x: number;
  y: number;
}

const TILE = 32;
const PLAYER_SPEED = 160;

export class TownScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private houses: HouseData[];
  private onEnterHouse: (folderId: string) => void;

  constructor(houses: HouseData[], onEnterHouse: (folderId: string) => void) {
    super("Town");
    this.houses = houses;
    this.onEnterHouse = onEnterHouse;
  }

  create() {
    const { width, height } = this.scale;

    this.cameras.main.setBackgroundColor("#4a7c3f");

    const ground = this.add.graphics();
    ground.fillStyle(0x4a7c3f, 1);
    ground.fillRect(0, 0, width, height);
    for (let x = 0; x < width; x += TILE) {
      for (let y = 0; y < height; y += TILE) {
        ground.lineStyle(1, 0x3f6b36, 0.3);
        ground.strokeRect(x, y, TILE, TILE);
      }
    }

    this.houses.forEach((house) => {
      const rect = this.add.rectangle(house.x, house.y, TILE * 2, TILE * 2, 0x8b4a2b);
      rect.setStrokeStyle(2, 0x5c2f18);
      const label = this.add.text(house.x, house.y - TILE * 1.4, house.name, {
        fontSize: "14px",
        color: "#ffffff",
        backgroundColor: "#00000088",
        padding: { x: 4, y: 2 },
      });
      label.setOrigin(0.5);
    });

    this.player = this.physics.add.sprite(width / 2, height / 2, "");
    this.player.setDisplaySize(TILE * 0.8, TILE * 0.8);
    const playerGfx = this.add.rectangle(0, 0, TILE * 0.8, TILE * 0.8, 0x2b6cb0);
    playerGfx.setStrokeStyle(2, 0x1a4971);
    this.player.setVisible(false);
    this.playerVisual = playerGfx;

    this.cursors = this.input.keyboard!.createCursorKeys();
  }

  private playerVisual!: Phaser.GameObjects.Rectangle;
  private lastNearHouse: string | null = null;

  update() {
    if (!this.player.body) return;
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(0);

    if (this.cursors.left.isDown) body.setVelocityX(-PLAYER_SPEED);
    else if (this.cursors.right.isDown) body.setVelocityX(PLAYER_SPEED);

    if (this.cursors.up.isDown) body.setVelocityY(-PLAYER_SPEED);
    else if (this.cursors.down.isDown) body.setVelocityY(PLAYER_SPEED);

    this.playerVisual.setPosition(this.player.x, this.player.y);

    const near = this.houses.find(
      (house) =>
        Phaser.Math.Distance.Between(this.player.x, this.player.y, house.x, house.y) < TILE * 1.3
    );

    if (near && near.folderId !== this.lastNearHouse) {
      this.lastNearHouse = near.folderId;
      this.onEnterHouse(near.folderId);
    } else if (!near) {
      this.lastNearHouse = null;
    }
  }
}
