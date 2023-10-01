
let CopiedMouse = {
	getSnapshot: function (mouse: IMouse): IMouse {
		"use strict";

		let isLeftMouseButtonPressed = mouse.isLeftMouseButtonPressed();
		let isRightMouseButtonPressed = mouse.isRightMouseButtonPressed();
		let x = mouse.getX();
		let y = mouse.getY();

		return {
			isLeftMouseButtonPressed: function () { return isLeftMouseButtonPressed; },
			isRightMouseButtonPressed: function () { return isRightMouseButtonPressed; },
			getX: function () { return x; },
			getY: function () { return y; }
		};
	}
};
