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
      sets: [
        // {
        //   setName: 'tester',
        //   id: 0,
        //   cards: [
        //     {
        //       pokemonName: 'bulbasaur',
        //       pokemonId: 1,
        //       infoType: 'flavor_text',
        //       info: 'A strange seed was\nplanted on its\nback at birth.\fThe plant sprouts\nand grows with\nthis POKéMON.',
        //       pokemonImg:
        //         'https://raw.githubusercontent.com/HybridShivam/Pokemon/master/assets/images/001.png',
        //     },
        //   ],
        // },
      ],
      nextSetId: 1,
    };
    return defaultData;
  }
  return JSON.parse(dataJSON);
}
