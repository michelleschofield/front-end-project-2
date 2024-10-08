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
const $viewSetsButton = document.querySelector('#to-sets');
const $setsHolder = document.querySelector('#sets-holder');

if (!$menu) throw new Error('$menu query failed');
if (!$tabHolder) throw new Error('$tabHolder query failed');
if (!$closeMenuButton) throw new Error('$closeMenu query failed');
if (!$openMenuButton) throw new Error('$openMenuButton query failed');
if (!$newSetButton) throw new Error('$newSetButton query failed');
if (!$viewSetsButton) throw new Error('$viewSetsButton query failed');
if (!$setsHolder) throw new Error('$setsHolder query failed');

document.addEventListener('DOMContentLoaded', () => {
  viewSwap(data.currentView);
  setUpSets();
});
$closeMenuButton.addEventListener('click', closeMenu);
$openMenuButton.addEventListener('click', openMenu);
$tabHolder.addEventListener('click', handleMenuInteraction);
$newSetButton.addEventListener('click', () => {
  console.log('click!');
  viewStudySet(data.sets[0]);
});
$viewSetsButton.addEventListener('click', () => viewSwap('study sets'));

buildMenu();

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
  viewSwap('specific set');

  console.log('studySet:', studySet);
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

function viewSwap(view: string): void {
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
