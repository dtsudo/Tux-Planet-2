
// REVIEW ME

let Enemy_Level1Boss_Phase1: { getEnemy: (xMibi: number, yMibi: number, frameCounter: number, enemyId: number) => IEnemy } = {} as any;

((function () {

	let getEnemy = function (
			xMibi: number,
			yMibi: number,
			xSpeed: number,
			ySpeed: number,
			frameCounter: number,
			attackCooldown1: number,
			attackCooldown2: number,
			attack2AngleScaled: number,
			attack2AngleScaled2: number,
			transitionToPhase2Counter: number | null,
			hp: number,
			enemyId: number): IEnemy {

		let processFrame: processFrameFunction = function (thisObj, enemyMapping, rngSeed, nextEnemyId, difficulty, playerState, soundOutput): EnemyProcessFrameResult {

			let rng = DTDeterministicRandomUtil.getRandom(rngSeed);

			xMibi += xSpeed;
			yMibi += ySpeed;

			if (playerState.yMibi - yMibi >= 1024 * 20) {
				if (ySpeed < 1000)
					ySpeed += 30;
			}

			if (playerState.yMibi - yMibi <= -1024 * 20) {
				if (ySpeed > -1000)
					ySpeed -= 30;
			}

			let enemies = [thisObj];

			let ATTACK_COOLDOWN_1: number;

			switch (difficulty) {
				case Difficulty.Easy: ATTACK_COOLDOWN_1 = 90; break;
				case Difficulty.Normal: ATTACK_COOLDOWN_1 = 90; break;
				case Difficulty.Hard: ATTACK_COOLDOWN_1 = 90; break;
			}

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
					if (frameCounter < 600)
						enemies.push(Enemy_Bullet_Noone.getEnemy(
							xMibi,
							yMibi,
							i,
							rng.nextBool(),
							rng.nextInt(360 * 128),
							difficulty,
							nextEnemyId++));
					else
						enemies.push(Enemy_Bullet_Noone2.getEnemy(
							xMibi,
							yMibi,
							i,
							rng.nextBool(),
							rng.nextInt(360 * 128),
							difficulty,
							nextEnemyId++));
				}

			}

			let ATTACK_COOLDOWN_2: number;

			switch (difficulty) {
				case Difficulty.Easy: ATTACK_COOLDOWN_2 = 20; break;
				case Difficulty.Normal: ATTACK_COOLDOWN_2 = 24; break;
				case Difficulty.Hard: ATTACK_COOLDOWN_2 = 10; break;
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

				attack2AngleScaled += increment;
				if (attack2AngleScaled >= 360 * 128)
					attack2AngleScaled -= 360 * 128;

				let delta = Math.floor(360 * 128 / numBullets);

				for (let i = 0; i < numBullets; i++) {
					let strawberry = Enemy_Bullet_Strawberry.getEnemy(
						xMibi,
						yMibi,
						attack2AngleScaled + delta * i,
						difficulty,
						nextEnemyId++);

					enemies.push(strawberry);
				}

				attack2AngleScaled2 -= increment;
				if (attack2AngleScaled2 < 0)
					attack2AngleScaled2 += 360 * 128;

				for (let i = 0; i < numBullets; i++) {
					let strawberry = Enemy_Bullet_Strawberry.getEnemy(
						xMibi,
						yMibi,
						attack2AngleScaled2 + delta * i,
						difficulty,
						nextEnemyId++);

					enemies.push(strawberry);
				}
			}

			if (hp <= 0 && transitionToPhase2Counter === null) {
				transitionToPhase2Counter = 0;
			}

			if (transitionToPhase2Counter !== null)
				transitionToPhase2Counter++;

			if (transitionToPhase2Counter !== null && transitionToPhase2Counter >= 120) {
				let phase2Boss = Enemy_Level1Boss_Phase2.getEnemy(
					xMibi,
					yMibi,
					xSpeed,
					ySpeed,
					frameCounter,
					nextEnemyId++);
				return {
					enemies: [phase2Boss],
					nextEnemyId: nextEnemyId,
					newRngSeed: rng.getSeed()
				};
			}

			frameCounter++;

			let returnVal: EnemyProcessFrameResult = {
				enemies: enemies,
				nextEnemyId: nextEnemyId,
				newRngSeed: rng.getSeed(),
				musicToPlay: GameMusic.ChiptuneLevel3,
				bossHealthDisplayValue: Math.round(hp * 100 / 1000)
			};

			if (transitionToPhase2Counter !== null && transitionToPhase2Counter === 2)
				returnVal.shouldScreenWipe = true;

			if (transitionToPhase2Counter !== null && transitionToPhase2Counter === 60)
				returnVal.shouldCreateAutoSavestate = true;

			return returnVal;
		};

		let getHitboxes = function () {
			return null;
		};

		let getDamageboxes = function () {
			let damagebox: Hitbox = {
				xMibi: xMibi - 48 * 1024,
				yMibi: yMibi - 48 * 1024,
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
				(xMibi >> 10) - 48,
				(yMibi >> 10) - 48,
				0,
				128 * 3);
		};

		let getSnapshot = function (thisObj: IEnemy): IEnemy {
			return getEnemy(xMibi, yMibi, xSpeed, ySpeed, frameCounter, attackCooldown1, attackCooldown2, attack2AngleScaled, attack2AngleScaled2, transitionToPhase2Counter, hp, enemyId);
		};

		let onCollideWithPlayerBullet = function (): boolean {
			hp--;
			return true;
		};

		let onScreenWipe = function (countdown: number) {
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
			onScreenWipe,
			render: render
		};
	};

	Enemy_Level1Boss_Phase1.getEnemy = function (xMibi: number, yMibi: number, frameCounter: number, enemyId: number): IEnemy {
		let initialHp = 1000;

		// TODO: remove
		//initialHp = 50;

		return getEnemy(xMibi, yMibi, 0, 0, frameCounter % 40, 0, 0, 0, 0, null, initialHp, enemyId);
	};
})());
