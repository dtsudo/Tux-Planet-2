
type ISoundOutput = {
	loadSounds: () => boolean,
	setSoundVolume: (volume: number) => void,
	getSoundVolume: () => number,
	playSound: (sound: GameSound, volume: number) => void
}

type ISoundProcessing = {
	processFrame: () => void
}
