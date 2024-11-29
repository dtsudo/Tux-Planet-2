
type Tilemap = {
	getSnapshot: (thisObj: Tilemap) => Tilemap,
	getXVelocityForEnemiesInMibipixelsPerFrame: () => number,
	hasReachedEndOfMap: () => boolean,
	isSolid: (xMibi: number, yMibi: number) => boolean,
	isDeadly: (xMibi: number, yMibi: number) => boolean,
	startBoss: () => void,
	getNewEnemies: () => { xMibi: number, yMibi: number, id: number }[],
	processFrame: () => void,
	renderForeground: (displayOutput: IDisplayOutput) => void,
	renderBackground: (displayOutput: IDisplayOutput) => void
}
