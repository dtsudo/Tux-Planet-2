
let Cutscene_Level1Boss: { getCutscene: (owlEnemyId: number) => ICutscene } = {} as any;

((function () {
	let dialogue = [
		{
			isKonqi: false,
			text: "Are you a dinosaur?",
			width: 250
		},
		{
			isKonqi: true,
			text: "No. I'm a dragon!",
			width: 200
		},
		{
			isKonqi: false,
			text: "You're a flying dragon?",
			width: 295
		},
		{
			isKonqi: true,
			text: "That's right. I'm Konqi the Dragon!",
			width: 400
		},
		{
			isKonqi: false,
			text: "I see. Then I shall use ice attacks!",
			width: 410
		},
		{
			isKonqi: true,
			text: "I only have one hit point in any case.",
			width: 440
		}
	];

	let getCutscene = function (
		dialogueIndex: number,
		beginBossFightCounter: number | null,
		owlEnemyId: number,
		owlXMibi: number | null,
		owlYMibi: number | null,
		playerXMibi: number | null,
		playerYMibi: number | null): ICutscene {

		let getSnapshot = function (thisObj: ICutscene): ICutscene {
			return getCutscene(dialogueIndex, beginBossFightCounter, owlEnemyId, owlXMibi, owlYMibi, playerXMibi, playerYMibi);
		};

		let processFrame = function ({ gameState, enemyMapping, frameInput, musicOutput }: CutsceneProcessFrameInput): { updatedFrameInput: FrameInput, shouldCreateAutoSavestate: boolean } {

			playerXMibi = gameState.playerState.xMibi;
			playerYMibi = gameState.playerState.yMibi;

			let owlEnemy: IEnemy = enemyMapping[owlEnemyId];
			let owlEnemyAsOwl: Level1BossCutsceneEnemy = owlEnemy as IEnemy & Level1BossCutsceneEnemy;

			owlXMibi = owlEnemyAsOwl.getXMibi();
			owlYMibi = owlEnemyAsOwl.getYMibi();

			if (frameInput.continueDialogue && beginBossFightCounter === null) {
				dialogueIndex++;

				if (dialogueIndex === dialogue.length) {
					if (beginBossFightCounter === null)
						beginBossFightCounter = 0;
				}
			}

			if (beginBossFightCounter !== null) {
				beginBossFightCounter++;
				if (beginBossFightCounter === 1)
					gameState.background.startBoss();
				musicOutput.playMusic(Enemy_Level1Boss_Phase1.BOSS_MUSIC, 100);
			}

			if (beginBossFightCounter !== null && beginBossFightCounter === 50) {
				gameState.cutscene = null;
				owlEnemyAsOwl.transformToLevel1Boss();
			}

			return {
				updatedFrameInput: {
					up: frameInput.up,
					down: frameInput.down,
					left: frameInput.left,
					right: frameInput.right,
					shoot: false,
					continueDialogue: frameInput.continueDialogue
				},
				shouldCreateAutoSavestate: beginBossFightCounter !== null && beginBossFightCounter === 1
			};
		};

		let drawDialogue = function (x: number, y: number, width: number, text: string, displayOutput: IDisplayOutput) {

			let height = 24;

			displayOutput.drawRectangle(
				x,
				y,
				width,
				height,
				{ r: 0, g: 0, b: 0, alpha: 150 },
				true);

			displayOutput.drawText(
				x,
				y + height,
				text,
				GameFont.SimpleFont,
				24,
				white);
		};

		let render = function (displayOutput: IDisplayOutput): void {

			if (beginBossFightCounter === null && owlXMibi !== null && owlYMibi !== null && playerXMibi !== null && playerYMibi !== null) {
				let currentText = dialogue[dialogueIndex];
				let isKonqi = currentText.isKonqi;
				let text = currentText.text;

				let x: number;
				let y: number;
				let width = currentText.width;

				if (isKonqi) {
					x = (playerXMibi >> 10) - Math.floor(width / 2);
					y = (playerYMibi >> 10) + 35;
				} else {
					x = (owlXMibi >> 10) - Math.floor(width / 2);
					y = (owlYMibi >> 10) + 35;
				}

				drawDialogue(
					x,
					y,
					width,
					text,
					displayOutput);
			}
		};

		return {
			getSnapshot,
			processFrame,
			render
		};
	};

	Cutscene_Level1Boss.getCutscene = function (owlEnemyId: number): ICutscene {
		return getCutscene(0, null, owlEnemyId, null, null, null, null);
	};
})());
