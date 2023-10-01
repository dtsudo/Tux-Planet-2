
// REVIEW ME

type FrameInputHistory = {
	frameInput: FrameInput,
	index: number,
	previousFrameInputs: FrameInputHistory | null
}

let GameFrame: { getFrame: (globalState: GlobalState, sessionState: SessionState, gameState: GameState) => IFrame } = {} as any;

GameFrame.getFrame = function (globalState: GlobalState, sessionState: SessionState, gameState: GameState): IFrame {

	let savedGameState: { gameState: GameState, frameInputHistory: FrameInputHistory } | null = null;
	let autoSavedGameState: { gameState: GameState, frameInputHistory: FrameInputHistory } | null = null;
	let skipFrameCount = 0;
	let frameInputHistory: FrameInputHistory | null = null;
	let renderKonqiHitbox: boolean = false;

	let previousFrameInput: FrameInput = FrameInputUtil.getEmptyFrameInput();
	let suggestedFrameInput: FrameInput = FrameInputUtil.getEmptyFrameInput();

	let endLevelCounter: number | null = null;

	let getNextFrameWrapped: getNextFrame = function (keyboardInput, mouseInput, previousKeyboardInput, previousMouseInput, displayProcessing, soundOutput, musicOutput, thisFrame) {

		if (keyboardInput.isPressed(Key.Esc) && !previousKeyboardInput.isPressed(Key.Esc)) {
			return PauseMenuFrame.getFrame(globalState, sessionState, thisFrame, gameState.difficulty);
		}

		if (globalState.debugMode && keyboardInput.isPressed(Key.R) && !previousKeyboardInput.isPressed(Key.R) && frameInputHistory !== null) {
			return ReplayFrame.getFrame(globalState, sessionState, frameInputHistory, gameState.difficulty);
		}

		if (endLevelCounter !== null)
			endLevelCounter++;

		let frame = getNextFrame(keyboardInput, mouseInput, previousKeyboardInput, previousMouseInput, displayProcessing, soundOutput, musicOutput, thisFrame);

		if (endLevelCounter === 60)
			return LevelCompleteFrame.getFrame(globalState, sessionState, thisFrame, gameState.difficulty, frameInputHistory!);

		if (globalState.debugMode && keyboardInput.isPressed(Key.One)) {
			let emptyKeyboard = EmptyKeyboard.getEmptyKeyboard();
			let emptyMouse = EmptyMouse.getEmptyMouse();
			for (let i = 0; i < 4; i++) {
				frame = getNextFrame(emptyKeyboard, emptyMouse, emptyKeyboard, emptyMouse, displayProcessing, soundOutput, musicOutput, thisFrame);
			}
		}

		return frame;
	};

	let getNextFrame: getNextFrame = function (keyboardInput, mouseInput, previousKeyboardInput, previousMouseInput, displayProcessing, soundOutput, musicOutput, thisFrame) {

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
			if (suggestedFrameInput.shoot)
				frameInput.shoot = true;
			if (suggestedFrameInput.continueDialogue)
				frameInput.continueDialogue = true;
			suggestedFrameInput = FrameInputUtil.getEmptyFrameInput();

			previousFrameInput = frameInput;

			frameInputHistory = { frameInput: frameInput, index: gameState.frameCount, previousFrameInputs: frameInputHistory };

			let result = GameStateProcessing.processFrame(gameState, frameInput, soundOutput, musicOutput);

			let shouldCreateAutoSavestate = result.shouldCreateAutoSavestate;

			if (shouldCreateAutoSavestate && gameState.playerState.isDeadFrameCount === null) {
				autoSavedGameState = {
					gameState: GameStateUtil.getSnapshot(gameState),
					frameInputHistory: frameInputHistory
				};
			}

			let shouldEndLevel = result.shouldEndLevel;

			if (shouldEndLevel && endLevelCounter === null) {
				endLevelCounter = 0;
			}

			if (gameState.playerState.isDeadFrameCount !== null && gameState.playerState.isDeadFrameCount >= 120) {
				gameState = GameStateUtil.getSnapshot(autoSavedGameState!.gameState);
				frameInputHistory = autoSavedGameState!.frameInputHistory;
			}
		} else {
			let frameInput = FrameInputUtil.getFrameInput(keyboardInput, previousKeyboardInput);

			if (frameInput.up && !frameInput.down) {
				suggestedFrameInput.up = true;
				suggestedFrameInput.down = false;
			}
			if (!frameInput.up && frameInput.down) {
				suggestedFrameInput.up = false;
				suggestedFrameInput.down = true;
			}
			if (frameInput.left && !frameInput.right) {
				suggestedFrameInput.left = true;
				suggestedFrameInput.right = false;
			}
			if (!frameInput.left && frameInput.right) {
				suggestedFrameInput.left = false;
				suggestedFrameInput.right = true;
			}

			if (frameInput.shoot)
				suggestedFrameInput.shoot = true;

			if (frameInput.continueDialogue)
				suggestedFrameInput.continueDialogue = true;
		}

		if (autoSavedGameState === null && frameInputHistory !== null) {
			autoSavedGameState = { gameState: GameStateUtil.getSnapshot(gameState), frameInputHistory: frameInputHistory };
		}

		if (keyboardInput.isPressed(Key.C) && !previousKeyboardInput.isPressed(Key.C) && gameState.playerState.isDeadFrameCount === null && frameInputHistory !== null) {
			savedGameState = { gameState: GameStateUtil.getSnapshot(gameState), frameInputHistory: frameInputHistory };
		}

		if (keyboardInput.isPressed(Key.X) && !previousKeyboardInput.isPressed(Key.X)) {
			if (savedGameState !== null) {
				gameState = GameStateUtil.getSnapshot(savedGameState.gameState);
				frameInputHistory = savedGameState.frameInputHistory;
			}
		}

		return thisFrame;
	};

	let render = function (displayOutput: IDisplayOutput) {
		GameStateRendering.render(gameState, displayOutput, renderKonqiHitbox);

		if (endLevelCounter !== null) {
			let alpha = endLevelCounter * 3;
			if (alpha > 200)
				alpha = 200;
			displayOutput.drawRectangle(0, 0, GlobalConstants.WINDOW_WIDTH, GlobalConstants.WINDOW_HEIGHT, { r: 0, g: 0, b: 0, alpha: alpha }, true);
		}
	};

	return {
		getNextFrame: getNextFrameWrapped,
		render,
		getClickUrl: function () { return null; },
		getCompletedAchievements: function () { return null; }
	};
};
