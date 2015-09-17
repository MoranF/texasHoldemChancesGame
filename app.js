/// <reference path="typings/angular2/angular2.d.ts" />
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var angular2_1 = require('angular2/angular2');
//service
var Game = (function () {
    function Game() {
        this.pack = [];
        this.players = [];
        this.streets = [];
    }
    Game.prototype.setNewPack = function () {
        this.pack = [];
        for (var i = 0; i < 13; i++) {
            for (var j = 0; j < 4; j++) {
                this.pack.push(new Card(i, j));
            }
        }
    };
    Game.prototype.newRandomCard = function () {
        var cardIndex = Math.floor(Math.random() * (this.pack.length));
        var card = this.pack[cardIndex];
        this.pack.splice(cardIndex, 1);
        return card;
    };
    Game.prototype.startNewRound = function () {
        this.setNewPack();
        var player1 = new Player(1, [this.newRandomCard(), this.newRandomCard()]);
        var player2 = new Player(2, [this.newRandomCard(), this.newRandomCard()]);
        this.players = [player1, player2];
        this.streets = [this.newRandomCard(), this.newRandomCard(), this.newRandomCard()];
    };
    return Game;
})();
var CardComponent = (function () {
    function CardComponent() {
    }
    CardComponent.prototype.getCardValue = function (cardValue) {
        switch (cardValue) {
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
    };
    CardComponent.prototype.getCardSymbol = function (cardSymbol) {
        switch (cardSymbol) {
            case 0:
                return '\u2660';
            case 1:
                return '\u2663';
            case 2:
                return '\u2665';
            case 3:
                return '\u2666';
        }
    };
    CardComponent = __decorate([
        angular2_1.Component({
            selector: 'card',
            properties: ['cardInfo: card-info']
        }),
        angular2_1.View({
            template: '{{getCardValue(cardInfo.value)}} {{getCardSymbol(cardInfo.symbol)}}'
        }), 
        __metadata('design:paramtypes', [])
    ], CardComponent);
    return CardComponent;
})();
// Annotation section
var StreetsComponent = (function () {
    function StreetsComponent() {
    }
    StreetsComponent.prototype.isRedSymbol = function (symbol) {
        if (symbol > 1) {
            return true;
        }
    };
    StreetsComponent = __decorate([
        angular2_1.Component({
            selector: 'streets',
            properties: ['cards: cards']
        }),
        angular2_1.View({
            template: '<ul><li *ng-for="#card of cards" [class.is-red]="isRedSymbol(card.symbol)"><card [card-info]="card"></card></li></ul>',
            directives: [angular2_1.NgFor, CardComponent]
        }), 
        __metadata('design:paramtypes', [])
    ], StreetsComponent);
    return StreetsComponent;
})();
// Annotation section
var scoresComponent = (function () {
    function scoresComponent() {
    }
    scoresComponent.prototype.checkScore = function (score) {
        if (score === this.answer) {
            console.log('right');
        }
        else {
            console.log('wrong');
        }
    };
    scoresComponent = __decorate([
        angular2_1.Component({
            selector: 'scores',
            properties: ['scores: scores', 'answer: answer']
        }),
        angular2_1.View({
            template: '<ul><li *ng-for="#score of scores" class="score" (click)=checkScore(score)>{{score}}%</li></ul>',
            directives: [angular2_1.NgFor]
        }), 
        __metadata('design:paramtypes', [])
    ], scoresComponent);
    return scoresComponent;
})();
// Annotation section
var PlayerComponent = (function () {
    function PlayerComponent() {
    }
    PlayerComponent.prototype.isRedSymbol = function (symbol) {
        if (symbol > 1) {
            return true;
        }
    };
    PlayerComponent = __decorate([
        angular2_1.Component({
            selector: 'player',
            properties: ['playerInfo: player-info']
        }),
        angular2_1.View({
            template: '<ul><li *ng-for="#card of playerInfo.cards" [class.is-red]="isRedSymbol(card.symbol)"><card [card-info]="card"></card></li></ul>',
            directives: [angular2_1.NgFor, CardComponent]
        }), 
        __metadata('design:paramtypes', [])
    ], PlayerComponent);
    return PlayerComponent;
})();
// Annotation section
var AppComponent = (function () {
    function AppComponent(game) {
        this.calc = new oddsCalculator();
        this.game = game;
        this.startNewRound();
    }
    AppComponent.prototype.startNewRound = function () {
        this.game.startNewRound();
        this.players = this.game.players;
        this.streets = this.game.streets;
        var calculatedScores = this.calc.calculate(this.players, this.streets);
        this.scores = [];
        this.rightAnswer = Math.round(calculatedScores[0].wins);
        this.scores.push(this.rightAnswer);
        this.setFakeScores();
    };
    AppComponent.prototype.shuffleScores = function (o) {
        for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x)
            ;
        return o;
    };
    AppComponent.prototype.setFakeScores = function () {
        var score;
        var i;
        i = 0;
        // get 3 fake scores
        while (i < 3) {
            score = Math.floor(Math.random() * (101));
            for (var j = 0; j < this.scores.length; j++) {
                if (this.scores[j] < score + 5 && this.scores[j] > score - 5) {
                    break;
                }
            }
            if (j === this.scores.length) {
                this.scores.push(score);
                ++i;
            }
        }
        this.shuffleScores(this.scores);
    };
    AppComponent = __decorate([
        angular2_1.Component({
            selector: 'app',
            appInjector: [Game]
        }),
        angular2_1.View({
            template: "<ul><li *ng-for=\"#player of players; #i=index\" class=\"player\"><div>player{{i + 1}}:</div><player [player-info]=\"player\"></player></li></ul>\n\t<div class=\"flop\">flop:<streets [cards]=\"streets\"></streets></div>\n\t<div>What are Player1 chances to win?</div>\n\t<scores [scores]=\"scores\" [answer]=\"rightAnswer\"></scores>",
            directives: [angular2_1.NgFor, PlayerComponent, StreetsComponent, scoresComponent]
        }), 
        __metadata('design:paramtypes', [Game])
    ], AppComponent);
    return AppComponent;
})();
angular2_1.bootstrap(AppComponent);
