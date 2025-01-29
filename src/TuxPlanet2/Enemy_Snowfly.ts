
let Enemy_Snowfly = ((function () {

	let getAttackCooldown = function (difficulty: Difficulty): number {
		switch (difficulty) {
			case Difficulty.Easy: return 70;
			case Difficulty.Normal: return 48;
			case Difficulty.Hard: return 20;
		}
	};

	let getEnemy = function (
		xMibi: number,
		yMibi: number,
		yInitialMibi: number,
		yAngleScaled: number,
		hp: number,
		attackCooldown: number | null,
		attackAngle1: number,
		attackAngle2: number,
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

			yAngleScaled += 48;
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

				let increment: number;
				let numBullets: number;

				switch (difficulty) {
					case Difficulty.Easy:
						increment = 700;
						numBullets = 3;
						break;
					case Difficulty.Normal:
						increment = 600;
						numBullets = 3;
						break;
					case Difficulty.Hard:
						increment = 1500;
						numBullets = 3;
						break;
				}

				attackAngle1 += increment;
				if (attackAngle1 >= 360 * 128)
					attackAngle1 -= 360 * 128;

				let delta = Math.floor(360 * 128 / numBullets);

				for (let i = 0; i < numBullets; i++) {
					enemies.push(Enemy_Bullet_Strawberry.getEnemy({
						xMibi: xMibi,
						yMibi: yMibi,
						angleScaled: attackAngle1 + delta * i,
						xVelocityOffsetInMibipixelsPerFrame: tilemap.getXVelocityForEnemiesInMibipixelsPerFrame(),
						hasCollisionWithTilemap: true,
						enemyId: nextEnemyId++
					}));
				}

				attackAngle2 -= increment;
				if (attackAngle2 < 0)
					attackAngle2 += 360 * 128;

				for (let i = 0; i < numBullets; i++) {
					enemies.push(Enemy_Bullet_Strawberry.getEnemy({
						xMibi: xMibi,
						yMibi: yMibi,
						angleScaled: attackAngle2 + delta * i,
						xVelocityOffsetInMibipixelsPerFrame: tilemap.getXVelocityForEnemiesInMibipixelsPerFrame(),
						hasCollisionWithTilemap: true,
						enemyId: nextEnemyId++
					}));
				}
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
				xMibi: xMibi - 3 * 7 * 1024,
				yMibi: yMibi - 3 * 8 * 1024,
				widthMibi: 3 * 14 * 1024,
				heightMibi: 3 * 16 * 1024
			}];
		};

		let render = function (displayOutput: IDisplayOutput) {
			let spriteNum = Math.floor(frameCounter / 20) % 4;

			displayOutput.drawImageRotatedClockwise(
				GameImage.Snowfly_Mirrored,
				spriteNum * 15,
				0,
				15,
				18,
				(xMibi >> 10) - 3 * 7,
				(yMibi >> 10) - 3 * 9,
				0,
				128 * 3);
		};

		let getSnapshot = function (thisObj: IEnemy) {
			return getEnemy(xMibi, yMibi, yInitialMibi, yAngleScaled, hp, attackCooldown, attackAngle1, attackAngle2, frameCounter, screenWipeCountdown, enemyId);
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

	return {
		getEnemy: function ({ xMibi, yInitialMibi, yAngleScaled, attackAngle1, attackAngle2, difficulty, enemyId }: { xMibi: number, yInitialMibi: number, yAngleScaled: number, attackAngle1: number, attackAngle2: number, difficulty: Difficulty, enemyId: number }): IEnemy {

			yAngleScaled = DTMath.normalizeDegreesScaled(yAngleScaled);
			attackAngle1 = DTMath.normalizeDegreesScaled(attackAngle1);
			attackAngle2 = DTMath.normalizeDegreesScaled(attackAngle2);

			let hp: number;

			switch (difficulty) {
				case Difficulty.Easy: hp = 42; break;
				case Difficulty.Normal: hp = 46; break;
				case Difficulty.Hard: hp = 50; break;
			}

			let yMibi = yInitialMibi + 90 * DTMath.sineScaled(yAngleScaled);

			return getEnemy(xMibi, yMibi, yInitialMibi, yAngleScaled, hp, null, attackAngle1, attackAngle2, 0, null, enemyId);
		}
	};
})());
