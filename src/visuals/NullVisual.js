import { Visual } from "./Visual";

/**Visual that renders nothing to the screen but has 
 * the full API of the visual class
 * @extends Visual
 */
export class NullVisual extends Visual {
	render(renderer) {}
}