const views = [
  'home',
  'study sets',
  'flashcards',
  'quiz',
  'match',
  'asteroids',
];

const $menu = document.querySelector('.menu') as HTMLDivElement;
const $tabHolder = document.querySelector('.tabs') as HTMLDivElement;
const $closeMenuButton = document.querySelector(
  '.close-menu',
) as HTMLButtonElement;
const $openMenuButton = document.querySelector('.open-menu');

if (!$menu) throw new Error('$menu query failed');
if (!$tabHolder) throw new Error('$tabHolder query failed');
if (!$closeMenuButton) throw new Error('$closeMenu query failed');
if (!$openMenuButton) throw new Error('$openMenuButton query failed');

$closeMenuButton.addEventListener('click', closeMenu);
$openMenuButton.addEventListener('click', openMenu);

buildMenu();

function openMenu(): void {
  if (!$menu) throw new Error('$menu does not exist');

  $menu.className = 'menu row dir-column';
}

function closeMenu(): void {
  if (!$menu) throw new Error('$menu does not exist');

  $menu.className = 'menu row dir-column hidden';
}

function buildMenu(): void {
  views.forEach((view) => {
    const $tab = document.createElement('div');
    const $text = document.createElement('h2');

    $text.textContent = capitalizeAllWords(view);
    $tab.className = 'tab';
    $tab.setAttribute('data-view', view);

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
