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
      sets: [],
      nextSetId: 1,
    };
    return defaultData;
  }
  return JSON.parse(dataJSON);
}
