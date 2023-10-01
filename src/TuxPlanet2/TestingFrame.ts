
let TestingFrame: { getFrame: (globalState: GlobalState, sessionState: SessionState) => IFrame } = {} as any;

TestingFrame.getFrame = function (globalState: GlobalState, sessionState: SessionState): IFrame {
	"use strict";

	let getNextFrame: getNextFrame = function (keyboardInput, mouseInput, previousKeyboardInput, previousMouseInput, displayProcessing, soundOutput, musicOutput, thisFrame) {

		if (keyboardInput.isPressed(Key.Esc) && !previousKeyboardInput.isPressed(Key.Esc))
			return TitleScreenFrame.getFrame(globalState, sessionState);

		if (keyboardInput.isPressed(Key.One) && !previousKeyboardInput.isPressed(Key.One))
			return TestingKeyboardFrame.getFrame(globalState, sessionState);

		if (keyboardInput.isPressed(Key.Two) && !previousKeyboardInput.isPressed(Key.Two))
			return TestingMouseFrame.getFrame(globalState, sessionState);

		if (keyboardInput.isPressed(Key.Three) && !previousKeyboardInput.isPressed(Key.Three))
			return TestingFontFrame.getFrame(globalState, sessionState);

		if (keyboardInput.isPressed(Key.Four) && !previousKeyboardInput.isPressed(Key.Four))
			return TestingSoundFrame.getFrame(globalState, sessionState);

		if (keyboardInput.isPressed(Key.Five) && !previousKeyboardInput.isPressed(Key.Five))
			return TestingMusicFrame.getFrame(globalState, sessionState);

		if (keyboardInput.isPressed(Key.Six) && !previousKeyboardInput.isPressed(Key.Six))
			return TestingClickUrlFrame.getFrame(globalState, sessionState);

		if (keyboardInput.isPressed(Key.Seven) && !previousKeyboardInput.isPressed(Key.Seven))
			return TestingAchievementsFrame.getFrame(globalState, sessionState);

		return thisFrame;
	};

	let render = function (displayOutput: IDisplayOutput) {
		let backgroundColor: DTColor = { r: 225, g: 225, b: 225, alpha: 255 };
		displayOutput.drawRectangle(0, 0, GlobalConstants.WINDOW_WIDTH, GlobalConstants.WINDOW_HEIGHT, backgroundColor, true);

		displayOutput.drawText(
			50,
			GlobalConstants.WINDOW_HEIGHT - 50,
			"1) Test keyboard"
				+ "\n" + "2) Test mouse"
				+ "\n" + "3) Test font"
				+ "\n" + "4) Test sound"
				+ "\n" + "5) Test music"
				+ "\n" + "6) Test click URL"
				+ "\n" + "7) Test achievements",
			GameFont.SimpleFont,
			20,
			black);
	};

	return {
		getNextFrame,
		render,
		getClickUrl: function () { return null; },
		getCompletedAchievements: function () { return null; }
	};
};
