
// REVIEW ME

if (!(window as any).getNumImagesRendered)
	(window as any).getNumImagesRendered = function () { return 0; };

let GameInitializer = ((function () {
	"use strict";
	
	let canvas: any = null;
	let context: any = null;
	let canvasWidth: number;
	let canvasHeight: number;
	
	let setCanvas = function () {
		if (canvas === null) {
			canvas = document.getElementById("gameCanvas");
			if (canvas === null)
				return;	
			context = canvas.getContext("2d", { alpha: false });
			canvasWidth = canvas.width;
			canvasHeight = canvas.height;
		}
	};
	
	let clearCanvas = function () {
		if (canvas === null) {
			setCanvas();
			if (canvas === null)
				return;	
		}
		
		context.clearRect(0, 0, canvas.width, canvas.height);
	};
	
	let addResizingCanvasLogic = function () {
		setInterval(function () {
			if (!window)
				return;
		
			if (!document)
				return;
			
			if (canvas === null) {
				setCanvas();
				if (canvas === null)
					return;	
			}
		
			let innerWidth = window.innerWidth;
			let innerHeight = window.innerHeight;
				
			let canvasScalingX = innerWidth / canvasWidth;
			let canvasScalingY = innerHeight / canvasHeight;
			
			let canvasScaling = Math.min(canvasScalingX, canvasScalingY);
			
			let newCanvasCssWidth = Math.floor(canvasWidth * canvasScaling);
			let newCanvasCssHeight = Math.floor(canvasHeight * canvasScaling);
			
			canvas.style.width = newCanvasCssWidth + "px";
			canvas.style.height = newCanvasCssHeight + "px";
			
			let canvasMarginTop;
			
			if (innerHeight > newCanvasCssHeight) {
				canvasMarginTop = Math.floor((innerHeight - newCanvasCssHeight) / 2);
			} else {
				canvasMarginTop = 0;
			}
			
			canvas.style.marginTop = canvasMarginTop + "px";
		}, 250);
	};
	
	let removeMarginOnBody: () => void;
	removeMarginOnBody = function () {
		var bodyElement = document.body;
		
		if (!bodyElement) {
			setTimeout(removeMarginOnBody, 50);
			return;
		}
		
		bodyElement.style.margin = "0px";
	};
	
	let gameFrame : IFrame;
	let gameKeyboard : IKeyboard;
	let gameMouse: IMouse;
	let display: IDisplay;
	let soundOutput: ISoundOutput & ISoundProcessing;
	let musicOutput: IMusicOutput & IMusicProcessing;
	
	let previousGameKeyboard: IKeyboard;
	let previousGameMouse : IMouse;
	
	let initializeGame = function (buildType: BuildType, debugMode: boolean) {
		if (buildType === BuildType.WebEmbedded || buildType === BuildType.Electron)
			removeMarginOnBody();
	
		if (buildType === BuildType.Electron)
			addResizingCanvasLogic();
		
		let globalState = {
			buildType: buildType,
			debugMode: debugMode,
			saveAndLoadData: SaveAndLoadDataUtil.getSaveAndLoadData()
		};
		
		gameFrame = GameEntryFrame.getFirstFrame(globalState);
		gameKeyboard = GameKeyboard.getKeyboard(buildType === BuildType.WebEmbedded || buildType === BuildType.Electron);
		gameMouse = GameMouse.getMouse();
		
		display = CanvasDisplay.getDisplay(GlobalConstants.WINDOW_HEIGHT);
		soundOutput = GameSoundOutput.getSoundOutput();
		musicOutput = GameMusicOutput.getMusicOutput();

		previousGameKeyboard = EmptyKeyboard.getEmptyKeyboard();
		previousGameMouse = EmptyMouse.getEmptyMouse();
		
		clearCanvas();
		gameFrame.render(display);
	};

	let clickUrl: string | null = null;

	document.addEventListener('click', function (e) {
		if (clickUrl !== null && clickUrl !== "")
			window.open(clickUrl, '_blank');
	}, false);

	let windowAsAny: any = window;

	if (!windowAsAny.completedAchievements)
		windowAsAny.completedAchievements = [];

	let addAchievement = function (achievement: string) {
		let array = windowAsAny.completedAchievements;
		for (let i = 0; i < array.length; i++) {
			if (array[i] === achievement)
				return;
		}

		array.push(achievement);
	};

	let numSamples = 0;
	let totalElapsed = 0;
	let totalRendered = 0;

	let computeAndRenderNextFrame = function () {
		let currentKeyboard = CopiedKeyboard.getSnapshot(gameKeyboard);
		let currentMouse = CopiedMouse.getSnapshot(gameMouse);

		let startRendered = (window as any).getNumImagesRendered();
		let start = Date.now();

		let getNextFrameFunc = gameFrame.getNextFrame;
		gameFrame = getNextFrameFunc(currentKeyboard, currentMouse, previousGameKeyboard, previousGameMouse, display, soundOutput, musicOutput, gameFrame);
		soundOutput.processFrame();
		musicOutput.processFrame();
		clearCanvas();
		gameFrame.render(display);

		let end = Date.now();
		let endRendered = (window as any).getNumImagesRendered();

		let elapsedMillis = end - start;
		numSamples++;
		totalElapsed += elapsedMillis;

		let elapsedRendered = endRendered - startRendered;
		totalRendered += elapsedRendered;

		if (numSamples === 60) {
			let avgTime = totalElapsed / 60;
			let avgRendered = totalRendered / 60;
			console.log("AVG TIME PER FRAME: " + avgTime + " ms (rendered " + avgRendered + " images)");
			numSamples = 0;
			totalElapsed = 0;
			totalRendered = 0;
		}

		let achievements = gameFrame.getCompletedAchievements();

		if (achievements !== null) {
			for (let i = 0; i < achievements.length; i++) {
				addAchievement(achievements[i]);
			}
		}
		
		clickUrl = gameFrame.getClickUrl();
		
		previousGameKeyboard = currentKeyboard;
		previousGameMouse = currentMouse;
	};
	
	return {
		clearCanvas,
		initializeGame,
		computeAndRenderNextFrame
	};
})());

