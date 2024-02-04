
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
	Ocean,
	Noone,
	NooneIce,
	ExplodeF,
	Strawberry,
	Freezewave,
	Poof,
	OwlBrown,
	CyraDoll,
	DashieDoll,
	Iceball,
	Skull,
	BossHealth,
	ExplodeI,
	BouncySnow
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
			GameImage.Ocean,
			GameImage.Noone,
			GameImage.NooneIce,
			GameImage.ExplodeF,
			GameImage.Strawberry,
			GameImage.Freezewave,
			GameImage.Poof,
			GameImage.OwlBrown,
			GameImage.CyraDoll,
			GameImage.DashieDoll,
			GameImage.Iceball,
			GameImage.Skull,
			GameImage.BossHealth,
			GameImage.ExplodeI,
			GameImage.BouncySnow
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
			case GameImage.Ocean: return "KnoblePersona/ocean.png";
			case GameImage.Noone: return "KelvinShadewing/noone.png";
			case GameImage.NooneIce: return "KelvinShadewing/noone_ice.png";
			case GameImage.ExplodeF: return "KelvinShadewing/explodeF.png";
			case GameImage.Strawberry: return "KelvinShadewing/strawberry.png";
			case GameImage.Freezewave: return "KelvinShadewing/freezewave.png";
			case GameImage.Poof: return "KelvinShadewing/poof.png";
			case GameImage.OwlBrown: return "KelvinShadewing/owl-brown.png";
			case GameImage.CyraDoll: return "KelvinShadewing/cyradoll.png";
			case GameImage.DashieDoll: return "KelvinShadewing/dashie-doll.png";
			case GameImage.Iceball: return "KelvinShadewing/iceball.png";
			case GameImage.Skull: return "KelvinShadewing/skull.png";
			case GameImage.BossHealth: return "KelvinShadewing/boss-health.png";
			case GameImage.ExplodeI: return "KelvinShadewing/explodeI.png";
			case GameImage.BouncySnow: return "KelvinShadewing/bouncysnow.png";
		}
	}
};
