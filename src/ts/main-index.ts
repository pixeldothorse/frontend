import * as Pixi from 'pixi.js';
import { Character } from './util/Character';
import { Vector } from './util/Vector';

let resolution = 1;

let app = new Pixi.Application({
	width: 256,
	height: 256,
	antialias: true,
	transparent: false
});

app.renderer.autoResize = true;
app.renderer.resize(window.innerWidth, window.innerHeight);
app.renderer.resolution = resolution;

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

let loader = app.loader;
loader.add('think', 'img/thinkbyte-small.png');
loader.on('progress', (loader, res) => {
	text.text = `Loading: ${loader.progress}%...`;
});
loader.on('complete', setup);
loader.load();

let think: Character;

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
	up.press = () => { think.direction.addTo(new Vector(0, -1)); };
	up.release = () => { think.direction.subtractFrom(new Vector(0, -1)); };

	let down = keyboard(83);
	down.press = () => { think.direction.addTo(new Vector(0, 1)); };
	down.release = () => { think.direction.subtractFrom(new Vector(0, 1)); };

	let left = keyboard(65);
	left.press = () => { think.direction.addTo(new Vector(-1, 0)); };
	left.release = () => { think.direction.subtractFrom(new Vector(-1, 0)); };

	let right = keyboard(68);
	right.press = () => { think.direction.addTo(new Vector(1, 0)); };
	right.release = () => { think.direction.subtractFrom(new Vector(1, 0)); };

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
	let direction = think.direction.copy();
	if (direction.x !== 0 && direction.y !== 0) direction.normalize();

	think.vx = direction.x * think.baseMovementVelocity * think.sprint;
	think.vy = direction.y * think.baseMovementVelocity * think.sprint;

	let dx = think.vx * dt;
	let dy = think.vy * dt;

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

	debugText.text = `FPS = ${Math.round(app.ticker.FPS)}\nx = ${think.sprite.x.toFixed(4)}, y = ${think.sprite.y.toFixed(4)}\ndirection = ${direction.toString()}\nvx = ${think.vx}, vy = ${think.vy}`;
	debugText.y = app.renderer.height - 5 - debugText.height;
}

window.onload = () => {
	document.body.appendChild(app.view);
};

window.onresize = () => {
	app.renderer.resize(window.innerWidth, window.innerHeight);
};

let test = new Vector(1, 2);
(window as any).test = test;
