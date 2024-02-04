
let GameFrame: {
	END_LEVEL_NUM_FRAMES_TO_WAIT: number,
	getAlphaForEndLevelFadeOut: (endLevelCounter: number) => number,
	getFrame: (globalState: GlobalState, sessionState: SessionState, gameState: GameState) => IFrame
} = {} as any;

GameFrame.END_LEVEL_NUM_FRAMES_TO_WAIT = 60;

GameFrame.getAlphaForEndLevelFadeOut = function (endLevelCounter: number): number {
	let alpha = endLevelCounter * 3;
	if (alpha > 200)
		alpha = 200;
	return alpha;
};

GameFrame.getFrame = function (globalState: GlobalState, sessionState: SessionState, gameState: GameState): IFrame {

	let savedGameState: { gameStateSnapshot: GameState, frameInputHistory: FrameInputHistory | null } | null = null;
	let autoSavedGameState: { gameStateSnapshot: GameState, frameInputHistory: FrameInputHistory | null } = { gameStateSnapshot: GameStateUtil.getSnapshot(gameState), frameInputHistory: null };
	let skipFrameCount = 0;
	let frameInputHistory: FrameInputHistory | null = null;
	let renderKonqiHitbox = false;

	let previousFrameInput: FrameInput = FrameInputUtil.getEmptyFrameInput();
	let suggestedFrameInput: FrameInput = FrameInputUtil.getEmptyFrameInput();

	let endLevelCounter: number | null = null;

	let getNextFrame: getNextFrame = function ({ keyboardInput, mouseInput, previousKeyboardInput, previousMouseInput, displayProcessing, soundOutput, musicOutput, thisFrame }) {

		if (keyboardInput.isPressed(Key.Esc) && !previousKeyboardInput.isPressed(Key.Esc))
			return PauseMenuFrame.getFrame(globalState, sessionState, thisFrame, gameState.difficulty);
	
		if (endLevelCounter !== null)
			endLevelCounter++;

		let frame = getNextFrameHelper({ keyboardInput, mouseInput, previousKeyboardInput, previousMouseInput, displayProcessing, soundOutput, musicOutput, thisFrame });

		if (globalState.debugMode) {
			if (keyboardInput.isPressed(Key.Zero) && !previousKeyboardInput.isPressed(Key.Zero) && endLevelCounter === null)
				endLevelCounter = 0;
		}

		if (endLevelCounter === GameFrame.END_LEVEL_NUM_FRAMES_TO_WAIT)
			return LevelCompleteFrame.getFrame(globalState, sessionState, thisFrame, gameState.difficulty, frameInputHistory!);

		if (globalState.debugMode && keyboardInput.isPressed(Key.One)) {
			let emptyKeyboard = EmptyKeyboard.getEmptyKeyboard();
			let emptyMouse = EmptyMouse.getEmptyMouse();
			for (let i = 0; i < 4; i++) 
				frame = getNextFrameHelper({ keyboardInput: emptyKeyboard, mouseInput: emptyMouse, previousKeyboardInput: emptyKeyboard, previousMouseInput: emptyMouse, displayProcessing, soundOutput, musicOutput, thisFrame });
		}

		return frame;
	};

	let getNextFrameHelper: getNextFrame = function ({ keyboardInput, mouseInput, previousKeyboardInput, previousMouseInput, displayProcessing, soundOutput, musicOutput, thisFrame }) {

		let shouldExecuteFrame = true;

		renderKonqiHitbox = keyboardInput.isPressed(Key.Shift);

		if (keyboardInput.isPressed(Key.Shift)) {
			skipFrameCount++;
			if (skipFrameCount === 5) {
				skipFrameCount = 0;
				shouldExecuteFrame = true;
			} else {
				shouldExecuteFrame = false;
			}
		}

		if (shouldExecuteFrame) {
			let frameInput = FrameInputUtil.getFrameInput(keyboardInput, previousKeyboardInput);

			if (suggestedFrameInput.up && !frameInput.down && !previousFrameInput.up)
				frameInput.up = true;
			if (suggestedFrameInput.down && !frameInput.up && !previousFrameInput.down)
				frameInput.down = true;
			if (suggestedFrameInput.left && !frameInput.right && !previousFrameInput.left)
				frameInput.left = true;
			if (suggestedFrameInput.right && !frameInput.left && !previousFrameInput.right)
				frameInput.right = true;
			if (suggestedFrameInput.shoot && !previousFrameInput.shoot)
				frameInput.shoot = true;
			if (suggestedFrameInput.continueDialogue)
				frameInput.continueDialogue = true;
			suggestedFrameInput = FrameInputUtil.getEmptyFrameInput();

			previousFrameInput = frameInput;

			frameInputHistory = { frameInput: frameInput, index: gameState.frameCount, previousFrameInputs: frameInputHistory };

			let result = GameStateProcessing.processFrame(gameState, frameInput, soundOutput, musicOutput);

			if (result.shouldCreateAutoSavestate && gameState.playerState.isDeadFrameCount === null) {
				autoSavedGameState = {
					gameStateSnapshot: GameStateUtil.getSnapshot(gameState),
					frameInputHistory: frameInputHistory
				};
			}

			if (result.shouldEndLevel && gameState.playerState.isDeadFrameCount === null && endLevelCounter === null)
				endLevelCounter = 0;

			if (gameState.playerState.isDeadFrameCount !== null && gameState.playerState.isDeadFrameCount >= 120) {
				gameState = GameStateUtil.getSnapshot(autoSavedGameState.gameStateSnapshot);
				frameInputHistory = autoSavedGameState.frameInputHistory;
			}
		} else {
			let currentFrameInput = FrameInputUtil.getFrameInput(keyboardInput, previousKeyboardInput);
			suggestedFrameInput = {
				up: suggestedFrameInput.up || currentFrameInput.up,
				down: suggestedFrameInput.down || currentFrameInput.down,
				left: suggestedFrameInput.left || currentFrameInput.left,
				right: suggestedFrameInput.right || currentFrameInput.right,
				shoot: suggestedFrameInput.shoot || currentFrameInput.shoot,
				continueDialogue: suggestedFrameInput.continueDialogue || currentFrameInput.continueDialogue
			};
		}

		if (keyboardInput.isPressed(Key.C) && !previousKeyboardInput.isPressed(Key.C) && gameState.playerState.isDeadFrameCount === null)
			savedGameState = { gameStateSnapshot: GameStateUtil.getSnapshot(gameState), frameInputHistory: frameInputHistory };

		if (keyboardInput.isPressed(Key.X) && !previousKeyboardInput.isPressed(Key.X) && endLevelCounter === null) {
			if (savedGameState !== null) {
				gameState = GameStateUtil.getSnapshot(savedGameState.gameStateSnapshot);
				frameInputHistory = savedGameState.frameInputHistory;
			}
		}

		return thisFrame;
	};

	let render = function (displayOutput: IDisplayOutput) {
		GameStateRendering.render(gameState, displayOutput, renderKonqiHitbox);

		if (endLevelCounter !== null) {
			let alpha = GameFrame.getAlphaForEndLevelFadeOut(endLevelCounter);
			displayOutput.drawRectangle(0, 0, GlobalConstants.WINDOW_WIDTH, GlobalConstants.WINDOW_HEIGHT, { r: 0, g: 0, b: 0, alpha: alpha }, true);
		}
	};

	return {
		getNextFrame,
		render,
		getClickUrl: function () { return null; },
		getCompletedAchievements: function () { return null; }
	};
};
