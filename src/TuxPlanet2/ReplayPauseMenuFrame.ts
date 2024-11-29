
let ReplayPauseMenuFrame: { getFrame: (globalState: GlobalState, sessionState: SessionState, underlyingFrame: IFrame, difficulty: Difficulty, frameInputHistory: FrameInputHistory) => IFrame } = {} as any;

ReplayPauseMenuFrame.getFrame = function (globalState: GlobalState, sessionState: SessionState, underlyingFrame: IFrame, difficulty: Difficulty, frameInputHistory: FrameInputHistory): IFrame {

	let volumePicker: SoundAndMusicVolumePicker | null = null;

	/*
		1 = Continue
		2 = Restart replay
		3 = Return to title screen
	*/
	let option: number = 1;

	let getNextFrame: getNextFrame = function ({ keyboardInput, mouseInput, previousKeyboardInput, previousMouseInput, displayProcessing, soundOutput, musicOutput, thisFrame }) {

		if (volumePicker === null)
			volumePicker = SoundAndMusicVolumePickerUtil.getSoundAndMusicVolumePicker(
				0,
				0,
				soundOutput.getSoundVolume(),
				musicOutput.getMusicVolume(),
				VolumePickerColor.White);

		volumePicker.processFrame(mouseInput, previousMouseInput);
		soundOutput.setSoundVolume(volumePicker.getCurrentSoundVolume());
		musicOutput.setMusicVolume(volumePicker.getCurrentMusicVolume());
		globalState.saveAndLoadData.saveSoundAndMusicVolume(soundOutput.getSoundVolume(), musicOutput.getMusicVolume());

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

		if (keyboardInput.isPressed(Key.Esc) && !previousKeyboardInput.isPressed(Key.Esc))
			return underlyingFrame;

		if (keyboardInput.isPressed(Key.Enter) && !previousKeyboardInput.isPressed(Key.Enter)
			|| keyboardInput.isPressed(Key.Space) && !previousKeyboardInput.isPressed(Key.Space)
			|| keyboardInput.isPressed(Key.Z) && !previousKeyboardInput.isPressed(Key.Z)) {

			soundOutput.playSound(GameSound.Click, 100);

			switch (option) {
				case 1: return underlyingFrame;
				case 2: return ReplayFrame.getFrame(globalState, sessionState, frameInputHistory, difficulty, displayProcessing);
				case 3: return TitleScreenFrame.getFrame(globalState, sessionState);
				default: throw new Error("Unrecognized option");
			}
		}

		return thisFrame;
	};

	let render = function (displayOutput: IDisplayOutput) {
		underlyingFrame.render(displayOutput);

		displayOutput.drawRectangle(0, 0, GlobalConstants.WINDOW_WIDTH, GlobalConstants.WINDOW_HEIGHT, { r: 0, g: 0, b: 0, alpha: 175 }, true);

		if (volumePicker !== null)
			volumePicker.render(displayOutput);

		displayOutput.drawText(
			400,
			600,
			"Paused",
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
			"Restart replay",
			GameFont.SimpleFont,
			24,
			white);
		displayOutput.drawText(
			365,
			300,
			"Return to title screen",
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
			275,
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
