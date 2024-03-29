
type MusicVolumePicker = {
	processFrame: (mouseInput: IMouse, previousMouseInput: IMouse) => void,
	getCurrentMusicVolume: () => number,
	render: (displayOutput: IDisplayOutput) => void
}

let MusicVolumePickerUtil = {
	getMusicVolumePicker: function (xPos: number, yPos: number, initialVolume: number, color: VolumePickerColor): MusicVolumePicker {
		let currentVolume = initialVolume;
		let unmuteVolume = currentVolume;
		let isDraggingVolumeSlider = false;

		let processFrame = function (mouseInput: IMouse, previousMouseInput: IMouse) {
			let mouseX = mouseInput.getX();
			let mouseY = mouseInput.getY();

			if (mouseInput.isLeftMouseButtonPressed()
					&& !previousMouseInput.isLeftMouseButtonPressed()
					&& xPos <= mouseX
					&& mouseX <= xPos + 40
					&& yPos <= mouseY
					&& mouseY <= yPos + 50) {
				if (currentVolume === 0) {
					currentVolume = unmuteVolume === 0 ? 50 : unmuteVolume;
					unmuteVolume = currentVolume;
				} else {
					unmuteVolume = currentVolume;
					currentVolume = 0;
				}
			}

			if (mouseInput.isLeftMouseButtonPressed()
					&& !previousMouseInput.isLeftMouseButtonPressed()
					&& xPos + 50 <= mouseX
					&& mouseX <= xPos + 150
					&& yPos + 10 <= mouseY
					&& mouseY <= yPos + 40) {
				isDraggingVolumeSlider = true;
			}

			if (isDraggingVolumeSlider && mouseInput.isLeftMouseButtonPressed()) {
				let volume = Math.round(mouseX - (xPos + 50));
				if (volume < 0)
					volume = 0;
				if (volume > 100)
					volume = 100;

				currentVolume = volume;
				unmuteVolume = currentVolume;
			}

			if (!mouseInput.isLeftMouseButtonPressed())
				isDraggingVolumeSlider = false;
		};

		let getCurrentMusicVolume = function (): number {
			return currentVolume;
		};

		let render = function (displayOutput: IDisplayOutput) {

			let gameImage: GameImage;
			let dtColor: DTColor;

			switch (color) {
				case VolumePickerColor.Black:
					gameImage = currentVolume > 0 ? GameImage.MusicOn_Black : GameImage.MusicOff_Black;
					dtColor = black;
					break;
				case VolumePickerColor.White:
					gameImage = currentVolume > 0 ? GameImage.MusicOn_White : GameImage.MusicOff_White;
					dtColor = white;
					break;
			}

			displayOutput.drawImage(gameImage, xPos, yPos);

			displayOutput.drawRectangle(
				xPos + 50,
				yPos + 10,
				101,
				31,
				dtColor,
				false);

			if (currentVolume > 0)
				displayOutput.drawRectangle(
					xPos + 50,
					yPos + 10,
					currentVolume,
					31,
					dtColor,
					true);
		};

		return {
			processFrame,
			getCurrentMusicVolume,
			render
		};
	}
};
