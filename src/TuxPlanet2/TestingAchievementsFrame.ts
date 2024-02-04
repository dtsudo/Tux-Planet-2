
let TestingAchievementsFrame: { getFrame: (globalState: GlobalState, sessionState: SessionState) => IFrame } = {} as any;

TestingAchievementsFrame.getFrame = function (globalState: GlobalState, sessionState: SessionState): IFrame {

	let completedAchievements: string[] = [];

	let getNextFrame: getNextFrame = function ({ keyboardInput, mouseInput, previousKeyboardInput, previousMouseInput, displayProcessing, soundOutput, musicOutput, thisFrame }) {
		if (keyboardInput.isPressed(Key.Esc) && !previousKeyboardInput.isPressed(Key.Esc))
			return TestingFrame.getFrame(globalState, sessionState);

		completedAchievements = [];

		if (keyboardInput.isPressed(Key.One))
			completedAchievements.push("test_achievement_1");
		if (keyboardInput.isPressed(Key.Two))
			completedAchievements.push("test_achievement_2");

		return thisFrame;
	};
	
	let render = function (displayOutput: IDisplayOutput) {
		let backgroundColor: DTColor = { r: 225, g: 225, b: 225, alpha: 255 };
		displayOutput.drawRectangle(0, 0, GlobalConstants.WINDOW_WIDTH, GlobalConstants.WINDOW_HEIGHT, backgroundColor, true);

		displayOutput.drawText(
			50,
			GlobalConstants.WINDOW_HEIGHT - 50,
			"Press 1/2 to earn an achievement!",
			GameFont.SimpleFont,
			24,
			black);
	};
	
	return {
		getNextFrame,
		render,
		getClickUrl: function () { return null; },
		getCompletedAchievements: function () { return completedAchievements; }
	};
};
