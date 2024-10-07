'use strict';
const views = [
  'home',
  'study sets',
  'flashcards',
  'quiz',
  'match',
  'asteroids',
];
const $menu = document.querySelector('.menu');
const $tabHolder = document.querySelector('.tabs');
const $closeMenuButton = document.querySelector('.close-menu');
if (!$menu) throw new Error('$menu query failed');
if (!$tabHolder) throw new Error('$tabHolder query failed');
if (!$closeMenuButton) throw new Error('$closeMenu query failed');
$closeMenuButton.addEventListener('click', closeMenu);
buildMenu();
function closeMenu() {
  if (!$menu) throw new Error('$menu does not exist');
  $menu.className = 'menu row dir-column hidden';
}
function buildMenu() {
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
function capitalizeWord(word) {
  return word[0].toUpperCase() + word.slice(1);
}
function capitalizeAllWords(words) {
  const individualWords = words.split(' ');
  const capitalizedWords = individualWords.map((word) => capitalizeWord(word));
  return capitalizedWords.join(' ');
}
