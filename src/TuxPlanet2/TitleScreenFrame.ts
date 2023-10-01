
let TitleScreenFrame: { getFrame: (globalState: GlobalState, sessionState: SessionState) => IFrame } = {} as any;

TitleScreenFrame.getFrame = function (globalState: GlobalState, sessionState: SessionState): IFrame {

	let volumePicker: SoundAndMusicVolumePicker | null = null;

	let isHoverOverUrl = false;

	let getNextFrame: getNextFrame = function (keyboardInput, mouseInput, previousKeyboardInput, previousMouseInput, displayProcessing, soundOutput, musicOutput, thisFrame) {
		if (globalState.debugMode) {
			if (keyboardInput.isPressed(Key.T) && !previousKeyboardInput.isPressed(Key.T))
				return TestingFrame.getFrame(globalState, sessionState);
		}

		let mouseX = mouseInput.getX();
		let mouseY = mouseInput.getY();
		isHoverOverUrl = 620 <= mouseX && mouseX <= 620 + 350 && 4 <= mouseY && mouseY <= 20;

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

		if (keyboardInput.isPressed(Key.Enter) && !previousKeyboardInput.isPressed(Key.Enter)
			|| keyboardInput.isPressed(Key.Space) && !previousKeyboardInput.isPressed(Key.Space)
			|| keyboardInput.isPressed(Key.Z) && !previousKeyboardInput.isPressed(Key.Z)) {
			return ChooseDifficultyFrame.getFrame(globalState, sessionState);
		}

		return thisFrame;
	};

	let render = function (displayOutput: IDisplayOutput) {
		let backgroundColor: DTColor = { r: 225, g: 225, b: 225, alpha: 255 };
		displayOutput.drawRectangle(0, 0, GlobalConstants.WINDOW_WIDTH, GlobalConstants.WINDOW_HEIGHT, backgroundColor, true);

		displayOutput.drawText(
			GlobalConstants.WINDOW_WIDTH / 2 - 300,
			600,
			"Tux Planet 2: \n Konqi's Fiery Adventure",
			GameFont.SimpleFont,
			48,
			black);

		displayOutput.drawText(GlobalConstants.WINDOW_WIDTH / 2 - 150, 300, "Press Enter", GameFont.SimpleFont, 28, black);

		displayOutput.drawText(
			350,
			20,
			"The previous game (Tux Planet 1): ",
			GameFont.SimpleFont,
			16,
			black);
		displayOutput.drawText(
			620,
			20,
			"https://dtsudo.itch.io/tux-planet-speedrun",
			GameFont.SimpleFont,
			16,
			isHoverOverUrl ? { r: 0, g: 0, b: 255, alpha: 255 } : black);

		if (volumePicker !== null)
			volumePicker.render(displayOutput);
	};

	return {
		getNextFrame,
		render,
		getClickUrl: function () { return isHoverOverUrl ? "https://dtsudo.itch.io/tux-planet-speedrun" : null; },
		getCompletedAchievements: function () { return null; }
	};
};
