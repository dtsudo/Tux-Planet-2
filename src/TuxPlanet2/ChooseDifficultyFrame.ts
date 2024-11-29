
let ChooseDifficultyFrame: { getFrame: (globalState: GlobalState, sessionState: SessionState) => IFrame } = {} as any;

ChooseDifficultyFrame.getFrame = function (globalState: GlobalState, sessionState: SessionState): IFrame {

	let volumePicker: SoundAndMusicVolumePicker | null = null;

	let difficulty = 2;

	let getNextFrame: getNextFrame = function ({ keyboardInput, mouseInput, previousKeyboardInput, previousMouseInput, displayProcessing, soundOutput, musicOutput, thisFrame }) {

		if (volumePicker === null)
			volumePicker = SoundAndMusicVolumePickerUtil.getSoundAndMusicVolumePicker(
				0,
				0,
				soundOutput.getSoundVolume(),
				musicOutput.getMusicVolume(),
				VolumePickerColor.Black);

		volumePicker.processFrame(mouseInput, previousMouseInput);
		soundOutput.setSoundVolume(volumePicker.getCurrentSoundVolume());
		musicOutput.setMusicVolume(volumePicker.getCurrentMusicVolume());
		globalState.saveAndLoadData.saveSoundAndMusicVolume(soundOutput.getSoundVolume(), musicOutput.getMusicVolume());

		if (keyboardInput.isPressed(Key.Esc) && !previousKeyboardInput.isPressed(Key.Esc)) {
			soundOutput.playSound(GameSound.Click, 100);
			return TitleScreenFrame.getFrame(globalState, sessionState);
		}
		
		if (keyboardInput.isPressed(Key.UpArrow) && !previousKeyboardInput.isPressed(Key.UpArrow)) {
			difficulty--;
			if (difficulty === 0)
				difficulty = 3;
		}

		if (keyboardInput.isPressed(Key.DownArrow) && !previousKeyboardInput.isPressed(Key.DownArrow)) {
			difficulty++;
			if (difficulty === 4)
				difficulty = 1;
		}

		if (keyboardInput.isPressed(Key.Enter) && !previousKeyboardInput.isPressed(Key.Enter)
			|| keyboardInput.isPressed(Key.Space) && !previousKeyboardInput.isPressed(Key.Space)
			|| keyboardInput.isPressed(Key.Z) && !previousKeyboardInput.isPressed(Key.Z)) {

			soundOutput.playSound(GameSound.Click, 100);

			let gameDifficulty: Difficulty;

			switch (difficulty) {
				case 1: gameDifficulty = Difficulty.Easy; break;
				case 2: gameDifficulty = Difficulty.Normal; break;
				case 3: gameDifficulty = Difficulty.Hard; break;
				default: throw new Error("Unrecognized difficulty");
			}

			let gameState = GameStateUtil.getInitialGameState(Level.Level1, gameDifficulty, displayProcessing);

			return GameFrame.getFrame(globalState, sessionState, gameState);
		}

		return thisFrame;
	};

	let render = function (displayOutput: IDisplayOutput) {
		displayOutput.drawRectangle(0, 0, GlobalConstants.WINDOW_WIDTH, GlobalConstants.WINDOW_HEIGHT, GlobalConstants.STANDARD_BACKGROUND_COLOR, true);

		displayOutput.drawText(
			288,
			650,
			"Choose Difficulty",
			GameFont.SimpleFont,
			48,
			black);

		displayOutput.drawText(
			400,
			500,
			"Easy",
			GameFont.SimpleFont,
			24,
			black);
		displayOutput.drawText(
			400,
			400,
			"Normal",
			GameFont.SimpleFont,
			24,
			black);
		displayOutput.drawText(
			400,
			300,
			"Hard",
			GameFont.SimpleFont,
			24,
			black);

		let y: number;
		switch (difficulty) {
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
				throw new Error("Unrecognized difficulty");
		}

		displayOutput.drawRectangle(
			397,
			y,
			100,
			30,
			black,
			false);

		if (volumePicker !== null)
			volumePicker.render(displayOutput);
	};

	return {
		getNextFrame,
		render,
		getClickUrl: function () { return null; },
		getCompletedAchievements: function () { return null; }
	};
};
