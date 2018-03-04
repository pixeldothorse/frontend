export class Vector {
	public x: number;
	public y: number;

	/**
	 * Creates a new Vector object with the given x and y values
	 *
	 * @param x The x component of the vector
	 * @param y The y component of the new vector
	 */
	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	/**
	 * Create a new unit vector in the given direction (radians)
	 *
	 * @param direction The direction of the desired unit vector in radians
	 * @returns {Vector} The created unit vector
	 */
	static unitVectorFromDirection(direction: number): Vector {
		return new Vector(Math.cos(direction), Math.sin(direction));
	}

	/**
	 * Gets the magnitude of the current vector
	 *
	 * @returns {number} The vector's magnitude
	 * @memberof Vector
	 */
	getMagnitude(): number {
		return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
	}

	/**
	 * Sets the magnitude of the current vector, preservig its direction
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
	 * Gets the direction of the current vector in radians
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
	 * Returns a string representation of the vector in the form "Vector <x, y>"
	 *
	 * @returns {string} A string representing the vector
	 * @memberof Vector
	 */
	toString(): string {
		return `Vector <${this.x}, ${this.y}>`;
	}

	/**
	 * Returns an array representation of the vector in the form [x, y]
	 *
	 * @returns {number[]} An array representing the vector
	 * @memberof Vector
	 */
	toArray(): number[] {
		return [this.x, this.y];
	}

	/**
	 * Returns an object representation of the vector in the form { x: x, y: y }
	 *
	 * @returns {*} An object representing the vector
	 * @memberof Vector
	 */
	toObject(): any {
		return { x: this.x, y: this.y };
	}
}
