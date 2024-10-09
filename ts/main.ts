const menuViews = [
  'home',
  'study sets',
  'flashcards',
  'quiz',
  'match',
  'memory',
  'asteroids',
];

const $menu = document.querySelector('.menu') as HTMLDivElement;
const $tabHolder = document.querySelector('.tabs') as HTMLDivElement;
const $closeMenuButton = document.querySelector(
  '.close-menu',
) as HTMLButtonElement;
const $openMenuButton = document.querySelector('.open-menu');
const $views = document.querySelectorAll('.view');
const $newSetButton = document.querySelector('#new-set');
const $setsHolder = document.querySelector('#sets-holder');
const $viewingSet = document.querySelector('#viewing-set');
const $cardEditor = document.querySelector('[data-view="specific-card"]');

if (!$menu) throw new Error('$menu query failed');
if (!$tabHolder) throw new Error('$tabHolder query failed');
if (!$closeMenuButton) throw new Error('$closeMenu query failed');
if (!$openMenuButton) throw new Error('$openMenuButton query failed');
if (!$newSetButton) throw new Error('$newSetButton query failed');
if (!$setsHolder) throw new Error('$setsHolder query failed');
if (!$viewingSet) throw new Error('$viewingSet query failed');
if (!$cardEditor) throw new Error('$cardEditor query failed');

document.addEventListener('DOMContentLoaded', () => {
  viewSwap(data.currentView);
  setUpSets();
  if (data.editingCard) {
    openCardEditor(data.editingCard.cardId);
  } else if (data.viewingStudySet) {
    viewStudySet(data.viewingStudySet);
  }
});
$closeMenuButton.addEventListener('click', closeMenu);
$openMenuButton.addEventListener('click', openMenu);
$tabHolder.addEventListener('click', handleMenuInteraction);
$newSetButton.addEventListener('click', () => {
  console.log('click!');
  viewStudySet(data.sets[0]);
});
$setsHolder.addEventListener('click', handleSetsClick);

buildMenu();

