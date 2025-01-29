
type GameState = {
	playerState: PlayerState,
	playerBulletState: PlayerBulletState,
	enemies: IEnemy[],
	nextEnemyId: number,
	tilemap: Tilemap,
	frameCount: number,
	rngSeed: number,
	cutscene: ICutscene | null,
	bossHealthDisplay: BossHealthDisplay,
	level: Level,
	difficulty: Difficulty,
	background: IBackground,
	debug_isInvulnerable: boolean
}

let GameStateUtil = {
	getSnapshot: function (gameState: GameState): GameState {
		let playerState = gameState.playerState;

		let playerStateSnapshot: PlayerState = {
			xMibi: playerState.xMibi,
			yMibi: playerState.yMibi,
			attackCooldown: playerState.attackCooldown,
			attackSoundCooldown: playerState.attackSoundCooldown,
			isDeadFrameCount: playerState.isDeadFrameCount
		};

		let playerBulletStateSnapshot = {
			playerBullets: gameState.playerBulletState.playerBullets.map(x => ({
				xMibi: x.xMibi,
				yMibi: x.yMibi,
				xSpeedInMibipixelsPerFrame: x.xSpeedInMibipixelsPerFrame,
				ySpeedInMibipixelsPerFrame: x.ySpeedInMibipixelsPerFrame,
				displayRotationScaled: x.displayRotationScaled,
				animationOffset: x.animationOffset
			}))
		};

		let enemiesSnapshot: IEnemy[] = gameState.enemies.map(x => x.getSnapshot(x));

		return {
			playerState: playerStateSnapshot,
			playerBulletState: playerBulletStateSnapshot,
			enemies: enemiesSnapshot,
			nextEnemyId: gameState.nextEnemyId,
			tilemap: gameState.tilemap.getSnapshot(gameState.tilemap),
			frameCount: gameState.frameCount,
			rngSeed: gameState.rngSeed,
			level: gameState.level,
			difficulty: gameState.difficulty,
			cutscene: gameState.cutscene !== null ? gameState.cutscene.getSnapshot(gameState.cutscene) : null,
			bossHealthDisplay: gameState.bossHealthDisplay.getSnapshot(gameState.bossHealthDisplay),
			background: gameState.background.getSnapshot(gameState.background),
			debug_isInvulnerable: gameState.debug_isInvulnerable
		};
	},

	getInitialGameState: function (level: Level, difficulty: Difficulty, displayProcessing: IDisplayProcessing): GameState {

		let enemy: IEnemy;
		let background: IBackground;
		let nextEnemyId = 1;
		let tilemap: Tilemap;

		switch (level) {
			case Level.Level1:
				enemy = Enemy_Level1.getEnemy({ enemyId: nextEnemyId++ });
				background = Background_Ocean.getBackground();
				tilemap = TilemapUtil.getTilemap(MapData.Level1, TilemapLevelInfo_Level1.getLevel1TilemapLevelInfo(), displayProcessing);
				break;
			case Level.Level2:
				enemy = Enemy_Level2.getEnemy({ enemyId: nextEnemyId++ });
				background = Background_Ocean.getBackground();
				tilemap = TilemapUtil.getTilemap(MapData.Level2, TilemapLevelInfo_Level2.getLevel2TilemapLevelInfo(), displayProcessing);
				break;
		}

		return {
			playerState: {
				xMibi: 50 * 1024,
				yMibi: Math.floor(GlobalConstants.WINDOW_HEIGHT / 2) * 1024,
				attackCooldown: 0,
				attackSoundCooldown: 0,
				isDeadFrameCount: null
			},
			playerBulletState: {
				playerBullets: []
			},
			enemies: [enemy],
			nextEnemyId: nextEnemyId,
			tilemap: tilemap,
			frameCount: 0,
			rngSeed: 0,
			level: level,
			difficulty: difficulty,
			cutscene: null,
			bossHealthDisplay: BossHealthDisplayUtil.getDisplay(),
			background: background,
			debug_isInvulnerable: false
		};
	}
};
