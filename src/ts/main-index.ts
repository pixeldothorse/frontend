import * as Pixi from 'pixi.js';

let resolution = 1;

let app = new Pixi.Application(
	{
		width: 256,
		height: 256,
		antialias: true,
		transparent: false
	}
);

let loader = app.loader;
loader.add('think', 'img/thinkbyte-small.png');
loader.on('progress', (loader, res) => {
	text.text = `Loading: ${loader.progress}%...`;
});
loader.on('complete', setup);
loader.load();

let think: Character;

let text = new Pixi.Text('Hello, world!');
text.style = new Pixi.TextStyle({
	fill: '#ffffff',
	fontFamily: 'Arial',
	fontSize: '40px',
	wordWrap: true
});

app.stage.addChild(text);

app.renderer.view.style.position = 'absolute';
app.renderer.view.style.display = 'block';
app.renderer.autoResize = true;
app.renderer.resize(window.innerWidth, window.innerHeight);
app.renderer.resolution = resolution;

function keyboard(keyCode: number) {
	let key: any = {};
	key.code = keyCode;
	key.isDown = false;
	key.isUp = true;
	key.press = undefined;
	key.release = undefined;

	key.downHandler = (event: KeyboardEvent) => {
		if (event.keyCode === key.code) {
			if (key.isUp && key.press) key.press();
			key.isDown = true;
			key.isUp = false;
		}

		event.preventDefault();
	};

	key.upHandler = (event: KeyboardEvent) => {
		if (event.keyCode === key.code) {
			if (key.isDown && key.release) key.release();
			key.isDown = false;
			key.isUp = true;
		}

		event.preventDefault();
	};

	window.addEventListener('keydown', key.downHandler.bind(key), false);
	window.addEventListener('keyup', key.upHandler.bind(key), false);

	return key;
}

const DIR_UP    = 0b1000;
const DIR_DOWN  = 0b0100;
const DIR_LEFT  = 0b0010;
const DIR_RIGHT = 0b0001;

interface CharacterOptions {
	sprite: Pixi.Sprite;
	sprintMultiplier: number;
	baseMovementVelocity: number;
}

class Character {
	public sprite: Pixi.Sprite;
	public vx: number;
	public vy: number;
	public direction: number;
	public sprint: number;
	public sprintMultiplier: number;
	public baseMovementVelocity: number;

	constructor(options: CharacterOptions) {
		this.sprite = options.sprite;
		this.sprintMultiplier = options.sprintMultiplier;
		this.baseMovementVelocity = options.baseMovementVelocity;

		this.vx = 0;
		this.vy = 0;
		this.direction = 0b0000;
		this.sprint = 1;
	}
}

function setup() {
	text.visible = false;
	let thinkSprite = new Pixi.Sprite(
		loader.resources.think.texture
	);
	think = new Character({
		sprite: thinkSprite,
		sprintMultiplier: 4,
		baseMovementVelocity: 2
	});
	app.stage.addChild(think.sprite);
	app.ticker.add(dt => update(dt));

	let up = keyboard(87);
	up.press = () => { think.direction = think.direction | DIR_UP; };
	up.release = () => { think.direction = think.direction & ~DIR_UP; };

	let down = keyboard(83);
	down.press = () => { think.direction = think.direction | DIR_DOWN; };
	down.release = () => { think.direction = think.direction & ~DIR_DOWN; };

	let left = keyboard(65);
	left.press = () => { think.direction = think.direction | DIR_LEFT; };
	left.release = () => { think.direction = think.direction & ~DIR_LEFT; };

	let right = keyboard(68);
	right.press = () => { think.direction = think.direction | DIR_RIGHT; };
	right.release = () => { think.direction = think.direction & ~DIR_RIGHT; };

	let shift = keyboard(16);
	shift.press = () => {
		think.sprint = think.sprintMultiplier;
		think.vx = think.vx * think.sprint;
		think.vy = think.vy * think.sprint;
	};
	shift.release = () => {
		think.vx = think.vx / think.sprint;
		think.vy = think.vy / think.sprint;
		think.sprint = 1;
	};
}

function update(dt: number) {
	if (think.direction & DIR_UP) {
		think.vy = -think.baseMovementVelocity;
	} else if (think.direction & DIR_DOWN) {
		think.vy = think.baseMovementVelocity;
	} else {
		think.vy = 0;
	}
	if (think.direction & DIR_LEFT) {
		think.vx = -think.baseMovementVelocity;
	} else if (think.direction & DIR_RIGHT) {
		think.vx = think.baseMovementVelocity;
	} else {
		think.vx = 0;
	}

	think.sprite.x += think.vx * think.sprint * dt;
	think.sprite.y += think.vy * think.sprint * dt;
}

window.onload = () => {
	document.body.appendChild(app.view);
};

window.onresize = () => {
	app.renderer.resize(window.innerWidth, window.innerHeight);
};
