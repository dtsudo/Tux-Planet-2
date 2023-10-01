
let LevelCompleteFrame: { getFrame: (globalState: GlobalState, sessionState: SessionState, underlyingFrame: IFrame, difficulty: Difficulty, frameInputHistory: FrameInputHistory) => IFrame } = {} as any;

LevelCompleteFrame.getFrame = function (globalState: GlobalState, sessionState: SessionState, underlyingFrame: IFrame, difficulty: Difficulty, frameInputHistory: FrameInputHistory): IFrame {

	/*
		1 = Watch replay
		2 = Restart level
		3 = Return to title screen
	*/
	let option: number = 1;

	let getNextFrame: getNextFrame = function (keyboardInput, mouseInput, previousKeyboardInput, previousMouseInput, displayProcessing, soundOutput, musicOutput, thisFrame) {

		underlyingFrame = underlyingFrame.getNextFrame(
			EmptyKeyboard.getEmptyKeyboard(),
			EmptyMouse.getEmptyMouse(),
			EmptyKeyboard.getEmptyKeyboard(),
			EmptyMouse.getEmptyMouse(),
			displayProcessing,
			MuteAllSound_SoundOutput.getSoundOutput(soundOutput),
			musicOutput,
			underlyingFrame);

		if (keyboardInput.isPressed(Key.UpArrow) && !previousKeyboardInput.isPressed(Key.UpArrow)) {
			if (option > 1)
				option--;
		}

		if (keyboardInput.isPressed(Key.DownArrow) && !previousKeyboardInput.isPressed(Key.DownArrow)) {
			if (option < 3)
				option++;
		}

		if (keyboardInput.isPressed(Key.Enter) && !previousKeyboardInput.isPressed(Key.Enter)
			|| keyboardInput.isPressed(Key.Space) && !previousKeyboardInput.isPressed(Key.Space)
			|| keyboardInput.isPressed(Key.Z) && !previousKeyboardInput.isPressed(Key.Z)) {

			switch (option) {
				case 1: return ReplayFrame.getFrame(globalState, sessionState, frameInputHistory, difficulty);
				case 2: return GameFrame.getFrame(globalState, sessionState, GameStateUtil.getInitialGameState(1, difficulty));
				case 3: return TitleScreenFrame.getFrame(globalState, sessionState);
				default: throw new Error("><");
			}
		}

		return thisFrame;
	};

	let render = function (displayOutput: IDisplayOutput) {
		underlyingFrame.render(displayOutput);

		displayOutput.drawText(
			GlobalConstants.WINDOW_WIDTH / 2 - 300,
			600,
			"All clear!",
			GameFont.SimpleFont,
			48,
			white);

		displayOutput.drawText(
			350,
			500,
			"Watch replay",
			GameFont.SimpleFont,
			24,
			white);
		displayOutput.drawText(
			350,
			400,
			"Restart level",
			GameFont.SimpleFont,
			24,
			white);
		displayOutput.drawText(
			350,
			300,
			"Return to title screen",
			GameFont.SimpleFont,
			24,
			white);

		let y: number;
		switch (option) {
			case 1:
				y = 470;
				break;
			case 2:
				y = 370;
				break;
			case 3:
				y = 270;
				break;
			default:
				throw new Error(" :( ");
		}

		displayOutput.drawRectangle(
			350,
			y,
			350,
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
