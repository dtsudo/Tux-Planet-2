
// REVIEW ME

let Enemy_Flyamanita: { getEnemy: (xMibi: number, yMibi: number, yAngleScaled: number, enemyId: number) => IEnemy } = {} as any;

((function () {
	let ATTACK_COOLDOWN = 120;

	let getEnemy = function (
			xMibi: number,
			yMibi: number,
			yInitialMibi: number,
			yAngleScaled: number,
			hp: number,
			attackCooldown: number,
			frameCounter: number,
			screenWipeCountdown: number | null,
			enemyId: number): IEnemy {

		let processFrame: processFrameFunction = function (thisObj, enemyMapping, rngSeed, nextEnemyId, difficulty, playerState, soundOutput) {

			let rng = DTDeterministicRandomUtil.getRandom(rngSeed);

			let x = xMibi >> 10;
			let y = yMibi >> 10;
			if (x < -50 || x > GlobalConstants.WINDOW_WIDTH + 150 || y < -50 || y > GlobalConstants.WINDOW_HEIGHT + 50)
				return {
					enemies: [],
					nextEnemyId: nextEnemyId,
					newRngSeed: rng.getSeed(),
					shouldEndLevel: false
				};

			if (hp <= 0 || screenWipeCountdown !== null && screenWipeCountdown <= 0) {
				let explode = Enemy_Background_Explode.getEnemy(xMibi, yMibi, 128 * 3, rng.nextInt(360 * 128), nextEnemyId);
				nextEnemyId++;
				return {
					enemies: [explode],
					nextEnemyId: nextEnemyId,
					newRngSeed: rng.getSeed(),
					shouldEndLevel: false
				};
			}

			xMibi -= 1000;

			yAngleScaled += 128 * 3;
			if (yAngleScaled >= 360 * 128)
				yAngleScaled -= 360 * 128;

			yMibi = yInitialMibi + Math.floor(100 * DTMath.sineScaled(yAngleScaled));

			let enemies = [thisObj];

			attackCooldown--;
			if (attackCooldown <= 0 && screenWipeCountdown === null) {
				attackCooldown = ATTACK_COOLDOWN;

				soundOutput.playSound(GameSound.EnemyShoot, 100);

				let increment: number;

				switch (difficulty) {
					case Difficulty.Easy:
						increment = 120 * 128;
						break;
					case Difficulty.Normal:
						increment = 60 * 128;
						break;
					case Difficulty.Hard:
						increment = 30 * 128;
						break;
				}

				for (let i = rng.nextInt(increment); i < 360 * 128; i += increment) {
					enemies.push(Enemy_Bullet_Noone.getEnemy(
						xMibi,
						yMibi,
						i,
						rng.nextBool(),
						rng.nextInt(360 * 128),
						difficulty,
						nextEnemyId));
					nextEnemyId++;
				}
			}

			if (screenWipeCountdown !== null)
				screenWipeCountdown--;

			frameCounter++;

			return {
				enemies: enemies,
				nextEnemyId: nextEnemyId,
				newRngSeed: rng.getSeed(),
				shouldEndLevel: false
			};
		};

		let getHitboxes = function () {
			return [{
				xMibi: xMibi - 24 * 1024,
				yMibi: yMibi - 24 * 1024,
				widthMibi: 48 * 1024,
				heightMibi: 48 * 1024
			}];
		};

		let getDamageboxes = function () {
			return [{
				xMibi: xMibi - 24 * 1024,
				yMibi: yMibi - 24 * 1024,
				widthMibi: 48 * 1024,
				heightMibi: 48 * 1024
			}];
		};

		let render = function (displayOutput: IDisplayOutput) {
			let spriteNum = Math.floor(frameCounter / 10) % 4;

			displayOutput.drawImageRotatedClockwise(
				GameImage.FlyAmanita,
				spriteNum * 20,
				0,
				20,
				20,
				(xMibi >> 10) - 30,
				(yMibi >> 10) - 30,
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
			getSnapshot: getSnapshot,
			enemyId: enemyId,
			isBullet: false,
			isBackground: false,
			processFrame: processFrame,
			getHitboxes: getHitboxes,
			getDamageboxes: getDamageboxes,
			onCollideWithPlayer: function () { /* TODO */ return true; },
			onCollideWithPlayerBullet: onCollideWithPlayerBullet,
			onScreenWipe,
			render: render
		};
	};

	Enemy_Flyamanita.getEnemy = function (xMibi: number, yMibi: number, yAngleScaled: number, enemyId: number): IEnemy {
		yAngleScaled = DTMath.normalizeDegreesScaled(yAngleScaled);
		let hp = 50;
		return getEnemy(xMibi, yMibi, yMibi, yAngleScaled, hp, ATTACK_COOLDOWN, 0, null, enemyId);
	};
})());
