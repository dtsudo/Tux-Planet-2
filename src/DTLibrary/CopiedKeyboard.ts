
let CopiedKeyboard = {
	getSnapshot: function (keyboard: IKeyboard): IKeyboard {
		"use strict";

		let keysPressed: { [index:number]: boolean } = {};

		let array: string[] = Object.keys(KeyMapping);

		for (let i = 0; i < array.length; i++) {
			let key: Key = KeyMapping[array[i]];
			keysPressed[key] = keyboard.isPressed(key);
		}

		return {
			isPressed: function (key: Key) {
				return keysPressed[key];
			}
		};
	}
};
