
let CanvasDisplay_Rectangle = {
	getCanvasDisplayRectangle: function (windowHeight: number) {
		"use strict";

		let context: CanvasRenderingContext2D | null = null;

		let drawRectangle = function (x: number, y: number, width: number, height: number, color: DTColor, fill: boolean) {

			y = windowHeight - y - height;

			let red = color.r;
			let green = color.g;
			let blue = color.b;
			let alpha = color.alpha;

			if (context === null) {
				let canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
				if (canvas !== null)
					context = canvas.getContext("2d", { alpha: false })!;
				else
					return;
			}

			context.fillStyle = "rgba(" + red.toString() + ", " + green.toString() + ", " + blue.toString() + ", " + (alpha / 255).toString() + ")";
			context.strokeStyle = "rgba(" + red.toString() + ", " + green.toString() + ", " + blue.toString() + ", " + (alpha / 255).toString() + ")";

			if (fill)
				context.fillRect(x, y, width, height);
			else
				context.strokeRect(x, y, width, height);
		};

		return {
			drawRectangle
		};
	}
};
