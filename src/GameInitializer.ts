
let GameInitializer = ((function () {
	"use strict";
			
	let canvasContext: CanvasRenderingContext2D | null = null;
	let clearCanvas = function (canvasNode: HTMLCanvasElement) {
		if (canvasContext === null)
			canvasContext = canvasNode.getContext("2d", { alpha: false })!;
		
		canvasContext.clearRect(0, 0, canvasNode.width, canvasNode.height);
	};
	
	let addResizingCanvasLogic = function (canvasNode: HTMLCanvasElement) {
		setInterval(function () {
			let innerWidth = window.innerWidth;
			let innerHeight = window.innerHeight;
			
			let canvasWidth = canvasNode.width;
			let canvasHeight = canvasNode.height;
				
			let canvasScalingX = innerWidth / canvasWidth;
			let canvasScalingY = innerHeight / canvasHeight;
			
			let canvasScaling = Math.min(canvasScalingX, canvasScalingY);
			
			let newCanvasCssWidth = Math.floor(canvasWidth * canvasScaling);
			let newCanvasCssHeight = Math.floor(canvasHeight * canvasScaling);
			
			canvasNode.style.width = newCanvasCssWidth + "px";
			canvasNode.style.height = newCanvasCssHeight + "px";
			
			let canvasMarginTop;
			
			if (innerHeight > newCanvasCssHeight) {
				canvasMarginTop = Math.floor((innerHeight - newCanvasCssHeight) / 2);
			} else {
				canvasMarginTop = 0;
			}
			
			canvasNode.style.marginTop = canvasMarginTop + "px";
		}, 250);
	};
	
	let removeMarginOnBody: () => void;
	removeMarginOnBody = function () {
		let bodyElement = document.body;
		
		if (!bodyElement) {
			setTimeout(removeMarginOnBody, 50);
			return;
		}
		
		bodyElement.style.margin = "0px";
	};
	
	let gameFrame: IFrame;
	let gameKeyboard: IKeyboard;
	let gameMouse: IMouse;
	let display: IDisplay;
	let soundOutput: ISoundOutput & ISoundProcessing;
	let musicOutput: IMusicOutput & IMusicProcessing;
	
	let previousGameKeyboard: IKeyboard;
	let previousGameMouse: IMouse;
	
	let initializeGame = function (canvasNode: HTMLCanvasElement, buildType: BuildType, debugMode: boolean) {
		if (buildType === BuildType.WebEmbedded || buildType === BuildType.Electron)
			removeMarginOnBody();
	
		if (buildType === BuildType.Electron)
			addResizingCanvasLogic(canvasNode);
				
		gameFrame = GameEntryFrame.getFirstFrame(buildType, debugMode);
		gameKeyboard = GameKeyboard.getKeyboard(buildType === BuildType.WebEmbedded || buildType === BuildType.Electron);
		gameMouse = GameMouse.getMouse();
		
		display = CanvasDisplay.getDisplay(GlobalConstants.WINDOW_HEIGHT);
		soundOutput = GameSoundOutput.getSoundOutput();
		musicOutput = GameMusicOutput.getMusicOutput();

		previousGameKeyboard = EmptyKeyboard.getEmptyKeyboard();
		previousGameMouse = EmptyMouse.getEmptyMouse();
		
		clearCanvas(canvasNode);
		gameFrame.render(display);
	};

	let clickUrl: string | null = null;

	document.addEventListener("click", function (e) {
		if (clickUrl !== null && clickUrl !== "")
			window.open(clickUrl, "_blank");
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

	let computeAndRenderNextFrame = function (canvasNode: HTMLCanvasElement) {
		let currentKeyboard = CopiedKeyboard.getSnapshot(gameKeyboard);
		let currentMouse = CopiedMouse.getSnapshot(gameMouse);

		let getNextFrameFunc = gameFrame.getNextFrame;
		gameFrame = getNextFrameFunc({
			keyboardInput: currentKeyboard,
			mouseInput: currentMouse,
			previousKeyboardInput: previousGameKeyboard,
			previousMouseInput: previousGameMouse,
			displayProcessing: display,
			soundOutput: soundOutput,
			musicOutput: musicOutput,
			thisFrame: gameFrame
		});
		soundOutput.processFrame();
		musicOutput.processFrame();
		clearCanvas(canvasNode);
		gameFrame.render(display);

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
		initializeGame,
		computeAndRenderNextFrame
	};
})());
