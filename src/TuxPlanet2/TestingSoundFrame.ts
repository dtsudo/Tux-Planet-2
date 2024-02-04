
let TestingSoundFrame: { getFrame: (globalState: GlobalState, sessionState: SessionState) => IFrame } = {} as any;

TestingSoundFrame.getFrame = function (globalState: GlobalState, sessionState: SessionState): IFrame {
	"use strict";

	let volumePicker: SoundAndMusicVolumePicker | null = null;
	let cooldown = 0;

	let getNextFrame: getNextFrame = function ({ keyboardInput, mouseInput, previousKeyboardInput, previousMouseInput, displayProcessing, soundOutput, musicOutput, thisFrame }) {
		if (keyboardInput.isPressed(Key.Esc) && !previousKeyboardInput.isPressed(Key.Esc))
			return TestingFrame.getFrame(globalState, sessionState);

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

		cooldown--;

		if (cooldown <= 0) {
			soundOutput.playSound(GameSound.Click, 100);

			cooldown += 60;
		}

		return thisFrame;
	};
	
	let render = function (displayOutput: IDisplayOutput) {
		let backgroundColor: DTColor = { r: 225, g: 225, b: 225, alpha: 255 };
		displayOutput.drawRectangle(0, 0, GlobalConstants.WINDOW_WIDTH, GlobalConstants.WINDOW_HEIGHT, backgroundColor, true);

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
