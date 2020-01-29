const str = "Hi, I am 'Greek' geek from 'Geekbrains'. Google Instant doesn't work &rsaquo; I don't see results appear when I type.";
const regexp = /\B'(.+?)'\B/g;

console.log(str);
console.log(str.replace(regexp, '\"$1\"' ));

