/* exported data */
interface Card {
  pokemonName: string;
  pokemonId: number;
  infoType: string;
  info: string;
  pokemonImg: string;
}

interface StudySet {
  setName: string;
  id: number;
  cards: Card[];
}

interface Data {
  currentView: string;
  sets: StudySet[];
  nextSetId: number;
}

const data: Data = readData();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function writeData(): void {
  const dataJSON = JSON.stringify(data);
  localStorage.setItem('pokedata', dataJSON);
}

function readData(): Data {
  const dataJSON = localStorage.getItem('pokedata');
  if (!dataJSON) {
    const defaultData: Data = {
      currentView: 'home',
      sets: [
        {
          setName: 'tester',
          id: 0,
          cards: [
            {
              pokemonName: 'bulbasaur',
              pokemonId: 1,
              infoType: 'flavor_text',
              info: 'A strange seed was\nplanted on its\nback at birth.\fThe plant sprouts\nand grows with\nthis POKéMON.',
              pokemonImg:
                'https://raw.githubusercontent.com/HybridShivam/Pokemon/master/assets/images/001.png',
            },
          ],
        },
        {
          setName: 'Test 2',
          id: 1,
          cards: [
            {
              pokemonName: 'bulbasaur',
              pokemonId: 1,
              infoType: 'flavor_text',
              info: 'A strange seed was\nplanted on its\nback at birth.\fThe plant sprouts\nand grows with\nthis POKéMON.',
              pokemonImg:
                'https://raw.githubusercontent.com/HybridShivam/Pokemon/master/assets/images/001.png',
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
