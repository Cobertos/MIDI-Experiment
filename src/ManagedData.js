import dat from "dat.gui";

/**Object that, using the provided get() and set() properties
 * will notify of changes on properties by listening with on().
 * Can also generate an interactive DOM gui from gui()
 */
export class ManagedData {
	constructor(data) {
		//The internally managed data
		this._data = data;

		this._eventHandlers = {};
	}
	/**Handles the tree traversal for get and set operations
	 * @private
	 * @param {string} prop The path to the property, `.` separated
	 * @param {object} opt The options to use
	 * @prop {boolean} set Should the operation set
	 * @prop {any} val The value to set with if any
	 */
	_combinedGetSet(prop, opt) {
		if(prop === undefined || prop === null) {
			if(opt.set) {
				let ret = this._data = opt.val;
				this.trigger(prop, "change", { value : ret });
				return ret;
			}
			else {
				return this._data;
			}
		}
		else {
			let lastPathObj = this._data;
			let lastPathPart;
			prop.split(".").some((propPart, idx, arr)=>{
				if(idx === arr.length-1) { //Break just before the final traversal
					lastPathPart = propPart;
					return true; //break
				}

				lastPathObj = lastPathObj[propPart];
			});
			if(opt.set) {
				let ret = lastPathObj[lastPathPart] = opt.val;
				this.trigger(prop, "change", { value : ret });
				return ret;
			}
			else {
				return lastPathObj[lastPathPart];
			}
		}
	}

	get(prop) {
		return this._combinedGetSet(prop);
	}
	set(prop, val) {
		return this._combinedGetSet(prop, {set:true, val:val});
	}

	//Handle events
	_getEventName(prop, event) {
		return event + "#" + prop.replace(".","/");
	}
	on(prop, event, handler) {
		let evtName = this._getEventName(prop, event);
		if(!this._eventHandlers[evtName]) {
			this._eventHandlers[evtName] = [];
		}
		this._eventHandlers[evtName].push(handler);
	}
	trigger(prop, event, data) {
		let evtName = this._getEventName(prop, event);
		if(this._eventHandlers[evtName]) {
			this._eventHandlers[evtName].forEach((handler)=>{
				handler({
					type : evtName,
					data
				});
			});
		}
	}
	gui() {
		const _guiRecurse = (obj, path, gui)=>{
			Object.keys(obj).forEach((key)=>{
				let prop = obj[key];
				let tmpPath = path ? path + "." + key : key;
				if(typeof prop !== "object") {
					let controller = gui.add(obj, key);
					//Bind controllers both ways
					//DatGUI ==> US
					controller.onChange((val)=>{
						this.set(tmpPath, val);
					});
					//US ==> DatGUI
					this.on(tmpPath, "change", ()=>{
						for (var i in gui.__controllers) {
							//Will not cause onChange event, thank god
							gui.__controllers[i].updateDisplay();
						}
					});
				}
				else if(_.isPlainObject(prop)) {
					_guiRecurse(prop, tmpPath, gui.addFolder(key));
				}
			});
		}

		let gui = new dat.GUI();
		_guiRecurse(this._data, undefined, gui);

		return gui;
	}
}