
type IMusicOutput = {
	loadMusic: () => boolean,
	playMusic: (music: GameMusic, volume: number) => void,
	stopMusic: () => void,
	setMusicVolume: (volume: number) => void,
	getMusicVolume: () => number
}

type IMusicProcessing = {
	processFrame: () => void
}
