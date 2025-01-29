
let VictoryScreenFrame: { getFrame: (globalState: GlobalState, sessionState: SessionState, underlyingFrame: IFrame) => IFrame } = {} as any;

VictoryScreenFrame.getFrame = function (globalState: GlobalState, sessionState: SessionState, underlyingFrame: IFrame): IFrame {

	let getNextFrame: getNextFrame = function ({ keyboardInput, mouseInput, previousKeyboardInput, previousMouseInput, displayProcessing, soundOutput, musicOutput, thisFrame }) {

		underlyingFrame = underlyingFrame.getNextFrame({
			keyboardInput: EmptyKeyboard.getEmptyKeyboard(),
			mouseInput: EmptyMouse.getEmptyMouse(),
			previousKeyboardInput: EmptyKeyboard.getEmptyKeyboard(),
			previousMouseInput: EmptyMouse.getEmptyMouse(),
			displayProcessing: displayProcessing,
			soundOutput: MutedSoundOutput.getSoundOutput(soundOutput),
			musicOutput: musicOutput,
			thisFrame: underlyingFrame
		});

		if (keyboardInput.isPressed(Key.Enter) && !previousKeyboardInput.isPressed(Key.Enter)
				|| keyboardInput.isPressed(Key.Space) && !previousKeyboardInput.isPressed(Key.Space)
				|| keyboardInput.isPressed(Key.Z) && !previousKeyboardInput.isPressed(Key.Z)) {

			soundOutput.playSound(GameSound.Click, 100);

			return TitleScreenFrame.getFrame(globalState, sessionState);
		}

		return thisFrame;
	};

	let render = function (displayOutput: IDisplayOutput) {
		underlyingFrame.render(displayOutput);

		displayOutput.drawText(
			Math.floor(GlobalConstants.WINDOW_WIDTH / 2) - 102,
			600,
			"You Win!",
			GameFont.SimpleFont,
			48,
			white);

		displayOutput.drawText(
			378,
			500,
			"Back to title screen",
			GameFont.SimpleFont,
			24,
			white);

		displayOutput.drawRectangle(
			375,
			473,
			250,
			30,
			white,
			false);
	};

	return {
		getNextFrame,
		render,
		getClickUrl: function () { return null; },
		getCompletedAchievements: function () { return null; }
	};
};
