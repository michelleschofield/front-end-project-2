'use strict';
const data = readData();
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function writeData() {
  const dataJSON = JSON.stringify(data);
  localStorage.setItem('pokedata', dataJSON);
}
function readData() {
  const dataJSON = localStorage.getItem('pokedata');
  if (!dataJSON) {
    const defaultData = {
      currentView: 'home',
      viewingStudySet: null,
      editingCard: null,
      sets: [
        {
          setName: 'tester',
          id: 0,
          nextCardId: 4,
          cards: [
            {
              pokemonName: 'bulbasaur',
              pokemonId: 1,
              infoType: 'flavor_text',
              info: {
                index: 0,
                textArray: [
                  'A strange seed was\nplanted on its\nback at birth.\fThe plant sprouts\nand grows with\nthis POKéMON.',
                  'It can go for days\nwithout eating a\nsingle morsel.\fIn the bulb on\nits back, it\nstores energy.',
                  'The seed on its\nback is filled\nwith nutrients.\fThe seed grows\nsteadily larger as\nits body grows.',
                  'It carries a seed\non its back right\nfrom birth. As it\fgrows older, the\nseed also grows\nlarger.',
                  'While it is young,\nit uses the\nnutrients that are\fstored in the\nseeds on its back\nin order to grow.',
                  'BULBASAUR can be seen napping in\nbright sunlight.\nThere is a seed on its back.\fBy soaking up the sun’s rays, the seed\ngrows progressively larger.',
                  'BULBASAUR can be seen napping in bright\nsunlight. There is a seed on its back.\nBy soaking up the sun’s rays, the seed\ngrows progressively larger.',
                  'There is a plant seed on its back right\nfrom the day this POKéMON is born.\nThe seed slowly grows larger.',
                  'A strange seed was planted on its back at\nbirth. The plant sprouts and grows with\nthis POKéMON.',
                  'For some time after its birth, it\ngrows by gaining nourishment from\nthe seed on its back.',
                  'The seed on its back is filled\nwith nutrients. The seed grows\nsteadily larger as its body grows.',
                  'It carries a seed on its back right\nfrom birth. As it grows older, the\nseed also grows larger.',
                  'A strange seed was planted on its back at birth.\nThe plant sprouts and grows with this Pokémon.',
                  'For some time after its birth, it grows by gaining\nnourishment from the seed on its back.',
                  'Bulbasaur can be seen napping in bright sunlight.\nThere is a seed on its back. By soaking up the sun’s rays,\nthe seed grows progressively larger.',
                  'It can go for days without eating a single morsel.\nIn the bulb on its back, it stores energy.',
                  'There is a plant seed on its back right from the\nday this Pokémon is born. The seed slowly\ngrows larger.',
                  'While it is young, it uses the nutrients that are\nstored in the seed on its back in order to grow.',
                ],
              },
              pokemonImg:
                'https://raw.githubusercontent.com/HybridShivam/Pokemon/master/assets/images/001.png',
              cardId: 0,
            },
          ],
        },
        {
          setName: 'Test 2',
          id: 1,
          nextCardId: 1,
          cards: [
            {
              pokemonName: 'bulby boy',
              pokemonId: 1,
              infoType: 'flavor_text',
              info: {
                index: 0,
                textArray: [
                  'A strange seed was\nplanted on its\nback at birth.\fThe plant sprouts\nand grows with\nthis POKéMON.',
                  'It can go for days\nwithout eating a\nsingle morsel.\fIn the bulb on\nits back, it\nstores energy.',
                  'The seed on its\nback is filled\nwith nutrients.\fThe seed grows\nsteadily larger as\nits body grows.',
                  'It carries a seed\non its back right\nfrom birth. As it\fgrows older, the\nseed also grows\nlarger.',
                  'While it is young,\nit uses the\nnutrients that are\fstored in the\nseeds on its back\nin order to grow.',
                  'BULBASAUR can be seen napping in\nbright sunlight.\nThere is a seed on its back.\fBy soaking up the sun’s rays, the seed\ngrows progressively larger.',
                  'BULBASAUR can be seen napping in bright\nsunlight. There is a seed on its back.\nBy soaking up the sun’s rays, the seed\ngrows progressively larger.',
                  'There is a plant seed on its back right\nfrom the day this POKéMON is born.\nThe seed slowly grows larger.',
                  'A strange seed was planted on its back at\nbirth. The plant sprouts and grows with\nthis POKéMON.',
                  'For some time after its birth, it\ngrows by gaining nourishment from\nthe seed on its back.',
                  'The seed on its back is filled\nwith nutrients. The seed grows\nsteadily larger as its body grows.',
                  'It carries a seed on its back right\nfrom birth. As it grows older, the\nseed also grows larger.',
                  'A strange seed was planted on its back at birth.\nThe plant sprouts and grows with this Pokémon.',
                  'For some time after its birth, it grows by gaining\nnourishment from the seed on its back.',
                  'Bulbasaur can be seen napping in bright sunlight.\nThere is a seed on its back. By soaking up the sun’s rays,\nthe seed grows progressively larger.',
                  'It can go for days without eating a single morsel.\nIn the bulb on its back, it stores energy.',
                  'There is a plant seed on its back right from the\nday this Pokémon is born. The seed slowly\ngrows larger.',
                  'While it is young, it uses the nutrients that are\nstored in the seed on its back in order to grow.',
                ],
              },
              pokemonImg:
                'https://raw.githubusercontent.com/HybridShivam/Pokemon/master/assets/images/001.png',
              cardId: 0,
            },
          ],
        },
      ],
      nextSetId: 2,
    };
    return defaultData;
  }
  return JSON.parse(dataJSON);
}
