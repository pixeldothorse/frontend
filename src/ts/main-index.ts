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

let think: Pixi.Sprite;

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

function setup() {
	text.visible = false;
	think = new Pixi.Sprite(
		loader.resources.think.texture
	);
	app.stage.addChild(think);
	app.ticker.add(dt => update(dt));

	(think as any).baseVelocity = 2;
	(think as any).vx = 0;
	(think as any).vy = 0;
	(think as any).direction = 0b0000;
	(think as any).sprint = 1;

	let up = keyboard(87);
	up.press = () => { (think as any).direction = (think as any).direction | DIR_UP; };
	up.release = () => { (think as any).direction = (think as any).direction & ~DIR_UP; };

	let down = keyboard(83);
	down.press = () => { (think as any).direction = (think as any).direction | DIR_DOWN; };
	down.release = () => { (think as any).direction = (think as any).direction & ~DIR_DOWN; };

	let left = keyboard(65);
	left.press = () => { (think as any).direction = (think as any).direction | DIR_LEFT; };
	left.release = () => { (think as any).direction = (think as any).direction & ~DIR_LEFT; };

	let right = keyboard(68);
	right.press = () => { (think as any).direction = (think as any).direction | DIR_RIGHT; };
	right.release = () => { (think as any).direction = (think as any).direction & ~DIR_RIGHT; };

	let shift = keyboard(16);
	shift.press = () => {
		(think as any).sprint = 2;
		(think as any).vx = (think as any).vx * (think as any).sprint;
		(think as any).vy = (think as any).vy * (think as any).sprint;
	};
	shift.release = () => {
		(think as any).vx = (think as any).vx / (think as any).sprint;
		(think as any).vy = (think as any).vy / (think as any).sprint;
		(think as any).sprint = 1;
	};
}

function update(dt: number) {
	if ((think as any).direction & DIR_UP) {
		(think as any).vy = -2;
	} else if ((think as any).direction & DIR_DOWN) {
		(think as any).vy = 2;
	} else {
		(think as any).vy = 0;
	}
	if ((think as any).direction & DIR_LEFT) {
		(think as any).vx = -2;
	} else if ((think as any).direction & DIR_RIGHT) {
		(think as any).vx = 2;
	} else {
		(think as any).vx = 0;
	}

	think.x += (think as any).vx * (think as any).sprint * dt;
	think.y += (think as any).vy * (think as any).sprint * dt;
}

window.onload = () => {
	document.body.appendChild(app.view);
};
