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

app.renderer.autoResize = true;
app.renderer.resize(window.innerWidth, window.innerHeight);
app.renderer.resolution = resolution;

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
	fontFamily: 'monospace',
	fontSize: '20px',
	wordWrap: true,
	wordWrapWidth: app.renderer.width / 4
});
text.x = 5;
text.y = 5;

let debugText = new Pixi.Text('DEBUG INFO');
debugText.style = new Pixi.TextStyle({
	fill: '#ffffff',
	fontFamily: 'monospace',
	fontSize: '15px',
	wordWrap: true,
	wordWrapWidth: app.renderer.width - 5
});
debugText.x = 5;
debugText.y = app.renderer.height - 5 - debugText.height;

app.stage.addChild(text);

app.renderer.view.style.position = 'absolute';
app.renderer.view.style.display = 'block';

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
	// text.visible = false;
	text.text = 'CONTROLS:\nWASD  - move\nShift - faster';
	app.stage.addChild(debugText);
	let thinkSprite = new Pixi.Sprite(
		loader.resources.think.texture
	);
	think = new Character({
		sprite: thinkSprite,
		sprintMultiplier: 4,
		baseMovementVelocity: 2
	});
	think.sprite.x = (window.innerWidth - think.sprite.width) / 2;
	think.sprite.y = (window.innerHeight - think.sprite.height) / 2;
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

	let dx = think.vx * think.sprint * dt;
	let dy = think.vy * think.sprint * dt;

	think.sprite.x += dx;
	think.sprite.y += dy;

	// snap positions to renderer viewport (allow sliding just out of view)
	if (think.sprite.x + think.sprite.width < 0) {
		think.sprite.x = -think.sprite.width;
	} else if (think.sprite.x > app.renderer.width) {
		think.sprite.x = app.renderer.width;
	}
	if (think.sprite.y + think.sprite.height < 0) {
		think.sprite.y = -think.sprite.height;
	} else if (think.sprite.y > app.renderer.height) {
		think.sprite.y = app.renderer.height;
	}

	debugText.text = `x = ${think.sprite.x.toFixed(4)}, y = ${think.sprite.y.toFixed(4)}\ndir = 0b${think.direction.toString(2).padStart(4, '0')}\nFPS = ${Math.round(app.ticker.FPS)}`;
	debugText.y = app.renderer.height - 5 - debugText.height;
}

window.onload = () => {
	document.body.appendChild(app.view);
};

window.onresize = () => {
	app.renderer.resize(window.innerWidth, window.innerHeight);
};
