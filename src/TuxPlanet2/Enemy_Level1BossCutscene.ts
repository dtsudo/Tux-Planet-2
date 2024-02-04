
type Level1BossCutsceneEnemy = {
	getXMibi: () => number,
	getYMibi: () => number,
	transformToLevel1Boss: () => void
}

let Enemy_Level1BossCutscene: { getEnemy: ({ enemyId }: { enemyId: number }) => IEnemy & Level1BossCutsceneEnemy } = {} as any;

((function () {

	let getEnemy = function (
			xMibi: number,
			yMibi: number,
			xSpeed: number,
			frameCounter: number,
			hasStartedCutscene: boolean,
			transformToBoss: boolean,
			enemyId: number): IEnemy & Level1BossCutsceneEnemy {

		let getXMibi = function () { return xMibi; };
		let getYMibi = function () { return yMibi; };

		let transformToLevel1Boss = function () {
			transformToBoss = true;
		};

		let processFrame: enemyProcessFrameFunction = function ({ thisObj, enemyMapping, rngSeed, nextEnemyId, difficulty, playerState, soundOutput }) {

			if (transformToBoss) {
				let boss = Enemy_Level1Boss_Phase1.getEnemy({
					xMibi: xMibi,
					yMibi: yMibi,
					frameCounter: frameCounter,
					enemyId: nextEnemyId++
				});
				return {
					enemies: [boss],
					nextEnemyId: nextEnemyId,
					newRngSeed: rngSeed
				};
			}

			xMibi -= xSpeed;

			xSpeed -= 40;
			if (xSpeed < 0)
				xSpeed = 0;

			frameCounter++;

			let cutscene: ICutscene | null = null;

			if (xSpeed <= 0 && !hasStartedCutscene) {
				hasStartedCutscene = true;

				cutscene = Cutscene_Level1Boss.getCutscene(enemyId);
			}

			let returnVal: EnemyProcessFrameResult = {
				enemies: [thisObj],
				nextEnemyId: nextEnemyId,
				newRngSeed: rngSeed
			};

			if (cutscene !== null)
				returnVal.cutscene = cutscene;

			return returnVal;
		};

		let getHitboxes = function () {
			return null;
		};

		let getDamageboxes = function () {
			let damagebox: Hitbox = {
				xMibi: xMibi - 16 * 3 * 1024,
				yMibi: yMibi - 16 * 3 * 1024,
				widthMibi: 32 * 3 * 1024,
				heightMibi: 32 * 3 * 1024
			};
			return [damagebox];
		};

		let render = function (displayOutput: IDisplayOutput) {
			let spriteNum = Math.floor(frameCounter / 10) % 4;

			displayOutput.drawImageRotatedClockwise(
				GameImage.OwlBrown,
				32 + spriteNum * 32,
				0,
				32,
				32,
				(xMibi >> 10) - 16 * 3,
				(yMibi >> 10) - 16 * 3,
				0,
				128 * 3);
		};

		let getSnapshot = function (thisObj: IEnemy): IEnemy & Level1BossCutsceneEnemy {
			return getEnemy(xMibi, yMibi, xSpeed, frameCounter, hasStartedCutscene, transformToBoss, enemyId);
		};

		let onCollideWithPlayerBullet = function (): boolean {
			return true;
		};

		return {
			getXMibi,
			getYMibi,
			transformToLevel1Boss,
			getSnapshot,
			enemyId,
			isBullet: false,
			isBackground: false,
			processFrame,
			getHitboxes,
			getDamageboxes,
			onCollideWithPlayer: function () { return false; },
			onCollideWithPlayerBullet,
			onScreenWipe: function (countdown: number) { },
			render
		};
	};

	Enemy_Level1BossCutscene.getEnemy = function ({ enemyId }: { enemyId: number }): IEnemy & Level1BossCutsceneEnemy {

		let xMibi = (GlobalConstants.WINDOW_WIDTH + 100) << 10;

		return getEnemy(xMibi, 350 * 1024, 5000, 0, false, false, enemyId);
	};
})());
