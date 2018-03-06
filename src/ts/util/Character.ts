import * as Pixi from 'pixi.js';
import { Vector } from './Vector';

interface CharacterOptions {
	sprite: Pixi.Sprite;
	sprintMultiplier: number;
	baseMovementVelocity: number;
}

export class Character {
	public sprite: Pixi.Sprite;
	public vx: number;
	public vy: number;
	public direction: Vector;
	public sprint: number;
	public sprintMultiplier: number;
	public baseMovementVelocity: number;

	constructor(options: CharacterOptions) {
		this.sprite = options.sprite;
		this.sprintMultiplier = options.sprintMultiplier;
		this.baseMovementVelocity = options.baseMovementVelocity;

		this.vx = 0;
		this.vy = 0;
		this.direction = new Vector(0, 0);
		this.sprint = 1;
	}
}
