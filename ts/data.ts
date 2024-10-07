/* exported data */
interface Data {
  currentView: string;
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
    return { currentView: 'home' };
  }
  return JSON.parse(dataJSON);
}
