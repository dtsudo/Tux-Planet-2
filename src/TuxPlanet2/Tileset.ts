
const enum Tileset {
	Snow,
	Sign,
	Igloo,
	IceCave,
	Treetops
}

let TilesetUtil = {
	getTilesetFromMapDataTileset: function (mapDataTileset: MapDataTileset): Tileset {
		if (mapDataTileset.name === "Snow")
			return Tileset.Snow;

		if (mapDataTileset.name === "Sign")
			return Tileset.Sign;

		if (mapDataTileset.name === "Igloo")
			return Tileset.Igloo;

		if (mapDataTileset.name === "IceCave")
			return Tileset.IceCave;

		if (mapDataTileset.name === "Treetops")
			return Tileset.Treetops;

		throw new Error("Unrecognized tileset");
	},

	getGameImageForTileset: function (tileset: Tileset): GameImage {
		switch (tileset) {
			case Tileset.Snow: return GameImage.TsSnow;
			case Tileset.Sign: return GameImage.SignPost;
			case Tileset.Igloo: return GameImage.Igloo;
			case Tileset.IceCave: return GameImage.IceCaveTiles;
			case Tileset.Treetops: return GameImage.Treetops;
		}
	}
};
