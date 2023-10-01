
let ChooseDifficultyFrame: { getFrame: (globalState: GlobalState, sessionState: SessionState) => IFrame } = {} as any;

ChooseDifficultyFrame.getFrame = function (globalState: GlobalState, sessionState: SessionState): IFrame {

	let volumePicker: SoundAndMusicVolumePicker | null = null;

	let difficulty = 2;

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

		if (keyboardInput.isPressed(Key.Esc) && !previousKeyboardInput.isPressed(Key.Esc)) {
			return TitleScreenFrame.getFrame(globalState, sessionState);
		}

		if (keyboardInput.isPressed(Key.UpArrow) && !previousKeyboardInput.isPressed(Key.UpArrow)) {
			if (difficulty > 1)
				difficulty--;
		}

		if (keyboardInput.isPressed(Key.DownArrow) && !previousKeyboardInput.isPressed(Key.DownArrow)) {
			if (difficulty < 3)
				difficulty++;
		}

		if (keyboardInput.isPressed(Key.Enter) && !previousKeyboardInput.isPressed(Key.Enter)
			|| keyboardInput.isPressed(Key.Space) && !previousKeyboardInput.isPressed(Key.Space)
			|| keyboardInput.isPressed(Key.Z) && !previousKeyboardInput.isPressed(Key.Z)) {
			let gameDifficulty = difficulty === 1 ? Difficulty.Easy : (difficulty === 2 ? Difficulty.Normal : Difficulty.Hard);
			let gameState = GameStateUtil.getInitialGameState(1, gameDifficulty);
			return GameFrame.getFrame(globalState, sessionState, gameState);
		}

		return thisFrame;
	};

	let render = function (displayOutput: IDisplayOutput) {
		let backgroundColor: DTColor = { r: 225, g: 225, b: 225, alpha: 255 };
		displayOutput.drawRectangle(0, 0, GlobalConstants.WINDOW_WIDTH, GlobalConstants.WINDOW_HEIGHT, backgroundColor, true);

		displayOutput.drawText(
			300,
			650,
			"Choose Difficulty",
			GameFont.SimpleFont,
			48,
			black);

		displayOutput.drawText(
			350,
			500,
			"Easy",
			GameFont.SimpleFont,
			24,
			black);
		displayOutput.drawText(
			350,
			400,
			"Normal",
			GameFont.SimpleFont,
			24,
			black);
		displayOutput.drawText(
			350,
			300,
			"Hard",
			GameFont.SimpleFont,
			24,
			black);

		let y: number;
		switch (difficulty) {
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
			200,
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
