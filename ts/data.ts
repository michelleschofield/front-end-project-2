/* exported data */
interface Card {
  pokemonName: string;
  pokemonId: number;
  infoType: string;
  info: {
    textArray?: string[];
    index?: number;
  };
  pokemonImg: string;
  cardId: number;
}

interface StudySet {
  setName: string;
  id: number;
  cards: Card[];
  nextCardId: number;
}

interface Data {
  currentView: string;
  sets: StudySet[];
  nextSetId: number;
  viewingStudySet: StudySet | null;
  editingCard: Card | null;
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
      viewingStudySet: null,
      editingCard: null,
      sets: [],
      nextSetId: 1,
    };
    return defaultData;
  }
  return JSON.parse(dataJSON);
}
