
let Game = ((function () {
	"use strict";
	
	let fpsNode: any = null;
	let canvasNode: HTMLCanvasElement | null = null;
	
	let createHtmlElements = function (showFps: boolean) {
		document.body.style.overflow = "hidden";
		
		let fpsWrapperDiv = document.createElement("div");
		let fpsLabel = document.createElement("span");
		if (showFps) {
			let textNode = document.createTextNode("FPS: ");
			fpsLabel.appendChild(textNode);
		}
		fpsWrapperDiv.appendChild(fpsLabel);
		
		fpsNode = document.createElement("span");
		fpsWrapperDiv.appendChild(fpsNode);
		
		document.body.appendChild(fpsWrapperDiv);
		
		let canvasWrapperDiv = document.createElement("div");
		canvasWrapperDiv.style.textAlign = "center";
		
		canvasNode = document.createElement("canvas");
		canvasNode.id = "gameCanvas";
		canvasNode.width = GlobalConstants.WINDOW_WIDTH;
		canvasNode.height = GlobalConstants.WINDOW_HEIGHT;
		canvasWrapperDiv.appendChild(canvasNode);
		
		document.body.appendChild(canvasWrapperDiv);
	};
	
	let fpsFrameCounter = 0;
	let startTimeMillis = Date.now();

	let fpsPerformanceTracking: number[] = [];
	
	let displayFps = function () {
		let currentTimeMillis = Date.now();
		if (currentTimeMillis - startTimeMillis > 2000) {
			let actualFps = fpsFrameCounter / 2;

			if (fpsPerformanceTracking.length > 0) {
				let maxTimeToRenderFrame = fpsPerformanceTracking[0];

				for (let timeElapsed of fpsPerformanceTracking) {
					if (timeElapsed > maxTimeToRenderFrame)
						maxTimeToRenderFrame = timeElapsed;
				}

				fpsNode.textContent = actualFps.toString() + " (time to process/render slowest frame: " + maxTimeToRenderFrame.toString() + " ms)";
			} else {
				fpsNode.textContent = actualFps.toString();
			}
			
			fpsFrameCounter = 0;
			startTimeMillis = currentTimeMillis;
		}
	};
	
	let beginGame: () => void = function () {
		
		let isEmbeddedVersion = false;
		
		let isElectronVersion = !isEmbeddedVersion
			&& (window.navigator.userAgent.indexOf("Electron") >= 0 || window.navigator.userAgent.indexOf("electron") >= 0);
		
		let documentAsAny: any = document;
		
		let urlParams = (new URL(documentAsAny.location)).searchParams;
		
		let showFps = urlParams.get("showfps") !== null
			? (urlParams.get("showfps") === "true")
			: false;
		let debugMode = urlParams.get("debugmode") !== null
			? (urlParams.get("debugmode") === "true")
			: false;

		let buildType: BuildType;
		
		if (isEmbeddedVersion)
			buildType = BuildType.WebEmbedded;
		else if (isElectronVersion)
			buildType = BuildType.Electron;
		else
			buildType = BuildType.WebStandalone;
							
		createHtmlElements(showFps);
		GameInitializer.initializeGame(canvasNode!, buildType, debugMode);
		
		let computeAndRenderNextFrame: () => void;
		
		let fps = 60;
		
		let nextTimeToAct = Date.now() + (1000.0 / fps);
							
		computeAndRenderNextFrame = function () {
			let now = Date.now();
			
			if (nextTimeToAct > now) {
				requestAnimationFrame(computeAndRenderNextFrame);
				return;
			}
			
			if (nextTimeToAct < now - 5.0*(1000.0 / fps))
				nextTimeToAct = now - 5.0*(1000.0 / fps);
			
			nextTimeToAct = nextTimeToAct + (1000.0 / fps);
			
			let startTimer = Date.now();
			GameInitializer.computeAndRenderNextFrame(canvasNode!);
			let endTimer = Date.now();

			let timeElapsedThisFrame = endTimer - startTimer;
			fpsPerformanceTracking.push(timeElapsedThisFrame);
			if (fpsPerformanceTracking.length > 300)
				fpsPerformanceTracking.shift();

			fpsFrameCounter++;
			
			if (showFps)
				displayFps();
			
			requestAnimationFrame(computeAndRenderNextFrame);
		};
		
		requestAnimationFrame(computeAndRenderNextFrame);
	};

	return {
		beginGame
	};
})());
