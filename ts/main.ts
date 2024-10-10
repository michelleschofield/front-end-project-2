interface FlavorTextEntry {
  flavor_text: string;
  language: {
    name: string;
  };
}

interface PokemonSpecies {
  flavor_text_entries: FlavorTextEntry[];
}

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
  createNewSet();
});
$setsHolder.addEventListener('click', handleSetsClick);

function createNewSet(): void {
  const setId = data.nextSetId;

  const studySet = {
    setName: 'New Set',
    id: setId,
    cards: [],
    nextCardId: 1,
  };

  data.sets.push(studySet);
  data.nextSetId++;

  viewStudySet(studySet);
}

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
  if (!$setsHolder) {
    throw new Error('$setsHolder does not exist');
  }
  $setsHolder.replaceChildren();

  const sets = data.sets;
  if (!sets.length) {
    showNoSets();
  }

  sets.forEach((studySet) => {
    const $row = renderSetName(studySet);
    $setsHolder.append($row);
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

  const $backRow = renderBackRow('All Sets', exitStudySet);
  const $titleRow = renderChangingTitleRow(setName);
  const $cardsContainer = document.createElement('div');

  $cardsContainer.className = 'row wrap';

  $viewingSet.append($backRow, $titleRow, $cardsContainer);

  cards.forEach((card) => {
    const renderedCard = renderBothSidesOfCard(card);
    $cardsContainer.append(renderedCard);
  });
}

function exitStudySet(): void {
  data.viewingStudySet = null;
  setUpSets();
  viewSwap('study sets');
}

function renderBothSidesOfCard(card: Card): HTMLDivElement {
  const { pokemonName, pokemonImg, infoType, info, cardId } = card;

  const $holder = document.createElement('div');
  $holder.className = 'row horz-padding';

  const $frontSide = renderPokemonSideOfCard(
    capitalizeWord(pokemonName),
    pokemonImg,
  );

  let $backSide;

  if (infoType === 'flavor_text') {
    if (!info.textArray || info.index === undefined) {
      throw new Error(
        'if the info type is flavor text there must be a text array and index',
      );
    }
    $backSide = renderTextSideOfCard(info.textArray[info.index]);
  }

  if (!$backSide) {
    throw new Error(
      'Shelly you need to come fix the renderBothSidesOfCard function to adapt to info types other than flavor_text!',
    );
  }

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
    editButtonListener(cardId);
  });
  $trashButton.addEventListener('click', () => {
    trashButtonListener(cardId);
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

function trashButtonListener(cardId: number): void {
  console.log('trash', cardId);
}

function editButtonListener(cardId: number): void {
  openCardEditor(cardId);
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
  if (!$cardEditor) {
    throw new Error('$cardEditor does not exist');
  }
  $cardEditor.replaceChildren();

  const studySet = data.viewingStudySet;

  if (!studySet) {
    throw new Error('Cannot edit card if not viewing set');
  }

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

  $cardBackEditor.addEventListener('change', () => {
    console.log('change');
  });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getFlavorText(pokemonData: PokemonSpecies): string[] {
  const flavorTextEntries = pokemonData.flavor_text_entries;
  const englishEntries = flavorTextEntries.filter(
    (entry) => entry.language.name === 'en',
  );

  const textArray = extractProperty(englishEntries, 'flavor_text');

  const textArrayUnique = removeDuplicates(textArray);

  return textArrayUnique;
}

function extractProperty<T extends object, K extends keyof T>(
  objectArray: T[],
  property: K,
): T[K][] {
  return objectArray.map((object) => {
    if (!(property in object)) {
      throw new Error(
        `${String(property)} is not a property of ${JSON.stringify(object)}`,
      );
    }
    return object[property];
  });
}

function removeDuplicates<T>(array: T[]): T[] {
  return [...new Set(array)];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getPokemonSpecies(
  idOrName: number | string,
): Promise<PokemonSpecies> {
  const url = `https://pokeapi.co/api/v2/pokemon-species/${idOrName}/`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP Error! Status: ${response.status}`);
  }

  const pokemonSpecies = (await response.json()) as PokemonSpecies;

  return pokemonSpecies;
}

function renderBackSideEditor(card: Card): HTMLDivElement {
  const { infoType, info } = card;
  const { textArray, index } = info;

  if (infoType !== 'flavor_text') {
    throw new Error(
      'Shelly you need to come fix the renderBackSideEditor function to adapt to info types other than flavor_text!',
    );
  }

  if (!textArray || index === undefined) {
    throw new Error(
      'if the info type is flavor text there must be a text array and index',
    );
  }

  const $backSideEditor = document.createElement('div');
  const $cardHolder = renderEditingFlavorText(textArray[index]);
  const $infoTypeHolder = renderInfoDropdown();

  $backSideEditor.className = 'horz-padding row dir-column';
  $backSideEditor.append($infoTypeHolder, $cardHolder);

  return $backSideEditor;
}

function renderInfoDropdown(): HTMLDivElement {
  const $infoTypeHolder = document.createElement('div');
  const $infoLabel = document.createElement('h2');
  const $infoSelector = document.createElement('select');
  const $infoMessage = document.createElement('p');

  const $pokedex = document.createElement('option');
  const $evolvesFrom = document.createElement('option');
  const $evolvesTo = document.createElement('option');
  const $types = document.createElement('option');

  $infoTypeHolder.className = 'row dir-column';

  $infoLabel.textContent = 'Info';
  $infoLabel.setAttribute('for', 'info-type');

  $infoSelector.className = 'col-full gray-text dropdown';
  $infoSelector.setAttribute('id', 'info-type');

  $pokedex.textContent = 'Pokedex Entry';
  $pokedex.setAttribute('value', 'flavor_text');

  $evolvesFrom.textContent = 'Evolves From';
  $evolvesFrom.setAttribute('value', 'evolves_from');

  $evolvesTo.textContent = 'Evolves To';
  $evolvesTo.setAttribute('value', 'evolves_to');

  $types.textContent = 'Type(s)';
  $types.setAttribute('value', 'types');

  $infoMessage.textContent =
    'The information you want to associate with the pokemon';
  $infoMessage.className = 'gray-text';

  $infoSelector.append($pokedex, $evolvesFrom, $evolvesTo, $types);
  $infoTypeHolder.append($infoLabel, $infoSelector, $infoMessage);

  return $infoTypeHolder;
}

function renderEditingFlavorText(text: string): HTMLDivElement {
  const $cardHolder = document.createElement('div');
  const $card = renderTextSideOfCard(text);
  const $leftButton = document.createElement('button');
  const $rightButton = document.createElement('button');
  const $leftIcon = document.createElement('i');
  const $rightIcon = document.createElement('i');

  $cardHolder.className = 'row justify-center align-center';

  $leftButton.className = 'icon-button';
  $rightButton.className = 'icon-button';

  $leftIcon.className = 'fa-solid fa-chevron-left';
  $rightIcon.className = 'fa-solid fa-chevron-right';

  $leftButton.append($leftIcon);
  $rightButton.append($rightIcon);
  $cardHolder.append($leftButton, $card, $rightButton);

  return $cardHolder;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function switchOutText(direction: number): void {
  const card = data.editingCard;
  if (!card) {
    throw new Error(
      'cannot switch out text of card that is not currently displayed',
    );
  }
  if (card.info.index === undefined || !card.info.textArray) {
    throw new Error(
      'cannot switch out text of card that does not have an index or a textArrays',
    );
  }
  card.info.index += direction;
  if (card.info.index < 0) {
    card.info.index = card.info.textArray?.length - 1;
  } else if (card.info.index > card.info.textArray?.length - 1) {
    card.info.index = 0;
  }
  writeData();
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
  $cardFrontEditor.append($titleRow, $changePokemonButton, $card);

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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  $changeTitleButton.addEventListener('click', () => {
    changeTitle();
  });

  return $titleRow;
}

function renderChangingTitleRow(currentTitle: string): HTMLElement {
  const $titleRow = document.createElement('form');
  const $title = document.createElement('input');
  const $changeTitleButton = document.createElement('button');

  $title.setAttribute('value', currentTitle);
  $changeTitleButton.textContent = 'Save Title';
  $changeTitleButton.className = 'icon-button gray-text change-title';
  $titleRow.className = 'row space-between align-center horz-padding';

  $titleRow.append($title, $changeTitleButton);

  $titleRow.addEventListener('submit', (event: Event) => {
    event.preventDefault();
    $titleRow.replaceWith(renderTitleRow($title.value));
    saveChangedTitle($title.value);
    console.log($title.value);
  });

  $title.focus();

  return $titleRow;
}

function changeTitle(): void {
  console.log('change title');
}

function saveChangedTitle(title: string): void {
  if (data.viewingStudySet) {
    data.viewingStudySet.setName = title;
    writeData();
  }
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

function capitalizeWord(word: string): string {
  return word[0].toUpperCase() + word.slice(1);
}
