export class Vector {
	public x: number;
	public y: number;

	/**
	 * Creates a new Vector instance using cartesian coordinates
	 *
	 * For constructing vectors with polar coordinates, see Vector.fromPolar()
	 *
	 * @param {number} x The x component of the vector
	 * @param {number} y The y component of the vector
	 * @see Vector.fromPolar
	 * @memberof Vector
	 */
	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	/**
	 * Create a new unit vector in the given direction (radians)
	 *
	 * The direction is the angle in polar coordinates
	 *
	 * @static
	 * @param direction The direction of the desired unit vector in radians
	 * @returns {Vector} The created unit vector
	 */
	static unitVectorFromDirection(direction: number): Vector {
		return new Vector(Math.cos(direction), Math.sin(direction));
	}

	/**
	 * Constructs a new vector from polar coordinates
	 *
	 * @static
	 * @param {number} length The length component of the polar coordinate
	 * @param {number} angle The angle component of the polar coordinate
	 * @returns {Vector} A cartesian vector constructed from the polar coordinates
	 * @memberof Vector
	 */
	static fromPolar(length: number, angle: number): Vector {
		return new Vector(length * Math.cos(angle), length * Math.sin(angle));
	}

	/**
	 * Gets the magnitude of the current vector
	 *
	 * The magnitude is the length in polar coordinates
	 *
	 * @returns {number} The vector's magnitude
	 * @memberof Vector
	 */
	getMagnitude(): number {
		return Math.sqrt((this.x * this.x) + (this.y * this.y));
	}

	/**
	 * Sets the magnitude of the current vector, preserving its direction
	 *
	 * The magnitude is the length in polar coordinates
	 *
	 * @param {number} magnitude The new magnitude to set
	 * @memberof Vector
	 */
	setMagnitude(magnitude: number) {
		let direction = this.getDirection();
		this.x = Math.cos(direction) * magnitude;
		this.y = Math.sin(direction) * magnitude;
	}

	/**
	 * Converts the vector into a unit vector in the same direction
	 *
	 * @memberof Vector
	 */
	normalize() {
		let magnitude = this.getMagnitude();
		this.x /= magnitude;
		this.y /= magnitude;
	}

	/**
	 * Adds a vector to the current vector, returning the sum as a new vector
	 *
	 * @param {Vector} v2 The vector to add
	 * @returns {Vector} The sum of the two vectors
	 * @memberof Vector
	 */
	add(v2: Vector): Vector {
		return new Vector(this.x + v2.x, this.y + v2.y);
	}

	/**
	 * Adds a vector to the current vector, modifying the current vector's components to represent
	 * the difference
	 *
	 * @param {Vector} v2 The vector to add
	 * @memberof Vector
	 */
	addTo(v2: Vector) {
		this.x += v2.x;
		this.y += v2.y;
	}

	/**
	 * Subtracts a vector from the current vector, returning the difference as a new vector
	 *
	 * @param {Vector} v2 The vector to subtract
	 * @returns {Vector} The difference of the two vectors
	 * @memberof Vector
	 */
	subtract(v2: Vector): Vector {
		return new Vector(this.x - v2.x, this.y - v2.y);
	}

	/**
	 * Subtracts a vector from the current vector, modifying the current vector's components to represent
	 * the difference
	 *
	 * @param {Vector} v2 The vector to subtract
	 * @memberof Vector
	 */
	subtractFrom(v2: Vector) {
		this.x -= v2.x;
		this.y -= v2.y;
	}

	/**
	 * Multiplies the vector by a scalar value, returning the product as a new vector
	 *
	 * @param {number} scalar The scalar value to multiply the vector by
	 * @returns {Vector} The product of the vector and the scalar
	 * @memberof Vector
	 */
	multiply(scalar: number): Vector {
		return new Vector(this.x * scalar, this.y * scalar);
	}

