
type SoundAndMusicVolumePicker = {
	processFrame: (mouseInput: IMouse, previousMouseInput: IMouse) => void,
	getCurrentSoundVolume: () => number,
	getCurrentMusicVolume: () => number,
	render: (displayOutput: IDisplayOutput) => void
}

let SoundAndMusicVolumePickerUtil = {
	getSoundAndMusicVolumePicker: function (xPos: number, yPos: number, initialSoundVolume: number, initialMusicVolume: number): SoundAndMusicVolumePicker {
		let soundVolumePicker: SoundVolumePicker = SoundVolumePickerUtil.getSoundVolumePicker(xPos, yPos + 50, initialSoundVolume);
		let musicVolumePicker: MusicVolumePicker = MusicVolumePickerUtil.getMusicVolumePicker(xPos, yPos, initialMusicVolume);

		let processFrame = function (mouseInput: IMouse, previousMouseInput: IMouse) {
			soundVolumePicker.processFrame(mouseInput, previousMouseInput);
			musicVolumePicker.processFrame(mouseInput, previousMouseInput);
		};

		let render = function (displayOutput: IDisplayOutput) {
			soundVolumePicker.render(displayOutput);
			musicVolumePicker.render(displayOutput);
		};

		return {
			processFrame,
			getCurrentSoundVolume: soundVolumePicker.getCurrentSoundVolume,
			getCurrentMusicVolume: musicVolumePicker.getCurrentMusicVolume,
			render
		};
	}
};
