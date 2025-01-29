
const enum OverworldMapTileType {
	Path,
	NonPath,
	Level
}

type OverworldMapTile = {
	tileType: OverworldMapTileType,
	level: Level | null,
	shouldShowLevelIcon: boolean | null,
	backgroundTile: { gameImage: GameImage, imageX: number, imageY: number } | null,
	foregroundTile: { gameImage: GameImage, imageX: number, imageY: number } | null
}

type OverworldMap = {
	tiles: OverworldMapTile[][],
	widthInTiles: number,
	heightInTiles: number
}
