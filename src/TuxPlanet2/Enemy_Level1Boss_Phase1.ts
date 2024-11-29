
let Enemy_Level1Boss_Phase1: {
	BOSS_MUSIC: GameMusic,
	handleCollisionWithTilemap: ({ xMibi, yMibi, ySpeed, tilemap }: { xMibi: number, yMibi: number, ySpeed: number, tilemap: Tilemap }) => { newYMibi: number, newYSpeed: number },
	getEnemy: ({ xMibi, yMibi, frameCounter, enemyId }: { xMibi: number, yMibi: number, frameCounter: number, enemyId: number }) => IEnemy
} = {} as any;

Enemy_Level1Boss_Phase1.BOSS_MUSIC = GameMusic.ChiptuneLevel3;

Enemy_Level1Boss_Phase1.handleCollisionWithTilemap = function ({ xMibi, yMibi, ySpeed, tilemap }) {

	let yMibiLowerBound = yMibi - 16 * 3 * 1024;

	if (!tilemap.isSolid(xMibi, yMibiLowerBound)) {
		return {
			newYMibi: yMibi,
			newYSpeed: ySpeed
		};
	}

	let yMibiIncrease = 0;

	while (true) {
		if (!tilemap.isSolid(xMibi, yMibiLowerBound + yMibiIncrease + 100))
			break;
		yMibiIncrease += 100;
	}

	while (true) {
		if (!tilemap.isSolid(xMibi, yMibiLowerBound + yMibiIncrease + 20))
			break;
		yMibiIncrease += 20;
	}

	while (true) {
		if (!tilemap.isSolid(xMibi, yMibiLowerBound + yMibiIncrease + 4))
			break;
		yMibiIncrease += 4;
	}

	while (true) {
		if (!tilemap.isSolid(xMibi, yMibiLowerBound + yMibiIncrease + 1))
			break;
		yMibiIncrease += 1;
	}

	return {
		newYMibi: yMibi + yMibiIncrease + 1,
		newYSpeed: 0
	};
};

