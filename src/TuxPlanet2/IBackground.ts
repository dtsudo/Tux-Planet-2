
// REVIEW ME

type IBackground = {
	getSnapshot: (thisObj: IBackground) => IBackground,
	processFrame: () => void,
	startBoss: () => void,
	render: (displayOutput: IDisplayOutput) => void
}
