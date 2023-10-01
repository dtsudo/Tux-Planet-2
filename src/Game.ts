
// REVIEW ME


if (!(window as any).getNumImagesRendered)
	(window as any).getNumImagesRendered = function () { return 0; };

let Game = ((function () {
	"use strict";
	
	let beginGame = function () {
		
		var isEmbeddedVersion = false;
		
		var isElectronVersion = !isEmbeddedVersion
			&& (window.navigator.userAgent.indexOf('Electron') >= 0 || window.navigator.userAgent.indexOf('electron') >= 0);
		
		var documentAsAny: any = document;
		
		var urlParams = (new URL(documentAsAny.location)).searchParams;
		
		var showFps = urlParams.get('showfps') !== null
			? (urlParams.get('showfps') === 'true')
			: false;
		var debugMode = urlParams.get('debugmode') !== null
			? (urlParams.get('debugmode') === 'true')
			: false;

		// TODO: remove this line
		//debugMode = true;

		let buildType: BuildType;
		
		if (isEmbeddedVersion)
			buildType = BuildType.WebStandalone;
		else if (isElectronVersion)
			buildType = BuildType.Electron;
		else
			buildType = BuildType.WebStandalone;
							
		GameInitializer.initializeGame(buildType, debugMode);
		
		var computeAndRenderNextFrame: () => void;
		
		var fps = 60;
		
		var nextTimeToAct = Date.now() + (1000.0 / fps);
							
		computeAndRenderNextFrame = function () {
			var now = Date.now();
			
			if (nextTimeToAct > now) {
				requestAnimationFrame(computeAndRenderNextFrame);
				return;
			}
			
			if (nextTimeToAct < now - 5.0*(1000.0 / fps))
				nextTimeToAct = now - 5.0*(1000.0 / fps);
			
			nextTimeToAct = nextTimeToAct + (1000.0 / fps);
			
			GameInitializer.computeAndRenderNextFrame();
			/**/ //window.FpsDisplayJavascript.frameComputedAndRendered();
			
			if (showFps) {
				/**/ //window.FpsDisplayJavascript.displayFps();
			}
			
			requestAnimationFrame(computeAndRenderNextFrame);
		};
		
		requestAnimationFrame(computeAndRenderNextFrame);
	};

	return {
		beginGame
	};
})());