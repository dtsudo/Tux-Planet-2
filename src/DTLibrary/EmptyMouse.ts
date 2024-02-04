
let EmptyMouse = {
	getEmptyMouse: function (): IMouse {
		"use strict";

		return {
			isLeftMouseButtonPressed: function () { return false; },
			isRightMouseButtonPressed: function () { return false; },
			getX: function () { return 0; },
			getY: function () { return 0; }
		};
	}
};
