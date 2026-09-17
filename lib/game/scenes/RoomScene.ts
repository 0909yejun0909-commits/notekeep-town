import Phaser from "phaser";

export interface FurnitureData {
  noteId: string;
  title: string;
  x: number;
  y: number;
}

const TILE = 32;
const PLAYER_SPEED = 160;

export class RoomScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private playerVisual!: Phaser.GameObjects.Rectangle;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private furniture: FurnitureData[];
  private roomName: string;
  private onOpenNote: (noteId: string) => void;
  private onExit: () => void;

  constructor(
    roomName: string,
    furniture: FurnitureData[],
    onOpenNote: (noteId: string) => void,
    onExit: () => void
  ) {
    super("Room");
    this.roomName = roomName;
    this.furniture = furniture;
    this.onOpenNote = onOpenNote;
    this.onExit = onExit;
  }

  create() {
    const { width, height } = this.scale;

    this.cameras.main.setBackgroundColor("#d9c7a3");
    this.add.text(width / 2, 20, this.roomName, {
      fontSize: "16px",
      color: "#3f2d1a",
    }).setOrigin(0.5, 0);

    const exitZoneY = height - 24;
    this.exitPos = { x: width / 2, y: exitZoneY };
    this.add.rectangle(width / 2, exitZoneY, 60, 24, 0x000000, 0.15);
    this.add.text(width / 2, exitZoneY - 16, "exit", { fontSize: "10px", color: "#3f2d1a" }).setOrigin(0.5);

    this.furniture.forEach((item) => {
      const rect = this.add.rectangle(item.x, item.y, TILE * 1.2, TILE * 1.2, 0x966f4a);
      rect.setStrokeStyle(2, 0x5c4326);
      this.add.text(item.x, item.y - TILE, item.title, {
        fontSize: "11px",
        color: "#3f2d1a",
        backgroundColor: "#ffffffaa",
        padding: { x: 3, y: 1 },
      }).setOrigin(0.5);
    });

    this.player = this.physics.add.sprite(width / 2, height / 2, "");
    this.player.setVisible(false);
    this.playerVisual = this.add.rectangle(0, 0, TILE * 0.8, TILE * 0.8, 0x2b6cb0);
    this.playerVisual.setStrokeStyle(2, 0x1a4971);

    this.cursors = this.input.keyboard!.createCursorKeys();
  }

  private exitPos!: { x: number; y: number };
  private lastNearNote: string | null = null;
  private hasExited = false;

  update() {
    if (!this.player.body) return;
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(0);

    if (this.cursors.left.isDown) body.setVelocityX(-PLAYER_SPEED);
    else if (this.cursors.right.isDown) body.setVelocityX(PLAYER_SPEED);

    if (this.cursors.up.isDown) body.setVelocityY(-PLAYER_SPEED);
    else if (this.cursors.down.isDown) body.setVelocityY(PLAYER_SPEED);

    this.playerVisual.setPosition(this.player.x, this.player.y);

    const near = this.furniture.find(
      (item) =>
        Phaser.Math.Distance.Between(this.player.x, this.player.y, item.x, item.y) < TILE * 0.9
    );

    if (near && near.noteId !== this.lastNearNote) {
      this.lastNearNote = near.noteId;
      this.onOpenNote(near.noteId);
    } else if (!near) {
      this.lastNearNote = null;
    }

    if (
      !this.hasExited &&
      Phaser.Math.Distance.Between(this.player.x, this.player.y, this.exitPos.x, this.exitPos.y) < 20
    ) {
      this.hasExited = true;
      this.onExit();
    }
  }
}
