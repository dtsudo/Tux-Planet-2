
type ISoundOutput = {
	loadSounds: () => boolean,
	setSoundVolume: (volume: number) => void,
	getSoundVolume: () => number,
	playSound: (sound: GameSound, volume: number) => void
}

type ISoundProcessing = {
	processFrame: () => void
}

let MuteAllSound_SoundOutput = {
	getSoundOutput: function (soundOutput: ISoundOutput): ISoundOutput {
		return {
			loadSounds: soundOutput.loadSounds,
			setSoundVolume: soundOutput.setSoundVolume,
			getSoundVolume: soundOutput.getSoundVolume,
			playSound: function (sound: GameSound, volume: number) { }
		};
	}
};
