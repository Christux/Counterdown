export class Stars {

	private readonly possibleColors = ["#D61C59", "#E7D84B", "#1B8798"];
	private particles: Particle[] = [];

	private width = window.innerWidth;
	private cursor: Coordinates = { x: this.width / 2, y: this.width / 2 };

	private element: HTMLDivElement;

	constructor() {
		this.element = document.createElement('div');
		document.body.appendChild(this.element);
	}

	start() {
		this.bindEvents();
		this.loop();
	}

	stop() {

	}

	// Bind events that are needed
	private bindEvents() {
		document.addEventListener('mousemove', e => this.onMouseMove(e));
		window.addEventListener('resize', e => this.onWindowResize(e));
	}

	private onWindowResize(e) {
		this.width = window.innerWidth;
	}

	private onMouseMove(e) {
		this.cursor.x = e.clientX;
		this.cursor.y = e.clientY;

		this.addParticle(this.cursor.x, this.cursor.y, this.possibleColors[Math.floor(Math.random() * this.possibleColors.length)]);
	}

	private addParticle(x, y, color) {
		const particle = new Particle(this.element);
		particle.init(x, y, color);
		this.particles.push(particle);
	}

	private updateParticles() {

		// Updated
		for (var i = 0; i < this.particles.length; i++) {
			this.particles[i].update();
		}

		// Remove dead particles
		for (var i = this.particles.length - 1; i >= 0; i--) {
			if (this.particles[i].lifeSpan < 0) {
				this.particles[i].die();
				this.particles.splice(i, 1);
			}
		}
	}

	private loop() {
		requestAnimationFrame(() => this.loop());
		this.updateParticles();
	}
}

class Particle {

	private character = "*";
	lifeSpan = 120; //ms

	private initialStyles: any = {
		position: "fixed",
		display: "inline-block",
		top: "0px",
		left: "0px",
		pointerEvents: "none",
		touchAction: "none",
		zIndex: "10000000",
		fontSize: "25px",
		willChange: "transform"
	};
	private velocity: Coordinates;
	private position: Coordinates;
	private element: HTMLSpanElement;

	constructor(
		private parentElement: HTMLDivElement
	) { }

	// Init, and set properties
	init(x: number, y: number, color) {

		this.velocity = {
			x: (Math.random() < 0.5 ? -1 : 1) * (Math.random() / 2),
			y: 1
		};

		this.position = { x: x + 10, y: y + 10 };
		this.initialStyles.color = color;

		this.element = document.createElement('span');
		this.element.innerHTML = this.character;
		this.applyProperties(this.element, this.initialStyles);
		this.update();

		this.parentElement.appendChild(this.element);
	};

	update() {
		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;
		this.lifeSpan--;

		this.element.style.transform = "translate3d(" + this.position.x + "px," + this.position.y + "px, 0) scale(" + (this.lifeSpan / 120) + ")";
	}

	die() {
		this.parentElement.removeChild(this.element);
	}

	private applyProperties(target, properties) {
		for (var key in properties) {
			target.style[key] = properties[key];
		}
	}
}

interface Coordinates {
	x: number,
	y: number
}
