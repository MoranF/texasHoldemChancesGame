/// <reference path="typings/angular2/angular2.d.ts" />

import {Component, View, bootstrap, NgFor} from 'angular2/angular2';

//service
class Game {
	constructor() {	
	}
	pack = [];
	players = [];
	streets = [];

	setNewPack() {
		this.pack = [];
		for(var i = 0; i < 13; i++) {
			for(var j = 0; j < 4; j++) {
				this.pack.push(new Card(i, j));
			}
		}
	}

	newRandomCard() {
		var cardIndex = Math.floor(Math.random() * (this.pack.length));
		var card = this.pack[cardIndex];
		this.pack.splice(cardIndex, 1);
		return card;
	}

	startNewRound() {
		this.setNewPack();
		var player1 = new Player(1, [this.newRandomCard(), this.newRandomCard()]);
		var player2 = new Player(2, [this.newRandomCard(), this.newRandomCard()]);
		this.players = [player1, player2];
		this.streets = [this.newRandomCard(), this.newRandomCard(), this.newRandomCard()];
	}

}


@Component({
	selector: 'card',
  	properties: ['cardInfo: card-info']
})
@View({
	template: '{{getCardValue(cardInfo.value)}} {{getCardSymbol(cardInfo.symbol)}}'
})
// Component controller
class CardComponent {

	constructor() {
	}

	getCardValue(cardValue) {
		switch(cardValue) {
			case 9:
				return 'Jack';
			case 10:
				return 'Queen';
			case 11:
				return 'King';
			case 12: 
				return 'Ace';
			default: 
				//numbers
				return cardValue + 2;
		}
	}

	getCardSymbol(cardSymbol) {
		switch(cardSymbol) {
			case 0:
			return '\u2660';
			case 1:
			return '\u2663';
			case 2:
			return '\u2665';
			case 3:
			return '\u2666';
		}
	}
}

// Annotation section
@Component({
	selector: 'streets',
  	properties: ['cards: cards']
})
@View({
	template: '<ul><li *ng-for="#card of cards"><card [card-info]="card"></card></li></ul>',
	directives: [NgFor, CardComponent]
})
// Component controller
class StreetsComponent {

	constructor() {
	}
}

// Annotation section
@Component({
	selector: 'scores',
  	properties: ['scores: scores', 'answer: answer']
})
@View({
	template: '<ul><li *ng-for="#score of scores" (click)=checkScore(score)>{{score}}%</li></ul>',
	directives: [NgFor]
})
// Component controller
class scoresComponent {

	constructor() {
	}

	checkScore(score) {
		if(score === this.answer) {
			console.log('right');
		}
		else {
			console.log('wrong');
		}
	}
}

// Annotation section
@Component({
	selector: 'player',
  	properties: ['playerInfo: player-info']
})
@View({
	template: '<ul><li *ng-for="#card of playerInfo.cards"><card [card-info]="card"></card></li></ul>',
	directives: [NgFor, CardComponent]
})
// Component controller
class PlayerComponent {
	constructor() {
	}
}

// Annotation section
@Component({
	selector: 'app',
  	appInjector: [Game]
})
@View({
	template: `<ul><li *ng-for="#player of players; #i=index"><div>player{{i + 1}}</div><player [player-info]="player"></player></li></ul>
	<streets [cards]="streets"></streets>
	<div>What are Player1 chances to win?</div>
	<scores [scores]="scores" [answer]="rightAnswer"></scores>`,
	directives: [NgFor,PlayerComponent, StreetsComponent, scoresComponent]
})
// Component controller
class AppComponent {  
	players: [];
	streets: [];
	scores: [];
	rightAnswer: number;

	constructor(game: Game) {
		this.calc = new oddsCalculator();
		this.game = game;
		this.startNewRound();
	}

	startNewRound() {
		this.game.startNewRound();
		this.players = this.game.players;
		this.streets = this.game.streets;
		var calculatedScores = this.calc.calculate(this.players, this.streets);
		this.scores = [];
		this.rightAnswer = Math.round(calculatedScores[0].wins);
		this.scores.push(this.rightAnswer);
		this.setFakeScores();
	}

	shuffleScores(o) {
	    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
	    return o;
	}

	setFakeScores() {
		var score: number;
		var i: number;
		i = 0;
		// get 3 fake scores
		while(i < 3) {
			score = Math.floor(Math.random() * (101));
			for(var j = 0; j < this.scores.length; j++) {
				if(this.scores[j] < score + 5 && this.scores[j] > score - 5) {
					break;
				}
			}
			if(j === this.scores.length) {
				this.scores.push(score);
				++i;
			}
		}
		this.shuffleScores(this.scores);
	}
}


bootstrap(AppComponent);