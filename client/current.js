

//<script language="JavaScript" type="text/javascript" src="/model.js"></script>

var currentPlayerId = function () {
  return Session.get('player_id');
};

var isCurrentPlayerId = function(id) {
  return Session.equals('player_id', id);
}

var currentPlayer = function () {
  return Players.findOne(currentPlayerId());
};

var currentGameId = function () {
  return Session.get('game_id');
};

var currentGame = function () {
  return Games.findOne(currentGameId());
};

var currentOpponent = function () {
  return Players.findOne({_id: {$ne: currentPlayerId()}, game_id: currentGameId()});
};

var currentPlayerDeck = function () {
  var me = currentPlayer();
  return me && Decks.findOne(me.deck_id);
};

var currentOpponentDeck = function () {
  var myOpponent = currentOpponent();
  return myOpponent && Decks.findOne(myOpponent.deck_id);
};

var incrementCurrentMaxZIndex = function () {
  var myGame = currentGame();
  Games.update(myGame._id, {$inc: {max_z_index: 1}});
  return (myGame && myGame.max_z_index) || 0;
};

Meteor.startup(function () {

    Meteor.call('createGame', function (error, result) { 
        console.log("result");
        console.log(result);

        var gameId = result[0];
        var deckId = result[0];

        var playerId = Players.insert({name: '', game_id: gameId, deck_id: deckId});

        Games.update(gameId, {$set: {name: 'game-' + gameId}});
        Decks.update(deckId, {$set: {name: 'deck-' + deckId}});
        Players.update(playerId, {$set: {name: 'user-' + playerId}});

        Session.set('game_id', gameId);  
        Session.set('player_id', playerId);
        Session.set('mode', 'game');
        
        Meteor.subscribe('games');
        Meteor.subscribe('players');
        Meteor.subscribe('decks');

        Meteor.autosubscribe(function () {
          Meteor.subscribe('cards', Session.get('game_id'));
        });
    });

    console.log("2");
  //var gameId = createNewGame('');
  //var deckId = createNewDeck('');
  });
