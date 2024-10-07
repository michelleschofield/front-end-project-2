'use strict';
const views = [
  'home',
  'study sets',
  'flashcards',
  'quiz',
  'match',
  'asteroids',
];
const $tabHolder = document.querySelector('.tabs');
if (!$tabHolder) throw new Error('there is no tab holder');
buildMenu();
function buildMenu() {
  views.forEach((view) => {
    const $tab = document.createElement('div');
    const $text = document.createElement('h2');
    $text.textContent = capitalizeAllWords(view);
    $tab.className = 'tab';
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
