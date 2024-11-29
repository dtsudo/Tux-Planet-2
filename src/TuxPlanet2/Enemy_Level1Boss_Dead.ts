
let Enemy_Level1Boss_Dead: { getEnemy: ({ xMibi, yMibi, xSpeed, ySpeed, frameCounter, enemyId }: { xMibi: number, yMibi: number, xSpeed: number, ySpeed: number, frameCounter: number, enemyId: number }) => IEnemy } = {} as any;

((function () {

	let getEnemy = function (
			xMibi: number,
			yMibi: number,
			xSpeed: number,
			ySpeed: number,
			frameCounter: number,
			deadFrameCount: number,
			enemyId: number): IEnemy {

		let processFrame: enemyProcessFrameFunction = function ({ thisObj, enemyMapping, rngSeed, nextEnemyId, difficulty, playerState, soundOutput, tilemap }) {

			let rng = DTDeterministicRandomUtil.getRandom(rngSeed);

			xMibi += xSpeed;
			yMibi += ySpeed;

			if (-8 < ySpeed && ySpeed < 8)
				ySpeed = 0;

			if (ySpeed < 0)
				ySpeed += 8;

			if (ySpeed > 0)
				ySpeed -= 8;

			let handleCollisionWithTilemapResult = Enemy_Level1Boss_Phase1.handleCollisionWithTilemap({ xMibi, yMibi, ySpeed, tilemap });
			yMibi = handleCollisionWithTilemapResult.newYMibi;
			ySpeed = handleCollisionWithTilemapResult.newYSpeed;

			let enemies = [thisObj];

			frameCounter++;
			deadFrameCount++;

			if (deadFrameCount % 8 === 0) {
				let explodeXMibi = xMibi;
				let explodeYMibi = yMibi;

				explodeXMibi += (rng.nextInt(100) - 50) << 10;
				explodeYMibi += (rng.nextInt(100) - 50) << 10;

				enemies.push(Enemy_Background_Explode.getEnemy({
					xMibi: explodeXMibi,
					yMibi: explodeYMibi,
					displayAngleScaled: rng.nextInt(128 * 360),
					scalingFactorScaled: 128 * 3,
					renderOnTop: true,
					enemyId: nextEnemyId++
				}));
			}

			let returnVal: EnemyProcessFrameResult = {
				enemies: enemies,
				nextEnemyId: nextEnemyId,
				newRngSeed: rng.getSeed(),
				musicToPlay: Enemy_Level1Boss_Phase1.BOSS_MUSIC,
				bossHealthDisplayValue: 0
			};

			if (deadFrameCount === 1)
				returnVal.shouldScreenWipe = true;

			if (deadFrameCount > GameStateProcessing.SCREEN_WIPE_MAX_COUNTDOWN + 180 && playerState.isDeadFrameCount === null)
				returnVal.shouldEndLevel = true;

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
			let spriteNum = Math.floor(frameCounter / 20) % 4;

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

		let getSnapshot = function (thisObj: IEnemy): IEnemy {
			return getEnemy(xMibi, yMibi, xSpeed, ySpeed, frameCounter, deadFrameCount, enemyId);
		};

		return {
			getSnapshot: getSnapshot,
			enemyId: enemyId,
			isBullet: false,
			isBackground: false,
			processFrame: processFrame,
			getHitboxes: getHitboxes,
			getDamageboxes: getDamageboxes,
			onCollideWithPlayer: function () { return false; },
			onCollideWithPlayerBullet: function () { return true; },
			onScreenWipe: function () { },
			render: render
		};
	};

	Enemy_Level1Boss_Dead.getEnemy = function ({ xMibi, yMibi, xSpeed, ySpeed, frameCounter, enemyId }: { xMibi: number, yMibi: number, xSpeed: number, ySpeed: number, frameCounter: number, enemyId: number }): IEnemy {
		return getEnemy(xMibi, yMibi, xSpeed, ySpeed, frameCounter, 0, enemyId);
	};
})());
