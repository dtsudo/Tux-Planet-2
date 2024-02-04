
const enum VolumePickerColor {
	Black,
	White
}

type SoundAndMusicVolumePicker = {
	processFrame: (mouseInput: IMouse, previousMouseInput: IMouse) => void,
	getCurrentSoundVolume: () => number,
	getCurrentMusicVolume: () => number,
	render: (displayOutput: IDisplayOutput) => void
}

let SoundAndMusicVolumePickerUtil = {
	getSoundAndMusicVolumePicker: function (xPos: number, yPos: number, initialSoundVolume: number, initialMusicVolume: number, color: VolumePickerColor): SoundAndMusicVolumePicker {
		let soundVolumePicker: SoundVolumePicker = SoundVolumePickerUtil.getSoundVolumePicker(xPos, yPos + 50, initialSoundVolume, color);
		let musicVolumePicker: MusicVolumePicker = MusicVolumePickerUtil.getMusicVolumePicker(xPos, yPos, initialMusicVolume, color);

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
			getCurrentSoundVolume: function () { return soundVolumePicker.getCurrentSoundVolume(); },
			getCurrentMusicVolume: function () { return musicVolumePicker.getCurrentMusicVolume(); },
			render
		};
	}
};
