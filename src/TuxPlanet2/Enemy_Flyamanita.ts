
let Enemy_Flyamanita: {
	getEnemy: ({ xMibi, yInitialMibi, yAngleScaled, difficulty, enemyId }: { xMibi: number, yInitialMibi: number, yAngleScaled: number, difficulty: Difficulty, enemyId: number }) => IEnemy
} = {} as any;

((function () {

	let getAttackCooldown = function (difficulty: Difficulty): number {
		switch (difficulty) {
			case Difficulty.Easy: return 190;
			case Difficulty.Normal: return 72; 
			case Difficulty.Hard: return 26; 
		}
	};

	let getEnemy = function (
			xMibi: number,
			yMibi: number,
			yInitialMibi: number,
			yAngleScaled: number,
			hp: number,
			attackCooldown: number | null,
			frameCounter: number,
			screenWipeCountdown: number | null,
			enemyId: number): IEnemy {

		let processFrame: enemyProcessFrameFunction = function ({ thisObj, enemyMapping, rngSeed, nextEnemyId, difficulty, playerState, tilemap, soundOutput }) {

			let rng = DTDeterministicRandomUtil.getRandom(rngSeed);

			let x = xMibi >> 10;
			let y = yMibi >> 10;
			if (x < -50 || x > GlobalConstants.WINDOW_WIDTH + 250 || y < -250 || y > GlobalConstants.WINDOW_HEIGHT + 250)
				return {
					enemies: [],
					nextEnemyId: nextEnemyId,
					newRngSeed: rng.getSeed()
				};

			if (hp <= 0 || screenWipeCountdown !== null && screenWipeCountdown <= 0) {
				let explode = Enemy_Background_Explode.getEnemy({
					xMibi: xMibi,
					yMibi: yMibi,
					displayAngleScaled: rng.nextInt(4) * (90 * 128),
					scalingFactorScaled: 128 * 3,
					renderOnTop: false,
					enemyId: nextEnemyId++
				});
				return {
					enemies: [explode],
					nextEnemyId: nextEnemyId,
					newRngSeed: rng.getSeed()
				};
			}

			xMibi += tilemap.getXVelocityForEnemiesInMibipixelsPerFrame();

			yAngleScaled += 192;
			if (yAngleScaled >= 360 * 128)
				yAngleScaled -= 360 * 128;

			yMibi = yInitialMibi + 90 * DTMath.sineScaled(yAngleScaled);

			let enemies = [thisObj];

			if (attackCooldown === null)
				attackCooldown = rng.nextInt(getAttackCooldown(difficulty));

			attackCooldown--;
			if (attackCooldown <= 0 && screenWipeCountdown === null) {
				attackCooldown = getAttackCooldown(difficulty);

				soundOutput.playSound(GameSound.EnemyShoot, 100);

				let freezewaveSpeed;

				switch (difficulty) {
					case Difficulty.Easy: freezewaveSpeed = 3; break;
					case Difficulty.Normal: freezewaveSpeed = 4; break;
					case Difficulty.Hard: freezewaveSpeed = 4; break;
				}

				enemies.push(Enemy_Bullet_Freezewave.getEnemy({
					xMibi: xMibi,
					yMibi: yMibi,
					playerState: playerState,
					speed: freezewaveSpeed,
					scalingFactorScaled: 192,
					hasCollisionWithTilemap: true,
					enemyId: nextEnemyId++
				}));
			}

			if (screenWipeCountdown !== null)
				screenWipeCountdown--;

			frameCounter++;

			return {
				enemies: enemies,
				nextEnemyId: nextEnemyId,
				newRngSeed: rng.getSeed()
			};
		};

		let getHitboxes = function () {
			return [{
				xMibi: xMibi - 3 * 7 * 1024,
				yMibi: yMibi - 3 * 7 * 1024,
				widthMibi: 3 * 14 * 1024,
				heightMibi: 3 * 14 * 1024
			}];
		};

		let getDamageboxes = function () {
			return [{
				xMibi: xMibi - 3 * 8 * 1024,
				yMibi: yMibi - 3 * 8 * 1024,
				widthMibi: 3 * 16 * 1024,
				heightMibi: 3 * 16 * 1024
			}];
		};

		let render = function (displayOutput: IDisplayOutput) {
			let spriteNum = Math.floor(frameCounter / 20) % 4;

			displayOutput.drawImageRotatedClockwise(
				GameImage.FlyAmanita,
				spriteNum * 20,
				0,
				20,
				20,
				(xMibi >> 10) - 3 * 10,
				(yMibi >> 10) - 3 * 10,
				0,
				128 * 3);
		};

		let getSnapshot = function (thisObj: IEnemy) {
			return getEnemy(xMibi, yMibi, yInitialMibi, yAngleScaled, hp, attackCooldown, frameCounter, screenWipeCountdown, enemyId);
		};

		let onCollideWithPlayerBullet = function (): boolean {
			hp--;
			return true;
		};

		let onScreenWipe = function (countdown: number) {
			screenWipeCountdown = countdown;
		};

		return {
			getSnapshot,
			enemyId,
			isBullet: false,
			isBackground: false,
			processFrame,
			getHitboxes,
			getDamageboxes,
			onCollideWithPlayer: function () { return true; },
			onCollideWithPlayerBullet: onCollideWithPlayerBullet,
			onScreenWipe,
			render
		};
	};

	Enemy_Flyamanita.getEnemy = function ({ xMibi, yInitialMibi, yAngleScaled, difficulty, enemyId }: { xMibi: number, yInitialMibi: number, yAngleScaled: number, difficulty: Difficulty, enemyId: number }): IEnemy {

		yAngleScaled = DTMath.normalizeDegreesScaled(yAngleScaled);

		let hp: number;

		switch (difficulty) {
			case Difficulty.Easy: hp = 42; break;
			case Difficulty.Normal: hp = 46; break;
			case Difficulty.Hard: hp = 50; break;
		}

		let yMibi = yInitialMibi + 90 * DTMath.sineScaled(yAngleScaled);

		return getEnemy(xMibi, yMibi, yInitialMibi, yAngleScaled, hp, null, 0, null, enemyId);
	};
})());
