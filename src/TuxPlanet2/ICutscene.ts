
// REVIEW ME

type ICutscene = {
	getSnapshot: (thisObj: ICutscene) => ICutscene,
	processFrame: (gameState: GameState, enemyMapping: { [index: number]: IEnemy }, frameInput: FrameInput, musicOutput: IMusicOutput) => { updatedFrameInput: FrameInput, shouldCreateAutoSavestate: boolean },
	render: (displayOutput: IDisplayOutput) => void
}
