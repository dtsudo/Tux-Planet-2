
const enum GameImage {
	SoundOn_Black,
	SoundOff_Black,
	MusicOn_Black,
	MusicOff_Black,
	SoundOn_White,
	SoundOff_White,
	MusicOn_White,
	MusicOff_White,
	KonqiAir,
	TinyFlame,
	FlyAmanita,
	Smartcap,
	Smartcap_Mirrored,
	Snowfly,
	Snowfly_Mirrored,
	OgJumpy,
	OgJumpy_Mirrored,
	Ocean,
	Noone,
	NooneIce,
	ExplodeF,
	Strawberry,
	Freezewave,
	Poof,
	OverworldTileset_Snow,
	OverworldTileset_PathDirt,
	LevelIcons,
	KonqiO,
	OwlBrown,
	DarkKonqi_Mirrored,
	Flame,
	FlameBlue,
	FlameGreen,
	CyraDoll,
	DashieDoll,
	Iceball,
	Skull,
	BossHealth,
	ExplodeI,
	BouncySnow,
	BouncySnow_Mirrored,
	TsSnow,
	SignPost,
	Igloo,
	IceCaveTiles,
	Treetops,
	Level1Screenshot,
	Level2Screenshot
}

let GameImageUtil = {
	getImageNames: function (): GameImage[] {
		return [
			GameImage.SoundOn_Black,
			GameImage.SoundOff_Black,
			GameImage.MusicOn_Black,
			GameImage.MusicOff_Black,
			GameImage.SoundOn_White,
			GameImage.SoundOff_White,
			GameImage.MusicOn_White,
			GameImage.MusicOff_White,
			GameImage.KonqiAir,
			GameImage.TinyFlame,
			GameImage.FlyAmanita,
			GameImage.Smartcap,
			GameImage.Smartcap_Mirrored,
			GameImage.Snowfly,
			GameImage.Snowfly_Mirrored,
			GameImage.OgJumpy,
			GameImage.OgJumpy_Mirrored,
			GameImage.Ocean,
			GameImage.Noone,
			GameImage.NooneIce,
			GameImage.ExplodeF,
			GameImage.Strawberry,
			GameImage.Freezewave,
			GameImage.Poof,
			GameImage.OverworldTileset_Snow,
			GameImage.OverworldTileset_PathDirt,
			GameImage.LevelIcons,
			GameImage.KonqiO,
			GameImage.OwlBrown,
			GameImage.DarkKonqi_Mirrored,
			GameImage.Flame,
			GameImage.FlameBlue,
			GameImage.FlameGreen,
			GameImage.CyraDoll,
			GameImage.DashieDoll,
			GameImage.Iceball,
			GameImage.Skull,
			GameImage.BossHealth,
			GameImage.ExplodeI,
			GameImage.BouncySnow,
			GameImage.BouncySnow_Mirrored,
			GameImage.TsSnow,
			GameImage.SignPost,
			GameImage.Igloo,
			GameImage.IceCaveTiles,
			GameImage.Treetops,
			GameImage.Level1Screenshot,
			GameImage.Level2Screenshot
		];
	},
	
	getFilename: function (image: GameImage): string {
		switch (image) {
			case GameImage.SoundOn_Black: return "Kenney/SoundOn_Black.png";
			case GameImage.SoundOff_Black: return "Kenney/SoundOff_Black.png";
			case GameImage.MusicOn_Black: return "Kenney/MusicOn_Black.png";
			case GameImage.MusicOff_Black: return "Kenney/MusicOff_Black.png";
			case GameImage.SoundOn_White: return "Kenney/SoundOn_White.png";
			case GameImage.SoundOff_White: return "Kenney/SoundOff_White.png";
			case GameImage.MusicOn_White: return "Kenney/MusicOn_White.png";
			case GameImage.MusicOff_White: return "Kenney/MusicOff_White.png";
			case GameImage.KonqiAir: return "KelvinShadewing/konqiair.png";
			case GameImage.TinyFlame: return "KelvinShadewing/tinyflame.png";
			case GameImage.FlyAmanita: return "KelvinShadewing/flyamanita.png";
			case GameImage.Smartcap: return "KelvinShadewing/smartcap.png";
			case GameImage.Smartcap_Mirrored: return "KelvinShadewing/smartcap_mirrored.png";
			case GameImage.Snowfly: return "KelvinShadewing/snowfly.png";
			case GameImage.Snowfly_Mirrored: return "KelvinShadewing/snowfly_mirrored.png";
			case GameImage.OgJumpy: return "CrystalizedSun/og-jumpy.png";
			case GameImage.OgJumpy_Mirrored: return "CrystalizedSun/og-jumpy_mirrored.png";
			case GameImage.Ocean: return "KnoblePersona/ocean.png";
			case GameImage.Noone: return "KelvinShadewing/noone.png";
			case GameImage.NooneIce: return "KelvinShadewing/noone_ice.png";
			case GameImage.ExplodeF: return "KelvinShadewing/explodeF.png";
			case GameImage.Strawberry: return "KelvinShadewing/strawberry.png";
			case GameImage.Freezewave: return "KelvinShadewing/freezewave.png";
			case GameImage.Poof: return "KelvinShadewing/poof.png";
			case GameImage.OverworldTileset_Snow: return "BenCreating/Snow/Snow.png";
			case GameImage.OverworldTileset_PathDirt: return "BenCreating/PathDirt.png";
			case GameImage.LevelIcons: return "KelvinShadewing/level-icons.png";
			case GameImage.KonqiO: return "KelvinShadewing/konqiO.png";
			case GameImage.OwlBrown: return "KelvinShadewing/owl-brown.png";
			case GameImage.DarkKonqi_Mirrored: return "KelvinShadewing/konqi_dark_mirrored.png";
			case GameImage.Flame: return "KelvinShadewing/flame.png";
			case GameImage.FlameBlue: return "KelvinShadewing/flameBlue.png";
			case GameImage.FlameGreen: return "KelvinShadewing/flameGreen.png";
			case GameImage.CyraDoll: return "KelvinShadewing/cyradoll.png";
			case GameImage.DashieDoll: return "KelvinShadewing/dashie-doll.png";
			case GameImage.Iceball: return "KelvinShadewing/iceball.png";
			case GameImage.Skull: return "KelvinShadewing/skull.png";
			case GameImage.BossHealth: return "KelvinShadewing/boss-health.png";
			case GameImage.ExplodeI: return "KelvinShadewing/explodeI.png";
			case GameImage.BouncySnow: return "KelvinShadewing/bouncysnow.png";
			case GameImage.BouncySnow_Mirrored: return "KelvinShadewing/bouncysnow_mirrored.png";
			case GameImage.TsSnow: return "KelvinShadewing/tssnow.png";
			case GameImage.SignPost: return "Nemisys/signpost.png";
			case GameImage.Igloo: return "KelvinShadewing/igloo.png";
			case GameImage.IceCaveTiles: return "KelvinShadewing/icecavetiles.png";
			case GameImage.Treetops: return "Treetops/treetops.png";
			case GameImage.Level1Screenshot: return "Screenshots/Level1Screenshot.png";
			case GameImage.Level2Screenshot: return "Screenshots/Level2Screenshot.png";
		}
	}
};
