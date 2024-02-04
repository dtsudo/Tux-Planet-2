
let TitleScreenFrame: { getFrame: (globalState: GlobalState, sessionState: SessionState) => IFrame } = {} as any;

TitleScreenFrame.getFrame = function (globalState: GlobalState, sessionState: SessionState): IFrame {

	let volumePicker: SoundAndMusicVolumePicker | null = null;

	let creditsButton: Button = ButtonUtil.getButton({
		x: GlobalConstants.WINDOW_WIDTH - 105,
		y: 5,
		width: 100,
		height: 35,
		backgroundColor: ButtonUtil.STANDARD_SECONDARY_BACKGROUND_COLOR,
		hoverColor: ButtonUtil.STANDARD_HOVER_COLOR,
		clickColor: ButtonUtil.STANDARD_CLICK_COLOR,
		text: "Credits",
		textXOffset: 15,
		textYOffset: 8,
		font: GameFont.SimpleFont,
		fontSize: 20
	});

	let getNextFrame: getNextFrame = function ({ keyboardInput, mouseInput, previousKeyboardInput, previousMouseInput, displayProcessing, soundOutput, musicOutput, thisFrame }) {

		if (globalState.debugMode) {
			if (keyboardInput.isPressed(Key.T) && !previousKeyboardInput.isPressed(Key.T))
				return TestingFrame.getFrame(globalState, sessionState);
		}

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

		musicOutput.playMusic(GameMusic.MainTheme, 100);

		if (keyboardInput.isPressed(Key.Enter) && !previousKeyboardInput.isPressed(Key.Enter)
				|| keyboardInput.isPressed(Key.Space) && !previousKeyboardInput.isPressed(Key.Space)
				|| keyboardInput.isPressed(Key.Z) && !previousKeyboardInput.isPressed(Key.Z)) {
			soundOutput.playSound(GameSound.Click, 100);
			return ChooseDifficultyFrame.getFrame(globalState, sessionState);
		}

		let clickedCreditsButton: boolean = creditsButton.processFrame(mouseInput).wasClicked;

		if (clickedCreditsButton) {
			soundOutput.playSound(GameSound.Click, 100);
			return CreditsFrame.getFrame(globalState, sessionState);
		}

		return thisFrame;
	};

	let render = function (displayOutput: IDisplayOutput) {
		displayOutput.drawRectangle(0, 0, GlobalConstants.WINDOW_WIDTH, GlobalConstants.WINDOW_HEIGHT, GlobalConstants.STANDARD_BACKGROUND_COLOR, true);

		displayOutput.drawText(
			Math.floor(GlobalConstants.WINDOW_WIDTH / 2) - 440,
			510,
			"Tux Planet 2: Konqi's Fiery Adventure",
			GameFont.SimpleFont,
			48,
			black);

		displayOutput.drawText(
			Math.floor(GlobalConstants.WINDOW_WIDTH / 2) - 129,
			350,
			"Start (press enter)",
			GameFont.SimpleFont,
			28,
			black);

		let versionInfo = VersionInfo.getCurrentVersion();
		let versionString = "v" + versionInfo.version;

		displayOutput.drawText(
			GlobalConstants.WINDOW_WIDTH - 42,
			55,
			versionString,
			GameFont.SimpleFont,
			16,
			black);

		creditsButton.render(displayOutput);

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
