
let TestingFontFrame2: { getFrame: (globalState: GlobalState, sessionState: SessionState) => IFrame } = {} as any;

TestingFontFrame2.getFrame = function (globalState: GlobalState, sessionState: SessionState): IFrame {

	let getNextFrame: getNextFrame = function (keyboardInput, mouseInput, previousKeyboardInput, previousMouseInput, displayProcessing, soundOutput, musicOutput, thisFrame) {
		if (keyboardInput.isPressed(Key.Esc) && !previousKeyboardInput.isPressed(Key.Esc))
			return TestingFrame.getFrame(globalState, sessionState);

		if (keyboardInput.isPressed(Key.Enter) && !previousKeyboardInput.isPressed(Key.Enter))
			return TestingFontFrame.getFrame(globalState, sessionState);
	
		return thisFrame;
	};
	
	let render = function (displayOutput: IDisplayOutput) {
		let backgroundColor: DTColor = { r: 225, g: 225, b: 225, alpha: 255 };
		displayOutput.drawRectangle(0, 0, GlobalConstants.WINDOW_WIDTH, GlobalConstants.WINDOW_HEIGHT, backgroundColor, true);

		let red: DTColor = { r: 255, g: 0, b: 0, alpha: 255 };

		displayOutput.drawRectangle(
			51,
			527,
			617,
			119,
			red,
			false);

		displayOutput.drawText(
			50,
			650,
			"Line 1 ABCDEFGHIJKLMNOPQRSTUVWXYZ"
				+ "\n" + "Line 2"
				+ "\n" + "Line 3"
				+ "\n" + "Line 4",
			GameFont.SimpleFont,
			32,
			black);
	};
	
	return {
		getNextFrame,
		render,
		getClickUrl: function () { return null; },
		getCompletedAchievements: function () { return null; }
	};
};