((function () {

	let INITIAL_HP = 1000;

	let getEnemy = function (
			xMibi: number,
			yMibi: number,
			xSpeed: number,
			ySpeed: number,
			frameCounter: number,
			attackCooldown1: number,
			attackCooldown2: number,
			attack2AngleScaled1: number,
			attack2AngleScaled2: number,
			transitionToPhase2Counter: number | null,
			hp: number,
			enemyId: number): IEnemy {

		let processFrame: enemyProcessFrameFunction = function ({ thisObj, enemyMapping, rngSeed, nextEnemyId, difficulty, playerState, soundOutput, tilemap }) {

			let rng = DTDeterministicRandomUtil.getRandom(rngSeed);

			frameCounter++;

			xMibi += xSpeed;
			yMibi += ySpeed;

			if (playerState.yMibi - yMibi >= 1024 * 20) {
				if (ySpeed < 500)
					ySpeed += 8;
			}

			if (playerState.yMibi - yMibi <= -1024 * 20) {
				if (ySpeed > -500)
					ySpeed -= 8;
			}

			let handleCollisionWithTilemapResult = Enemy_Level1Boss_Phase1.handleCollisionWithTilemap({ xMibi, yMibi, ySpeed, tilemap });
			yMibi = handleCollisionWithTilemapResult.newYMibi;
			ySpeed = handleCollisionWithTilemapResult.newYSpeed;

			let enemies = [thisObj];

			let ATTACK_COOLDOWN_1 = 180;

			attackCooldown1--;
			if (attackCooldown1 <= 0 && transitionToPhase2Counter === null) {
				attackCooldown1 = ATTACK_COOLDOWN_1;
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
					enemies.push(Enemy_Bullet_Noone.getEnemy({
						xMibi: xMibi,
						yMibi: yMibi,
						directionScaled: i,
						xVelocityOffsetInMibipixelsPerFrame: 0,
						rotatesClockwise: rng.nextBool(),
						displayAngleScaled: rng.nextInt(360 * 128),
						gameImage: GameImage.NooneIce,
						difficulty: difficulty,
						enemyId: nextEnemyId++
					}));
				}
			}

			let ATTACK_COOLDOWN_2: number;

			switch (difficulty) {
				case Difficulty.Easy: ATTACK_COOLDOWN_2 = 40; break;
				case Difficulty.Normal: ATTACK_COOLDOWN_2 = 48; break;
				case Difficulty.Hard: ATTACK_COOLDOWN_2 = 20; break;
			}

			attackCooldown2--;
			if (attackCooldown2 <= 0 && transitionToPhase2Counter === null) {
				attackCooldown2 = ATTACK_COOLDOWN_2;
				soundOutput.playSound(GameSound.EnemyShoot, 100);

				let increment: number;
				let numBullets: number;

				switch (difficulty) {
					case Difficulty.Easy:
						increment = 500;
						numBullets = 3;
						break;
					case Difficulty.Normal:
						increment = 600;
						numBullets = 5;
						break;
					case Difficulty.Hard:
						increment = 500;
						numBullets = 10;
						break;
				}

				attack2AngleScaled1 += increment;
				if (attack2AngleScaled1 >= 360 * 128)
					attack2AngleScaled1 -= 360 * 128;

				let delta = Math.floor(360 * 128 / numBullets);

				for (let i = 0; i < numBullets; i++) {
					enemies.push(Enemy_Bullet_Strawberry.getEnemy({
						xMibi: xMibi,
						yMibi: yMibi,
						angleScaled: attack2AngleScaled1 + delta * i,
						enemyId: nextEnemyId++
					}));
				}

				attack2AngleScaled2 -= increment;
				if (attack2AngleScaled2 < 0)
					attack2AngleScaled2 += 360 * 128;

				for (let i = 0; i < numBullets; i++) {
					enemies.push(Enemy_Bullet_Strawberry.getEnemy({
						xMibi: xMibi,
						yMibi: yMibi,
						angleScaled: attack2AngleScaled2 + delta * i,
						enemyId: nextEnemyId++
					}));
				}
			}

			if (hp <= 0 && transitionToPhase2Counter === null) 
				transitionToPhase2Counter = 0;
			
			if (transitionToPhase2Counter !== null)
				transitionToPhase2Counter++;

			if (transitionToPhase2Counter !== null && transitionToPhase2Counter >= 2 + GameStateProcessing.SCREEN_WIPE_MAX_COUNTDOWN + 180) {
				let phase2Boss = Enemy_Level1Boss_Phase2.getEnemy({
					xMibi: xMibi,
					yMibi: yMibi,
					xSpeed: xSpeed,
					ySpeed: ySpeed,
					frameCounter: frameCounter,
					enemyId: nextEnemyId++
				});
				return {
					enemies: [phase2Boss],
					nextEnemyId: nextEnemyId,
					newRngSeed: rng.getSeed()
				};
			}

			let returnVal: EnemyProcessFrameResult = {
				enemies: enemies,
				nextEnemyId: nextEnemyId,
				newRngSeed: rng.getSeed(),
				musicToPlay: Enemy_Level1Boss_Phase1.BOSS_MUSIC,
				bossHealthDisplayValue: Math.ceil(hp * 100 / INITIAL_HP)
			};

			if (transitionToPhase2Counter !== null && transitionToPhase2Counter === 2)
				returnVal.shouldScreenWipe = true;

			if (transitionToPhase2Counter !== null && transitionToPhase2Counter === 2 + GameStateProcessing.SCREEN_WIPE_MAX_COUNTDOWN + 60)
				returnVal.shouldCreateAutoSavestate = true;

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
			return getEnemy(xMibi, yMibi, xSpeed, ySpeed, frameCounter, attackCooldown1, attackCooldown2, attack2AngleScaled1, attack2AngleScaled2, transitionToPhase2Counter, hp, enemyId);
		};

		let onCollideWithPlayerBullet = function (): boolean {
			hp--;
			return true;
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
			onCollideWithPlayerBullet: onCollideWithPlayerBullet,
			onScreenWipe: function (countdown: number) { },
			render: render
		};
	};

	Enemy_Level1Boss_Phase1.getEnemy = function ({ xMibi, yMibi, frameCounter, enemyId }: { xMibi: number, yMibi: number, frameCounter: number, enemyId: number }): IEnemy {

		return getEnemy(xMibi, yMibi, 0, 0, frameCounter, 0, 0, 0, 0, null, INITIAL_HP, enemyId);
	};
})());
