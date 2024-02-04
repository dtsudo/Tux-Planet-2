
let InitialLoadingScreenFrame: { getFrame: (globalState: GlobalState) => IFrame } = {} as any;

InitialLoadingScreenFrame.getFrame = function (globalState: GlobalState): IFrame {

	let getNextFrame: getNextFrame = function ({ keyboardInput, mouseInput, previousKeyboardInput, previousMouseInput, displayProcessing, soundOutput, musicOutput, thisFrame }) {
		let isDoneLoadingDisplayProcessing = displayProcessing.load();
		let isDoneLoadingSounds = soundOutput.loadSounds();
		let isDoneLoadingMusic = musicOutput.loadMusic();

		if (!isDoneLoadingDisplayProcessing || !isDoneLoadingSounds || !isDoneLoadingMusic) 
			return thisFrame;

		let soundVolume: number | null = globalState.saveAndLoadData.loadSoundVolume();
		let musicVolume: number | null = globalState.saveAndLoadData.loadMusicVolume();

		soundOutput.setSoundVolume(soundVolume !== null ? soundVolume : 50);
		musicOutput.setMusicVolume(musicVolume !== null ? musicVolume : 50);

		let sessionState = {};
		globalState.saveAndLoadData.loadSessionState(sessionState);

		return TitleScreenFrame.getFrame(globalState, sessionState);
	};
	
	let render = function (displayOutput: IDisplayOutput) {
		displayOutput.drawRectangle(0, 0, GlobalConstants.WINDOW_WIDTH, GlobalConstants.WINDOW_HEIGHT, GlobalConstants.STANDARD_BACKGROUND_COLOR, true);

		displayOutput.tryDrawText(
			Math.floor(GlobalConstants.WINDOW_WIDTH / 2) - 80,
			Math.floor(GlobalConstants.WINDOW_HEIGHT / 2) + 33,
			"Loading...",
			GameFont.SimpleFont,
			32,
			black);
	};
	
	return {
		getNextFrame,
		render,
		getClickUrl: function () { return null; },
		getCompletedAchievements: function () { return null; }
	};
};