function handleSetsClick(event: Event): void {
  const $eventTarget = event.target as HTMLElement;

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

function setUpSets(): void {
  const sets = data.sets;
  if (!sets.length) {
    showNoSets();
  }

  sets.forEach((studySet) => {
    const $row = renderSetName(studySet);
    $setsHolder?.append($row);
  });
}

function renderSetName(studySet: StudySet): HTMLDivElement {
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

function showNoSets(): void {
  if (!$setsHolder) throw new Error('$setsHolder does not exist');

  const $noSetsText = document.createElement('h3');
  $noSetsText.textContent =
    "It appears you don't have any sets, you can make your first one above";
  $noSetsText.className = 'text-center no-sets';

  $setsHolder.appendChild($noSetsText);
}

function viewStudySet(studySet: StudySet): void {
  if (!$viewingSet) throw new Error('$viewingSet does not exist');

  const { setName, cards } = studySet;
  data.viewingStudySet = studySet;
  viewSwap('specific-set');
  $viewingSet.replaceChildren();

  const $backRow = renderBackRow('All Sets', () => {
    data.viewingStudySet = null;
    viewSwap('study sets');
  });
  const $titleRow = renderTitleRow(setName);
  const $cardsContainer = document.createElement('div');

  $cardsContainer.className = 'row wrap';

  $viewingSet.append($backRow, $titleRow, $cardsContainer);

  cards.forEach((card) => {
    const renderedCard = renderBothSidesOfCard(card);
    $cardsContainer.append(renderedCard);
  });
}

function renderBothSidesOfCard(card: Card): HTMLDivElement {
  const { pokemonName, pokemonImg, info, cardId } = card;

  const $holder = document.createElement('div');
  $holder.className = 'row horz-padding';

  const $frontSide = renderPokemonSideOfCard(
    capitalizeWord(pokemonName),
    pokemonImg,
  );
  const $backSide = renderTextSideOfCard(info);
  const $buttons = renderTrashAndEdit(cardId);

  $holder.append($frontSide, $backSide, $buttons);

  return $holder;
}

function renderTrashAndEdit(cardId: number): HTMLDivElement {
  const $buttonHolder = document.createElement('div');
  const $editButton = document.createElement('button');
  const $trashButton = document.createElement('button');
  const $editIcon = document.createElement('i');
  const $trashIcon = document.createElement('i');

  $editButton.addEventListener('click', () => {
    openCardEditor(cardId);
  });
  $trashButton.addEventListener('click', () => {
    console.log('trash!');
  });

  $editButton.setAttribute('id', `${cardId}`);
  $trashButton.setAttribute('id', `${cardId}`);

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

function renderBackRow(
  text: string,
  buttonCallback: () => void,
): HTMLDivElement {
  const $row = document.createElement('div');
  const $button = document.createElement('button');
  const $arrow = document.createElement('i');
  const $text = document.createElement('h3');

  $row.className = 'row align-center bg-light-gray';
  $button.className = 'icon-button sm-icon gray-text';
  $arrow.className = 'fa-solid fa-arrow-left';
  $text.className = 'gray-text';

  $text.textContent = text;
  $button.addEventListener('click', () => {
    buttonCallback();
  });

  $button.append($arrow);
  $row.append($button, $text);

  return $row;
}

function openCardEditor(cardId: number): void {
  if (!$cardEditor) throw new Error('$cardEditor does not exist');
  $cardEditor.replaceChildren();

  const studySet = data.viewingStudySet;
  if (!studySet) throw new Error('Cannot edit card if not viewing set');

  const currentCard = studySet.cards.find((card) => card.cardId === cardId);
  if (!currentCard) {
    throw new Error('card id does not match any cards in study set');
  }

  data.editingCard = currentCard;

  viewSwap('specific-card');

  const $backRow = renderBackRow(studySet.setName, () => {
    data.editingCard = null;

    if (!data.viewingStudySet) {
      throw new Error('cannot view non existent study set');
    }
    viewStudySet(data.viewingStudySet);
  });

  const $container = document.createElement('div');
  const $cardFrontEditor = renderFrontSideEditor(currentCard);
  const $cardBackEditor = renderBackSideEditor(currentCard);

  $container.className = 'row wrap';

  $container.append($cardFrontEditor, $cardBackEditor);
  $cardEditor.append($backRow, $container);
}

function renderBackSideEditor(card: Card): HTMLDivElement {
  const $backSideEditor = document.createElement('div');

  const $infoTypeHolder = document.createElement('div');
  const $infoLabel = document.createElement('h2');
  const $infoSelector = document.createElement('select');
  const $infoMessage = document.createElement('p');
  const $option1 = document.createElement('option');

  $backSideEditor.className = 'horz-padding row dir-column';

  $infoTypeHolder.className = 'row dir-column';

  $infoLabel.textContent = 'Info';
  $infoLabel.setAttribute('for', 'info-type');

  $infoSelector.className = 'col-full gray-text dropdown';
  $infoSelector.setAttribute('id', 'info-type');

  $option1.textContent = 'Pokedex Entry';
  $option1.setAttribute('value', 'flavor_text');

  $infoMessage.textContent =
    'The information you want to associate with the pokemon';
  $infoMessage.className = 'gray-text';

  const $cardHolder = document.createElement('div');
  const $card = renderTextSideOfCard(card.info);
  const $leftButton = document.createElement('button');
  const $rightButton = document.createElement('button');
  const $leftIcon = document.createElement('i');
  const $rightIcon = document.createElement('i');

  $cardHolder.className = 'row justify-center align-center';

  $leftButton.className = 'icon-button';
  $rightButton.className = 'icon-button';

  $leftIcon.className = 'fa-solid fa-chevron-left';
  $rightIcon.className = 'fa-solid fa-chevron-right';

  $infoSelector.append($option1);
  $infoTypeHolder.append($infoLabel, $infoSelector, $infoMessage);
  $leftButton.append($leftIcon);
  $rightButton.append($rightIcon);
  $cardHolder.append($leftButton, $card, $rightButton);
  $backSideEditor.append($infoTypeHolder, $cardHolder);

  return $backSideEditor;
}

function renderFrontSideEditor(card: Card): HTMLDivElement {
  const $cardFrontEditor = document.createElement('div');
  const $titleRow = document.createElement('div');
  const $pokemonLabel = document.createElement('h2');
  const $pokemonName = document.createElement('p');
  const $changePokemonButton = document.createElement('button');
  const $pencilIcon = document.createElement('i');

  const $card = renderPokemonSideOfCard(card.pokemonName, card.pokemonImg);

  $cardFrontEditor.className = 'row dir-column horz-padding align-center';

  $titleRow.className = 'row align-center col-full justify-center';
  $pokemonLabel.textContent = 'Pokemon:';

  $pokemonName.textContent = capitalizeWord(card.pokemonName);
  $pokemonName.className = 'pokemon-name-editing';

  $changePokemonButton.className = 'icon-button gray-text sm-icon';
  $changePokemonButton.textContent = 'Change Pokemon';
  $pencilIcon.className = 'fa-solid fa-pencil';

  $changePokemonButton.prepend($pencilIcon);
  $titleRow.append($pokemonLabel, $pokemonName);
  $cardFrontEditor.append($titleRow, $card, $changePokemonButton);

  return $cardFrontEditor;
}

function renderTextSideOfCard(text: string): HTMLDivElement {
  const $card = document.createElement('div');
  const $text = document.createElement('p');

  $card.className = 'card';
  $text.textContent = text;

  $card.append($text);

  return $card;
}

function renderPokemonSideOfCard(
  name: string,
  imageURL: string,
): HTMLDivElement {
  const $card = document.createElement('div');
  const $imageWrapper = document.createElement('div');
  const $image = document.createElement('img');
  const $name = document.createElement('h3');

  $card.className = 'card';
  $imageWrapper.className = 'card-image';

  $image.setAttribute('src', imageURL);
  $name.textContent = capitalizeWord(name);

  $imageWrapper.append($image);
  $card.append($imageWrapper, $name);

  return $card;
}

function renderTitleRow(title: string): HTMLDivElement {
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

function handleMenuInteraction(event: Event): void {
  const $eventTarget = event.target as HTMLDivElement;

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

function viewSwap(view: string, $array = $views): void {
  $array.forEach(($view) => {
    if ($view.matches(`[data-view="${view}"]`)) {
      $view.className = 'view';
    } else {
      $view.className = 'view hidden';
    }
  });

  data.currentView = view;
  writeData();
}

function openMenu(): void {
  if (!$menu) throw new Error('$menu does not exist');

  $menu.className = 'menu row dir-column';
}

function closeMenu(): void {
  if (!$menu) throw new Error('$menu does not exist');

  $menu.className = 'menu row dir-column hidden';
}

function buildMenu(): void {
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

function capitalizeWord(word: string): string {
  return word[0].toUpperCase() + word.slice(1);
}

function capitalizeAllWords(words: string): string {
  const individualWords = words.split(' ');
  const capitalizedWords = individualWords.map((word) => capitalizeWord(word));
  return capitalizedWords.join(' ');
}
