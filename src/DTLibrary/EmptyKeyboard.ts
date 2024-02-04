
let EmptyKeyboard = {
	getEmptyKeyboard: function (): IKeyboard {
		"use strict";

		return {
			isPressed: function (key: Key) { return false; }
		};
	}
};
