
let TestingKeyboardFrame: { getFrame: (globalState: GlobalState, sessionState: SessionState) => IFrame } = {} as any;

TestingKeyboardFrame.getFrame = function (globalState: GlobalState, sessionState: SessionState): IFrame {

	let x = 50;
	let y = 50;

	let getNextFrame: getNextFrame = function ({ keyboardInput, mouseInput, previousKeyboardInput, previousMouseInput, displayProcessing, soundOutput, musicOutput, thisFrame }) {
		if (keyboardInput.isPressed(Key.Esc) && !previousKeyboardInput.isPressed(Key.Esc))
			return TestingFrame.getFrame(globalState, sessionState);

		let delta = 8;

		if (keyboardInput.isPressed(Key.Shift))
			delta = 2;

		if (keyboardInput.isPressed(Key.LeftArrow))
			x -= delta;
		if (keyboardInput.isPressed(Key.RightArrow))
			x += delta;
		if (keyboardInput.isPressed(Key.DownArrow))
			y -= delta;
		if (keyboardInput.isPressed(Key.UpArrow))
			y += delta;

		if (x < 0)
			x = 0;
		if (x > GlobalConstants.WINDOW_WIDTH)
			x = GlobalConstants.WINDOW_WIDTH;
		if (y < 0)
			y = 0;
		if (y > GlobalConstants.WINDOW_HEIGHT)
			y = GlobalConstants.WINDOW_HEIGHT;

		return thisFrame;
	};
	
	let render = function (displayOutput: IDisplayOutput) {
		let backgroundColor: DTColor = { r: 225, g: 225, b: 225, alpha: 255 };
		displayOutput.drawRectangle(0, 0, GlobalConstants.WINDOW_WIDTH, GlobalConstants.WINDOW_HEIGHT, backgroundColor, true);

		displayOutput.drawRectangle(
			x - 5,
			y - 5,
			11,
			11,
			black,
			true);
	};
	
	return {
		getNextFrame,
		render,
		getClickUrl: function () { return null; },
		getCompletedAchievements: function () { return null; }
	};
};
