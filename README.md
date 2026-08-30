# BIN Patcher

A tool for generating PPF files for modifying SOTN, given specially-formatted JSON files describing the desired changes. While this repository can theoretically be used to patch BIN files for other games, it is designed with Castlevania: Symphony of the Night in mind, and that is the only game it has been tested on so far.

## Installation

This repository requires `Node`, `npm`, and `Python`.

From the root of the repository, run the following command to download the required Python libraries:

```
pip install -r requirements.txt
```

Then, to generate the necessary build files, run the following command, supplying the path to your local BIN file as the argument.

```
npm run sotn:build <PATH TO YOUR BIN FILE>
```

Then, to generate an example PPF, run the following command.

```
npm run sotn:example
```

The PPF file generated is designed to be used in conjunction with a PPF patching tool like the one available at [ppf.sotn.io](https://ppf.sotn.io/).

## Acknowledgements

Most of the knowledge present in this project is only possible due to the immense efforts of the SOTN speedrunning and romhacking community:

- Forat Negre, for their research into room layouts, which helped demystify a lot of how stages and rooms worked in this game
- [TalicZealot](https://github.com/taliczealot), for furthering knowledge about the game and making available tons of SOTN-related resources
- [MainMemory](https://github.com/MainMemory), for their [CastleEditor](https://github.com/MainMemory/SotNCastleEditor) project, which provided key insight into a few addresses as well as extremely helpful visualizations of the castle stages
- [Mottzilla](https://github.com/MottZilla), for their _StartAnywhere_ and _TileMapFind_ scripts, which dramatically improved turnaround time during playtesting
- [meunierd](https://github.com/meunierd), for the PPF file format
- [Fatalis](https://github.com/fatalis), for their Drop Calculator
- Contributors and maintainers of the [SOTN-Decomp](https://github.com/Xeeynamo/sotn-decomp) project, including:
  - [Xeeynamo](https://github.com/Xeeynamo)
  - [Bismurphy](https://github.com/bismurphy)
  - [Sozud](https://github.com/sozud)
  - [Sonic Dreamcaster](https://github.com/sonicdcer)
- Contributors and maintainers of the [SOTN-Randomizer](https://github.com/3snowp7im/SotN-Randomizer) project, including:
  - [3snowp7im](https://github.com/3snowp7im) (Wild Mouse)
  - [Mottzilla](https://github.com/MottZilla)
  - [eldri7ch](https://github.com/eldri7ch2)
  - [LuciaRolon](https://github.com/LuciaRolon)
  - [DotChris](https://github.com/DotChris)
- ToiletPain, Dark Falz Joker, 一隻綿羊, Jasper, and everyone else in the Long Library Discord for their extensive help during beta testing
- Dr4gonBlitz, for being a huge inspiration for SOTN speedrunning, and for their continued help and patience during the alpha testing phase of this project
- The entire SOTN community, for their generosity and kindness