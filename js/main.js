'use strict';
const menuViews = [
  'home',
  'study sets',
  'flashcards',
  'quiz',
  'match',
  'memory',
  'asteroids',
];
const $menu = document.querySelector('.menu');
const $tabHolder = document.querySelector('.tabs');
const $closeMenuButton = document.querySelector('.close-menu');
const $openMenuButton = document.querySelector('.open-menu');
const $views = document.querySelectorAll('.view');
const $newSetButton = document.querySelector('#new-set');
const $viewSetsButton = document.querySelector('#to-sets');
const $setsHolder = document.querySelector('#sets-holder');
const $viewingSet = document.querySelector('#viewing-set');
if (!$menu) throw new Error('$menu query failed');
if (!$tabHolder) throw new Error('$tabHolder query failed');
if (!$closeMenuButton) throw new Error('$closeMenu query failed');
if (!$openMenuButton) throw new Error('$openMenuButton query failed');
if (!$newSetButton) throw new Error('$newSetButton query failed');
if (!$viewSetsButton) throw new Error('$viewSetsButton query failed');
if (!$setsHolder) throw new Error('$setsHolder query failed');
if (!$viewingSet) throw new Error('$viewingSet query failed');
document.addEventListener('DOMContentLoaded', () => {
  viewSwap(data.currentView);
  setUpSets();
  if (data.viewingStudySet) viewStudySet(data.viewingStudySet);
});
$closeMenuButton.addEventListener('click', closeMenu);
$openMenuButton.addEventListener('click', openMenu);
$tabHolder.addEventListener('click', handleMenuInteraction);
$newSetButton.addEventListener('click', () => {
  console.log('click!');
  viewStudySet(data.sets[0]);
});
$viewSetsButton.addEventListener('click', () => {
  data.viewingStudySet = null;
  $viewingSet.replaceChildren();
  viewSwap('study sets');
});
$setsHolder.addEventListener('click', handleSetsClick);
buildMenu();
function handleSetsClick(event) {
  const $eventTarget = event.target;
  if ($eventTarget.matches('.row')) {
    return;
  }
  const $row = $eventTarget.closest('.row');
  const setId = $row?.getAttribute('data-set-id');
  if (!setId) return;
  const studySet = data.sets.find((studySet) => studySet.id === +setId);
  if (!studySet) throw new Error(`no study sets match the id ${setId}`);
  viewStudySet(studySet);
}
function setUpSets() {
  const sets = data.sets;
  if (!sets.length) {
    showNoSets();
  }
  sets.forEach((studySet) => {
    const $row = renderSetName(studySet);
    $setsHolder?.append($row);
  });
}
function renderSetName(studySet) {
  const $row = document.createElement('div');
  const $setName = document.createElement('h2');
  const $viewSetButton = document.createElement('button');
  const $arrowIcon = document.createElement('i');
  $row.className = 'row align-center justify-right';
  $row.setAttribute('data-set-id', `${studySet.id}`);
  $setName.textContent = studySet.setName;
  $viewSetButton.className = 'icon-button';
  $arrowIcon.className = 'fa-solid fa-arrow-right';
  $viewSetButton.appendChild($arrowIcon);
  $row.append($setName, $viewSetButton);
  return $row;
}
function showNoSets() {
  if (!$setsHolder) throw new Error('$setsHolder does not exist');
  const $noSetsText = document.createElement('h3');
  $noSetsText.textContent =
    "It appears you don't have any sets, you can make your first one above";
  $noSetsText.className = 'text-center no-sets';
  $setsHolder.appendChild($noSetsText);
}
function viewStudySet(studySet) {
  const { setName, cards } = studySet;
  data.viewingStudySet = studySet;
  viewSwap('specific set');
  if (!$viewingSet) throw new Error('$viewingSet does not exist');
  const $titleRow = renderTitleRow(setName);
  $viewingSet.append($titleRow);
  cards.forEach((card) => {
    const renderedCard = renderBothSidesOfCard(card);
    $viewingSet.append(renderedCard);
  });
}
function renderBothSidesOfCard(card) {
  const { pokemonName, pokemonImg, info } = card;
  const $holder = document.createElement('div');
  $holder.className = 'row horz-padding space-between';
  const $frontSide = renderPokemonSideOfCard(
    capitalizeWord(pokemonName),
    pokemonImg,
  );
  const $backSide = renderTextSideOfCard(info);
  const $buttons = renderTrashAndEdit();
  $holder.append($frontSide, $backSide, $buttons);
  return $holder;
}
function renderTrashAndEdit() {
  const $buttonHolder = document.createElement('div');
  const $editButton = document.createElement('button');
  const $trashButton = document.createElement('button');
  const $editIcon = document.createElement('i');
  const $trashIcon = document.createElement('i');
  $buttonHolder.className = 'row dir-column small-text justify-center';
  $editButton.className = 'icon-button gray-text';
  $trashButton.className = 'icon-button gray-text';
  $editIcon.className = 'fa-solid fa-pen-to-square';
  $trashIcon.className = 'fa-solid fa-trash-can';
  $editButton.append($editIcon);
  $trashButton.append($trashIcon);
  $buttonHolder.append($editButton, $trashButton);
  return $buttonHolder;
}
function renderTextSideOfCard(text) {
  const $card = document.createElement('div');
  const $text = document.createElement('p');
  $card.className = 'card';
  $text.textContent = text;
  $card.append($text);
  return $card;
}
function renderPokemonSideOfCard(name, imageURL) {
  const $card = document.createElement('div');
  const $imageWrapper = document.createElement('div');
  const $image = document.createElement('img');
  const $name = document.createElement('h3');
  $card.className = 'card';
  $imageWrapper.className = 'card-image';
  $image.setAttribute('src', imageURL);
  $name.textContent = name;
  $imageWrapper.append($image);
  $card.append($imageWrapper, $name);
  return $card;
}
function renderTitleRow(title) {
  const $titleRow = document.createElement('div');
  const $title = document.createElement('h2');
  const $changeTitleButton = document.createElement('button');
  const $pencilIcon = document.createElement('i');
  $title.textContent = title;
  $changeTitleButton.textContent = 'Change Title';
  $changeTitleButton.className = 'icon-button gray-text change-title';
  $pencilIcon.className = 'fa-solid fa-pencil';
  $titleRow.className = 'row space-between align-center horz-padding';
  $changeTitleButton.prepend($pencilIcon);
  $titleRow.append($title, $changeTitleButton);
  return $titleRow;
}
function handleMenuInteraction(event) {
  const $eventTarget = event.target;
  let $tab;
  if ($eventTarget.matches('.tab')) {
    $tab = $eventTarget;
  } else {
    $tab = $eventTarget.closest('.tab');
  }
  if (!$tab) return;
  const view = $tab.getAttribute('data-view');
  if (!view) throw new Error('$tab does not have an associated view');
  viewSwap(view);
  closeMenu();
}
function viewSwap(view) {
  $views.forEach(($view) => {
    if ($view.matches(`[data-view="${view}"]`)) {
      $view.className = 'view';
    } else {
      $view.className = 'view hidden';
    }
  });
  data.currentView = view;
  writeData();
}
function openMenu() {
  if (!$menu) throw new Error('$menu does not exist');
  $menu.className = 'menu row dir-column';
}
function closeMenu() {
  if (!$menu) throw new Error('$menu does not exist');
  $menu.className = 'menu row dir-column hidden';
}
function buildMenu() {
  menuViews.forEach((menuView) => {
    const $tab = document.createElement('div');
    const $text = document.createElement('h2');
    $text.textContent = capitalizeAllWords(menuView);
    $tab.className = 'tab';
    $tab.setAttribute('data-view', menuView);
    $tab.appendChild($text);
    $tabHolder?.appendChild($tab);
  });
}
function capitalizeWord(word) {
  return word[0].toUpperCase() + word.slice(1);
}
function capitalizeAllWords(words) {
  const individualWords = words.split(' ');
  const capitalizedWords = individualWords.map((word) => capitalizeWord(word));
  return capitalizedWords.join(' ');
}
