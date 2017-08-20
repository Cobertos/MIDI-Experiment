import Promise from "bluebird";

export class Visual {
	constructor() {}

	/**When run will init this visual using the given renderer and JZZ instance
	 * @param {THREE.WebGLRenderer} webGLRenderer The WebGLRenderer
	 * @param {JZZ} JZZ The JZZ instance
	 * @returns {Promise} The promise that will resolve when the Visual has completed loading
	 */
	init(webGLRenderer, JZZ) {
		return Promise.resolve(this);
	}

	/**Runs every frame when rendering this Visual after init
	 */
	render(webGLRenderer) {}

	/**Runs when this visual will be switched out of the renderer and should revert everything t
	 * default settings
	 */
	teardown(webGLRenderer, JZZ) {
		return Promise.resolve(this);
	}

	/**Returns a string with the name of the visual for UI purposes
	 * @returns {string} The string that is the name
	 */
	getName() {
		return Object.getPrototypeOf(this).constructor.name;
	}
}