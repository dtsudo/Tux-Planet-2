
type CutsceneProcessFrameInput = {
	gameState: GameState,
	enemyMapping: { [index: number]: IEnemy },
	frameInput: FrameInput,
	musicOutput: IMusicOutput
}

type ICutscene = {
	getSnapshot: (thisObj: ICutscene) => ICutscene,
	processFrame: (input: CutsceneProcessFrameInput) => { updatedFrameInput: FrameInput, shouldCreateAutoSavestate: boolean },
	render: (displayOutput: IDisplayOutput) => void
}
