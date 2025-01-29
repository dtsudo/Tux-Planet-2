
let LevelCompleteFrame: { getFrame: (globalState: GlobalState, sessionState: SessionState, underlyingFrame: IFrame, level: Level, difficulty: Difficulty, frameInputHistory: FrameInputHistory) => IFrame } = {} as any;

LevelCompleteFrame.getFrame = function (globalState: GlobalState, sessionState: SessionState, underlyingFrame: IFrame, level: Level, difficulty: Difficulty, frameInputHistory: FrameInputHistory): IFrame {

	/*
		1 = Continue
		2 = Watch replay
		3 = Restart level
	*/
	let option = 1;

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

		if (keyboardInput.isPressed(Key.UpArrow) && !previousKeyboardInput.isPressed(Key.UpArrow)) {
			option--;
			if (option === 0)
				option = 3;
		}

		if (keyboardInput.isPressed(Key.DownArrow) && !previousKeyboardInput.isPressed(Key.DownArrow)) {
			option++;
			if (option === 4)
				option = 1;
		}

		if (keyboardInput.isPressed(Key.Enter) && !previousKeyboardInput.isPressed(Key.Enter)
			|| keyboardInput.isPressed(Key.Space) && !previousKeyboardInput.isPressed(Key.Space)
			|| keyboardInput.isPressed(Key.Z) && !previousKeyboardInput.isPressed(Key.Z)) {

			soundOutput.playSound(GameSound.Click, 100);

			switch (option) {
				case 1: return OverworldFrame.getFrame(globalState, sessionState);
				case 2: return ReplayFrame.getFrame(globalState, sessionState, frameInputHistory, level, difficulty, displayProcessing);
				case 3: return GameFrame.getFrame(globalState, sessionState, GameStateUtil.getInitialGameState(level, difficulty, displayProcessing));
				default: throw new Error("Unrecognized option");
			}
		}

		return thisFrame;
	};

	let render = function (displayOutput: IDisplayOutput) {
		underlyingFrame.render(displayOutput);

		displayOutput.drawText(
			Math.floor(GlobalConstants.WINDOW_WIDTH / 2) - 184,
			600,
			"Level Complete",
			GameFont.SimpleFont,
			48,
			white);

		displayOutput.drawText(
			365,
			500,
			"Continue",
			GameFont.SimpleFont,
			24,
			white);
		displayOutput.drawText(
			365,
			400,
			"Watch replay",
			GameFont.SimpleFont,
			24,
			white);
		displayOutput.drawText(
			365,
			300,
			"Restart level",
			GameFont.SimpleFont,
			24,
			white);

		let y: number;
		switch (option) {
			case 1:
				y = 473;
				break;
			case 2:
				y = 373;
				break;
			case 3:
				y = 273;
				break;
			default:
				throw new Error("Unrecognized option");
		}

		displayOutput.drawRectangle(
			362,
			y,
			174,
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
