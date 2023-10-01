
let PauseMenuFrame: { getFrame: (globalState: GlobalState, sessionState: SessionState, underlyingFrame: IFrame, difficulty: Difficulty, isReplay?: boolean) => IFrame } = {} as any;

PauseMenuFrame.getFrame = function (globalState: GlobalState, sessionState: SessionState, underlyingFrame: IFrame, difficulty: Difficulty, isReplay?: boolean): IFrame {

	let volumePicker: SoundAndMusicVolumePicker | null = null;

	/*
		1 = Continue
		2 = Restart level
		3 = Return to title screen
	*/
	let option: number = 1;

	let getNextFrame: getNextFrame = function (keyboardInput, mouseInput, previousKeyboardInput, previousMouseInput, displayProcessing, soundOutput, musicOutput, thisFrame) {

		if (volumePicker === null)
			volumePicker = SoundAndMusicVolumePickerUtil.getSoundAndMusicVolumePicker(
				0,
				0,
				soundOutput.getSoundVolume(),
				musicOutput.getMusicVolume());

		volumePicker.processFrame(mouseInput, previousMouseInput);
		soundOutput.setSoundVolume(volumePicker.getCurrentSoundVolume());
		musicOutput.setMusicVolume(volumePicker.getCurrentMusicVolume());
		globalState.saveAndLoadData.saveSoundAndMusicVolume(soundOutput.getSoundVolume(), musicOutput.getMusicVolume());

		if (keyboardInput.isPressed(Key.UpArrow) && !previousKeyboardInput.isPressed(Key.UpArrow)) {
			if (option > 1)
				option--;

			if (isReplay)
				option = 1;
		}

		if (keyboardInput.isPressed(Key.DownArrow) && !previousKeyboardInput.isPressed(Key.DownArrow)) {
			if (option < 3)
				option++;

			if (isReplay)
				option = 3;
		}

		if (keyboardInput.isPressed(Key.Esc) && !previousKeyboardInput.isPressed(Key.Esc)) {
			return underlyingFrame;
		}

		if (keyboardInput.isPressed(Key.Enter) && !previousKeyboardInput.isPressed(Key.Enter)
			|| keyboardInput.isPressed(Key.Space) && !previousKeyboardInput.isPressed(Key.Space)
			|| keyboardInput.isPressed(Key.Z) && !previousKeyboardInput.isPressed(Key.Z)) {

			switch (option) {
				case 1: return underlyingFrame;
				case 2:
					if (isReplay) break;
					return GameFrame.getFrame(globalState, sessionState, GameStateUtil.getInitialGameState(1, difficulty));
				case 3: return TitleScreenFrame.getFrame(globalState, sessionState);
				default: throw new Error("><");
			}
		}

		return thisFrame;
	};

	let render = function (displayOutput: IDisplayOutput) {
		underlyingFrame.render(displayOutput);

		displayOutput.drawRectangle(0, 0, GlobalConstants.WINDOW_WIDTH, GlobalConstants.WINDOW_HEIGHT, { r: 0, g: 0, b: 0, alpha: 150 } , true);

		displayOutput.drawText(
			GlobalConstants.WINDOW_WIDTH / 2 - 300,
			600,
			"Paused",
			GameFont.SimpleFont,
			48,
			white);

		if (volumePicker !== null)
			volumePicker.render(displayOutput);

		displayOutput.drawText(
			350,
			500,
			"Continue",
			GameFont.SimpleFont,
			24,
			white);
		if (!isReplay)
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
