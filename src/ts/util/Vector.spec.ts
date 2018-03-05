import { Vector } from './Vector';
import { expect } from 'chai';
import 'mocha';

describe('vector construction', () => {
	it('should construct a vector with polar components <1, pi> for components <-1, 0>', () => {
		const vec = new Vector({ x: -1, y: 0 });

		expect(vec.getDirection()).to.closeTo(Math.PI, 1e-6);
		expect(vec.getMagnitude()).to.closeTo(1, 1e-6);
	});

	it('should construct a vector of <-1, 0> for polar components <1, pi>', () => {
		const vec = new Vector({ length: 1, angle: Math.PI });

		expect(vec.x).to.closeTo(-1, 1e-6);
		expect(vec.y).to.closeTo(0, 1e-6);
	});
});

describe('dot product', () => {
	it('should return 0 for two orthogonal vectors', () => {
		const v1 = Vector.unitVectorFromDirection(Math.PI / 4);
		const v2 = Vector.unitVectorFromDirection(3 * Math.PI / 4);

		expect(v1.dotProduct(v2)).to.closeTo(0, 1e-6);
	});

	it('should return 11 for <1, 2> dot <3, 4>', () => {
		const v1 = new Vector({ x: 1, y: 2 });
		const v2 = new Vector({ x: 3, y: 4 });

		expect(v1.dotProduct(v2)).to.closeTo(11, 1e-6);
	});
});

describe('vector multiplication', () => {
	it('should return a vector with magnitude 2sqrt(2) for <1, 1> * 2', () => {
		const vec = new Vector({ x: 1, y: 1 });

		expect(vec.multiply(2).getMagnitude()).to.closeTo(2 * Math.sqrt(2), 1e-6);
	});
});

describe('vector division', () => {
	it('should return a vector with magnitude sqrt(2) for <2, 2> / 2', () => {
		const vec = new Vector({ x: 2, y: 2 });

		expect(vec.divide(2).getMagnitude()).to.closeTo(Math.sqrt(2), 1e-6);
	});
});

describe('changing direction', () => {
	it('should preserve magnitude', () => {
		const vec = new Vector({ length: 5, angle: Math.PI / 3 });
		vec.setDirection(Math.PI / 4);

		expect(vec.getMagnitude()).to.closeTo(5, 1e-6);
	});
});

describe('changing magnitude', () => {
	it('should preserve direction', () => {
		const vec = new Vector({ length: 5, angle: Math.PI / 3 });
		vec.setMagnitude(10);

		expect(vec.getDirection()).to.closeTo(Math.PI / 3, 1e-6);
	});
});

describe('vector normalization', () => {
	it('should produce vectors with a magnitude of 1', () => {
		const components = Array.from({ length: 100 }, () => { return { x: Math.random() * 100, y: Math.random() * 100 }; });

		components.map(component => {
			const vec = new Vector(component);
			vec.normalize();

			expect(vec.getMagnitude()).to.closeTo(1, 1e-6);
		});
	});
});
