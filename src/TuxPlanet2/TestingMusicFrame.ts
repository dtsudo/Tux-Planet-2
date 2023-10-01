
let TestingMusicFrame: { getFrame: (globalState: GlobalState, sessionState: SessionState) => IFrame } = {} as any;

TestingMusicFrame.getFrame = function (globalState: GlobalState, sessionState: SessionState): IFrame {

	let volumePicker: SoundAndMusicVolumePicker | null = null;

	let getNextFrame: getNextFrame = function (keyboardInput, mouseInput, previousKeyboardInput, previousMouseInput, displayProcessing, soundOutput, musicOutput, thisFrame) {
		if (keyboardInput.isPressed(Key.Esc) && !previousKeyboardInput.isPressed(Key.Esc))
			return TestingFrame.getFrame(globalState, sessionState);

		if (volumePicker === null)
			volumePicker = SoundAndMusicVolumePickerUtil.getSoundAndMusicVolumePicker(
				0,
				0,
				soundOutput.getSoundVolume(),
				musicOutput.getMusicVolume());

		volumePicker.processFrame(mouseInput, previousMouseInput);
		soundOutput.setSoundVolume(volumePicker.getCurrentSoundVolume());
		musicOutput.setMusicVolume(volumePicker.getCurrentMusicVolume());

		let music: GameMusic | null = null;
		if (keyboardInput.isPressed(Key.One))
			music = GameMusic.ChiptuneLevel1;
		if (keyboardInput.isPressed(Key.Two))
			music = GameMusic.ChiptuneLevel3;

		if (music !== null)
			musicOutput.playMusic(music, 100);

		if (keyboardInput.isPressed(Key.Three))
			musicOutput.stopMusic();

		return thisFrame;
	};
	
	let render = function (displayOutput: IDisplayOutput) {
		let backgroundColor: DTColor = { r: 225, g: 225, b: 225, alpha: 255 };
		displayOutput.drawRectangle(0, 0, GlobalConstants.WINDOW_WIDTH, GlobalConstants.WINDOW_HEIGHT, backgroundColor, true);

		if (volumePicker !== null)
			volumePicker.render(displayOutput);

		displayOutput.drawText(
			50,
			GlobalConstants.WINDOW_HEIGHT - 50,
			"Press 1/2 to switch music tracks." + "\n" + "Press 3 to stop music.",
			GameFont.SimpleFont,
			24,
			black);
	};
	
	return {
		getNextFrame,
		render,
		getClickUrl: function () { return null; },
		getCompletedAchievements: function () { return null; }
	};
};
