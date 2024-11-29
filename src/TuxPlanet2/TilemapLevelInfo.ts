
type TilemapLevelInfo = {
	getXVelocityForEnemiesInMibipixelsPerFrame: () => number,
	hasReachedEndOfMap: (xOffsetInMibipixels: number, widthInTiles: number) => boolean,
	getNewXOffsetInMibipixels: (currentXOffsetInMibipixels: number, widthInTiles: number, bossFrameCounter: number | null) => number,
	getDarkenBackgroundAlpha: (bossFrameCounter: number) => number
}
