
let TestingClickUrlFrame: { getFrame: (globalState: GlobalState, sessionState: SessionState) => IFrame } = {} as any;

TestingClickUrlFrame.getFrame = function (globalState: GlobalState, sessionState: SessionState): IFrame {

	let clickUrl: string | null = null;
	let isHover = false;

	let getNextFrame: getNextFrame = function (keyboardInput, mouseInput, previousKeyboardInput, previousMouseInput, displayProcessing, soundOutput, musicOutput, thisFrame) {
		if (keyboardInput.isPressed(Key.Esc) && !previousKeyboardInput.isPressed(Key.Esc))
			return TestingFrame.getFrame(globalState, sessionState);

		let mouseX = mouseInput.getX();
		let mouseY = mouseInput.getY();

		isHover = 50 <= mouseX
			&& mouseX <= 250
			&& GlobalConstants.WINDOW_HEIGHT - 100 <= mouseY
			&& mouseY <= GlobalConstants.WINDOW_HEIGHT - 50;

		if (isHover)
			clickUrl = "https://github.com/dtsudo";
		else
			clickUrl = null;

		return thisFrame;
	};
	
	let render = function (displayOutput: IDisplayOutput) {
		let backgroundColor: DTColor = { r: 225, g: 225, b: 225, alpha: 255 };
		displayOutput.drawRectangle(0, 0, GlobalConstants.WINDOW_WIDTH, GlobalConstants.WINDOW_HEIGHT, backgroundColor, true);

		displayOutput.drawRectangle(50, GlobalConstants.WINDOW_HEIGHT - 100, 200, 50, black, false);

		let textColor = isHover ? { r: 180, g: 180, b: 255, alpha: 255 } : black;
		displayOutput.drawText(60, GlobalConstants.WINDOW_HEIGHT - 60, "click me", GameFont.SimpleFont, 30, textColor);
	};

	let getClickUrl = function () {
		return clickUrl;
	};

	return {
		getNextFrame,
		render,
		getClickUrl,
		getCompletedAchievements: function () { return null; }
	};
};