	/**
	 * Multiplies the vector by a scalar value, modifying the current vector's components to represent
	 * the product
	 *
	 * @param {number} scalar The scalar value to multiply the vector by
	 * @memberof Vector
	 */
	multiplyBy(scalar: number) {
		this.x *= scalar;
		this.y *= scalar;
	}

	/**
	 * Divides the vector by a scalar value, returning the quotient as a new vector
	 *
	 * @param {number} scalar The scalar to divide the vector by
	 * @returns {Vector} The quotient of the vector and the scalar
	 * @memberof Vector
	 */
	divide(scalar: number): Vector {
		return new Vector(this.x / scalar, this.y / scalar);
	}

	/**
	 * Divides the vector by a scalar value, modifying the current vector's components to represent
	 * the quotient
	 *
	 * @param {number} scalar The scalar value to divide the vector by
	 * @memberof Vector
	 */
	divideBy(scalar: number) {
		this.x /= scalar;
		this.y /= scalar;
	}

	/**
	 * Finds the dot product of this vector and another vector
	 *
	 * @param {Vector} v2 The vector to find the dot product with
	 * @returns {number} The dot product of this and the given vector
	 * @memberof Vector
	 */
	dotProduct(v2: Vector): number {
		return (this.x * v2.x) + (this.y * v2.y);
	}

	/**
	 * Finds the cross product of this vector and another vector
	 *
	 * While the cross product in 2D is not well-defined, it can be calculated in terms of an imaginary z-axis
	 *
	 * @param {Vector} v2 The vector to find the cross product with
	 * @returns {number} The cross product of the two vectors
	 * @memberof Vector
	 */
	crossProduct(v2: Vector): number {
        return (this.x * v2.y) - (this.y * v2.x);
    }

	/**
	 * Gets the direction of the current vector in radians
	 *
	 * The direction is the angle in polar coordinates
	 *
	 * @returns {number} The direction (or angle) of the vector
	 * @memberof Vector
	 */
	getDirection(): number {
		return Math.atan2(this.y, this.x);
	}

	/**
	 * Sets the direction of the current vector, preserving its magnitude
	 *
	 * The direction is the angle in polar coordinates
	 *
	 * @param {number} direction The new direction (in radians) to assign to the vector
	 * @memberof Vector
	 */
	setDirection(direction: number) {
		let magnitude = this.getMagnitude();
		this.x = Math.cos(direction) * magnitude;
		this.y = Math.sin(direction) * magnitude;
	}

	/**
	 * Copies the current vector to a new Vector object
	 *
	 * @returns {Vector} An deep copy of the current vector
	 * @memberof Vector
	 */
	copy(): Vector {
		return new Vector(this.x, this.y);
	}

	/**
	 * Returns a string representation of the vector
	 *
	 * This can be either in the form "Vector <x, y>" or "Vector (p) <length, angle>" depending on the state
	 * of the polar parameter.
	 *
	 * @param {boolean} [polar] Whether or not the representation should be expressed in terms of polar coordinates
	 * @returns {string}
	 * @memberof Vector
	 */
	toString(polar?: boolean): string {
		if (polar) {
			return `Vector (p) <${this.getMagnitude()}, ${this.getDirection()}>`;
		} else {
			return `Vector <${this.x}, ${this.y}>`;
		}
	}

	/**
	 * Returns an array representation of the vector in the form [x, y, angle, length]
	 *
	 * @returns {number[]} An array representing the vector
	 * @memberof Vector
	 */
	toArray(): number[] {
		return [this.x, this.y, this.getDirection(), this.getMagnitude()];
	}

	/**
	 * Returns an object representation of the vector in the form { x: x, y: y, angle: angle, length: length }
	 *
	 * @returns {*} An object representing the vector
	 * @memberof Vector
	 */
	toObject(): any {
		return { x: this.x, y: this.y, angle: this.getDirection(), length: this.getMagnitude() };
	}
}
