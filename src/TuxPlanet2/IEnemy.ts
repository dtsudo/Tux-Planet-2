
// REVIEW ME

type Hitbox = {
	xMibi: number,
	yMibi: number,
	widthMibi: number,
	heightMibi: number
}

type EnemyProcessFrameResult = {
	enemies: IEnemy[],
	newRngSeed: number,
	nextEnemyId: number,
	shouldEndLevel?: boolean,
	musicToPlay?: GameMusic,
	shouldScreenWipe?: boolean,
	shouldCreateAutoSavestate?: boolean,
	bossHealthDisplayValue?: number | null,
	cutscene?: ICutscene
}

type processFrameFunction = (
	thisObj: IEnemy,
	enemyMapping: { [index: number]: IEnemy },
	rngSeed: number,
	nextEnemyId: number,
	difficulty: Difficulty,
	playerState: PlayerState,
	soundOutput: ISoundOutput) => EnemyProcessFrameResult;

type IEnemy = {
	getSnapshot: (thisObj: IEnemy) => IEnemy,
	enemyId: number,
	isBullet: boolean,
	isBackground: boolean,
	processFrame: processFrameFunction,
	getHitboxes: () => Hitbox[] | null,
	getDamageboxes: () => Hitbox[] | null,
	onCollideWithPlayer: (playerState: PlayerState) => boolean,
	onCollideWithPlayerBullet: (playerBullet: PlayerBullet) => boolean,
	onScreenWipe: (countdown: number, gameState: GameState) => void,
	render: (displayOutput: IDisplayOutput) => void
}
