var TOKEN_NAME = '[Token]';

Template.game.helpers({
    show: function() {
        return Session.equals('mode', 'game');
    },
    gameName: function() {
        var myGame = currentGame();
        return myGame && myGame.name;
    },
    playerName: function() {
        var me = currentPlayer();
        return me && me.name;
    },
    deckName: function() {
		var myDeck = currentPlayerDeck();
		return myDeck && myDeck.name;
    },
    deckCardCount: function() {
		var myDeck = currentPlayerDeck();
		return (myDeck && myDeck.card_names) ? myDeck.card_names.length : 0;
    },
    opponentPlayerName: function() {
		var myOpponent = currentOpponent();
		return myOpponent && myOpponent.name;
    },
    opponentDeckName: function() {
		var myOpponentDeck = currentOpponentDeck();
		return myOpponentDeck && myOpponentDeck.name;
    },
    opponentDeckCardCount: function() {
		var myOpponentDeck = currentOpponentDeck();
		return (myOpponentDeck && myOpponentDeck.card_names) ? myOpponentDeck.card_names.length : 0;
    },
    isStarted: function() {
	    return Cards.find({game_id: currentGameId(), player_id: currentPlayerId()}).count() > 0;
    },
    librarySize: function() {
		return Cards.find({game_id: currentGameId(), player_id: currentPlayerId(), $or: [{state: 'library'}, {state: 'libraryTop'}, {state: 'libraryBottom'}]}).count();
    },
    myHand: function() {
		return Cards.find({game_id: currentGameId(), player_id: currentPlayerId(), state: 'hand'}, {sort: {hand_time: 1}});
    },
    opponentIsStarted: function() {
	  var opp = currentOpponent();
	  return opp && Cards.find({game_id: currentGameId(), player_id: opp._id}).count() > 0;
    },
    opponentLibrarySize: function() {
	  var opp = currentOpponent();
	  return opp ? Cards.find({game_id: currentGameId(), player_id: opp._id, $or: [{state: 'library'}, {state: 'libraryTop'}, {state: 'libraryBottom'}]}).count() : 0;
    },
    opponentHand: function() {
	  var opp = currentOpponent();
	  return opp && Cards.find({game_id: currentGameId(), player_id: opp._id, state: 'hand'});
    },
    cardsOnMat: function() {
		return Cards.find({game_id: currentGameId(), $or: [{state: 'untapped'}, {state: 'tapped'}]})
	    .map(function (card) {
	      card.isToken = (card.name == TOKEN_NAME);
	      
	      if (Session.equals('menu', card._id)) {
	        card.menuItems = [card.state == 'untapped' ? {action: 'tap', text: 'tap'} : {action: 'untap', text: 'untap'}];
	        if (isCurrentPlayerId(card.player_id) && !card.isToken) {
	          card.menuItems.push(
	            {action: 'unsummon', text: 'return to hand'},
	            {action: 'libraryTop', text: 'put on top of library'},
	            {action: 'libraryBottom', text: 'put on bottom of library'});
	        }
	        card.menuTop = card.state == 'tapped' ? card.top + 28 : card.top;
	        card.menuLeft = card.state == 'tapped' ? card.left -28 : card.left;
	      }
	      
	      return card;
	    });
    }
   /* event
s: function() {
	  'click #show-game-form': function (e) {
	    $('#game-name').hide();
	    $('#change-game-form').css('display', 'inline');
	    $('#new-game').select();
	    e.preventDefault();
	  },
	  'click #cancel-game-form': function (e) {
	    $('#change-game-form').hide();
	    $('#game-name').show();
	    e.preventDefault();
	  },
	  'submit #change-game-form': function (e) {
	    var gameName = $.trim($('#new-game').val());
	    var existingGame, gameId;
	
	    e.preventDefault();
	
	    if (gameName.length == 0) {
	      return;
	    }
	
	    existingGame = Games.findOne({name: gameName});
	
	    if (existingGame) {
	      if (Players.find({game_id: existingGame._id, _id: {$ne: currentPlayerId()}}).count() >= 2) {
	        alert('There are already two players in ' + gameName);
	        return;
	      }
	
	      gameId = existingGame._id;
	    }
	    else {
	      gameId = createNewGame(gameName);
	    }
	    
	    Session.set('game_id', gameId);
	    Players.update(currentPlayerId(), {$set: {game_id: gameId}});
	
	    $('#change-game-form').hide();
	    $('#game-name').show();
	  },
	  'click #show-player-form': function (e) {
	    $('#player-name').hide();
	    $('#change-player-form').css('display', 'inline');
	    $('#new-player').select();
	    e.preventDefault();
	  },
	  'click #cancel-player-form': function (e) {
	    $('#change-player-form').hide();
	    $('#player-name').show();
	    e.preventDefault();
	  },
	  'submit #change-player-form': function (e) {
	    var playerName = $.trim($('#new-player').val());
	    var existingPlayer, playerId;
	
	    e.preventDefault();
	
	    if (playerName.length == 0) {
	      return;
	    }
	
	    existingPlayer = Players.findOne({name: playerName});
	
	    if (existingPlayer) {
	      playerId = existingPlayer._id;
	      Session.set('player_id', playerId);
	      Session.set('game_id', existingPlayer.game_id);
	    }
	    else {
	      playerId = currentPlayerId();
	      Players.update(playerId, {$set: {name: playerName}});
	    }
	
	    $('#change-player-form').hide();
	    $('#player-name').show();
	  },
	  'click #show-deck-form': function (e) {
	    $('#deck-name').hide();
	    $('#change-deck-form').css('display', 'inline');
	    $('#new-deck').select();
	    e.preventDefault();
	  },
	  'click #cancel-deck-form': function (e) {
	    $('#change-deck-form').hide();
	    $('#deck-name').show();
	    e.preventDefault();
	  },
	  'submit #change-deck-form': function (e) {
	    var deckName = $.trim($('#new-deck').val());
	    var existingDeck, deckId;
	    
	    e.preventDefault();
	
	    if (deckName.length == 0) {
	      return;
	    }
	
	    existingDeck = Decks.findOne({name: deckName});
	
	    if (existingDeck) {
	      deckId = existingDeck._id;
	    }
	    else {
	      deckId = createNewDeck(deckName);
	    }
	    
	    Players.update(currentPlayerId(), {$set: {deck_id: deckId}});
	
	    $('#change-deck-form').hide();
	    $('#deck-name').show();
	  },
	  'click #edit-deck': function (e) {
	    Session.set('mode', 'editor');
	    e.preventDefault();
	  },
	  'click #start': function () {
	    var myDeck = currentPlayerDeck();
	    var i;    
	    if (myDeck) {
	      for (i = 0; i < myDeck.card_names.length; i++) {
	        Cards.insert({name: myDeck.card_names[i], player_id: currentPlayerId(), game_id: currentGameId(), state: 'library' });
	      }
	    }
	  },
	  'mouseover .card-container, touchstart .card-container': function (e) {
	    var $cardContainer = $(e.currentTarget);
	    
	    if (!$cardContainer.data('isDraggable')) {
	      $cardContainer.data('isDraggable', true).draggable({distance: 3});
	    }
	  },
	  'click #draw': function () {
	    var myDeck = currentPlayerDeck();
	    var size, skip, card;
	    
	    if (myDeck) {
	      card = Cards.findOne({game_id: currentGameId(), player_id: currentPlayerId(), state: 'libraryTop'}, {sort: {library_top_time: -1}});
	      
	      if (!card) {
	        size = Cards.find({game_id: currentGameId(), player_id: currentPlayerId(), state: 'library'}).count();
	        if (size > 0) {
	          skip = Math.floor(Math.random() * size);
	          card = Cards.findOne({game_id: currentGameId(), player_id: currentPlayerId(), state: 'library'}, {skip: skip});
	        }
	      }
	      
	      if (!card) {
	        card = Cards.findOne({game_id: currentGameId(), player_id: currentPlayerId(), state: 'libraryBottom'}, {sort: {library_bottom_time: 1}});
	      }
	      
	      if (card) {
	        Cards.update(card._id, {$set: {state: 'hand', hand_time: new Date().getTime()}});
	      }
	    }
	  },
	  'click #search': function () {
	    Session.set('mode', 'search');
	  },
	  'click #shuffle': function () {
	    Cards.update({$or: [{state: 'libraryTop'}, {state: 'libraryBottom'}]}, {$set: {state: 'library'}}, {multi: true});
	  },
	  'click #token': function () {
	    var position = getNewCardPosition();
	    var maxZIndex = incrementCurrentMaxZIndex();
	    Cards.insert({name: TOKEN_NAME, player_id: currentPlayerId(), game_id: currentGameId(), state: 'untapped', top: position.top, left: position.left, z_index: maxZIndex });
	  },
	  'click #my-hand .card': function (e) {
	    var cardId = e.target.id.substring(5);
	    var position = getNewCardPosition();
	    var maxZIndex = incrementCurrentMaxZIndex();
	    Cards.update(cardId, {$set: {state: 'untapped', top: position.top, left: position.left, z_index: maxZIndex}});
	  },
	  'mousedown': function (e) {
	    var menuCardId = Session.get('menu');
	    if (e.target.id != 'menu' && e.target.id != ('card-' + menuCardId) && !$(e.target).parents('#menu').length) {
	      Session.set('menu', '');
	    }
	  },
	  'click #menu a': function (e) {
	    var cardId = Session.get('menu');
	    var $target = $(e.target);
	    
	    if ($target.hasClass('unsummon')) {
	      Cards.update(cardId, {$set: {state: 'hand', hand_time: new Date().getTime()}});
	    }
	    else if ($target.hasClass('tap')) {
	      Cards.update(cardId, {$set: {state: 'tapped'}});
	    }
	    else if ($target.hasClass('untap')) {
	      Cards.update(cardId, {$set: {state: 'untapped'}});
	    }
	    else if ($target.hasClass('libraryTop')) {
	      Cards.update(cardId, {$set: {state: 'libraryTop', library_top_time: new Date().getTime()}});
	    }
	    else if ($target.hasClass('libraryBottom')) {
	      Cards.update(cardId, {$set: {state: 'libraryBottom', library_bottom_time: new Date().getTime()}});
	    }
	    
	    e.preventDefault();
	    Session.set('menu', '');
	  }
    }
*/
})

Template.game.events = {
  'click #show-game-form': function (e) {
    $('#game-name').hide();
    $('#change-game-form').css('display', 'inline');
    $('#new-game').select();
    e.preventDefault();
  },
  'click #cancel-game-form': function (e) {
    $('#change-game-form').hide();
    $('#game-name').show();
    e.preventDefault();
  },
  'submit #change-game-form': function (e) {
    var gameName = $.trim($('#new-game').val());
    var existingGame, gameId;

    e.preventDefault();

    if (gameName.length == 0) {
      return;
    }

    existingGame = Games.findOne({name: gameName});

    if (existingGame) {
      if (Players.find({game_id: existingGame._id, _id: {$ne: currentPlayerId()}}).count() >= 2) {
        alert('There are already two players in ' + gameName);
        return;
      }

      gameId = existingGame._id;
    }
    else {
      gameId = createNewGame(gameName);
    }
    
    Session.set('game_id', gameId);
    Players.update(currentPlayerId(), {$set: {game_id: gameId}});

    $('#change-game-form').hide();
    $('#game-name').show();
  },
  'click #show-player-form': function (e) {
    $('#player-name').hide();
    $('#change-player-form').css('display', 'inline');
    $('#new-player').select();
    e.preventDefault();
  },
  'click #cancel-player-form': function (e) {
    $('#change-player-form').hide();
    $('#player-name').show();
    e.preventDefault();
  },
  'submit #change-player-form': function (e) {
    var playerName = $.trim($('#new-player').val());
    var existingPlayer, playerId;

    e.preventDefault();

    if (playerName.length == 0) {
      return;
    }

    existingPlayer = Players.findOne({name: playerName});

    if (existingPlayer) {
      playerId = existingPlayer._id;
      Session.set('player_id', playerId);
      Session.set('game_id', existingPlayer.game_id);
    }
    else {
      playerId = currentPlayerId();
      Players.update(playerId, {$set: {name: playerName}});
    }

    $('#change-player-form').hide();
    $('#player-name').show();
  },
  'click #show-deck-form': function (e) {
    $('#deck-name').hide();
    $('#change-deck-form').css('display', 'inline');
    $('#new-deck').select();
    e.preventDefault();
  },
  'click #cancel-deck-form': function (e) {
    $('#change-deck-form').hide();
    $('#deck-name').show();
    e.preventDefault();
  },
  'submit #change-deck-form': function (e) {
    var deckName = $.trim($('#new-deck').val());
    var existingDeck, deckId;
    
    e.preventDefault();

    if (deckName.length == 0) {
      return;
    }

    existingDeck = Decks.findOne({name: deckName});

    if (existingDeck) {
      deckId = existingDeck._id;
    }
    else {
      deckId = createNewDeck(deckName);
    }
    
    Players.update(currentPlayerId(), {$set: {deck_id: deckId}});

    $('#change-deck-form').hide();
    $('#deck-name').show();
  },
  'click #edit-deck': function (e) {
    Session.set('mode', 'editor');
    e.preventDefault();
  },
  'click #start': function () {
    var myDeck = currentPlayerDeck();
    var i;    
    if (myDeck) {
      for (i = 0; i < myDeck.card_names.length; i++) {
        Cards.insert({name: myDeck.card_names[i], player_id: currentPlayerId(), game_id: currentGameId(), state: 'library' });
      }
    }
  },
  'mouseover .card-container, touchstart .card-container': function (e) {
    var $cardContainer = $(e.currentTarget);
    
    if (!$cardContainer.data('isDraggable')) {
      $cardContainer.data('isDraggable', true).draggable({distance: 3});
    }
  },
  'click #draw': function () {
    var myDeck = currentPlayerDeck();
    var size, skip, card;
    
    if (myDeck) {
      card = Cards.findOne({game_id: currentGameId(), player_id: currentPlayerId(), state: 'libraryTop'}, {sort: {library_top_time: -1}});
      
      if (!card) {
        size = Cards.find({game_id: currentGameId(), player_id: currentPlayerId(), state: 'library'}).count();
        if (size > 0) {
          skip = Math.floor(Math.random() * size);
          card = Cards.findOne({game_id: currentGameId(), player_id: currentPlayerId(), state: 'library'}, {skip: skip});
        }
      }
      
      if (!card) {
        card = Cards.findOne({game_id: currentGameId(), player_id: currentPlayerId(), state: 'libraryBottom'}, {sort: {library_bottom_time: 1}});
      }
      
      if (card) {
        Cards.update(card._id, {$set: {state: 'hand', hand_time: new Date().getTime()}});
      }
    }
  },
  'click #search': function () {
    Session.set('mode', 'search');
  },
  'click #shuffle': function () {
    Cards.update({$or: [{state: 'libraryTop'}, {state: 'libraryBottom'}]}, {$set: {state: 'library'}}, {multi: true});
  },
  'click #token': function () {
    var position = getNewCardPosition();
    var maxZIndex = incrementCurrentMaxZIndex();
    Cards.insert({name: TOKEN_NAME, player_id: currentPlayerId(), game_id: currentGameId(), state: 'untapped', top: position.top, left: position.left, z_index: maxZIndex });
  },
  'click #my-hand .card': function (e) {
    var cardId = e.target.id.substring(5);
    var position = getNewCardPosition();
    var maxZIndex = incrementCurrentMaxZIndex();
    Cards.update(cardId, {$set: {state: 'untapped', top: position.top, left: position.left, z_index: maxZIndex}});
  },
  'mousedown': function (e) {
    var menuCardId = Session.get('menu');
    if (e.target.id != 'menu' && e.target.id != ('card-' + menuCardId) && !$(e.target).parents('#menu').length) {
      Session.set('menu', '');
    }
  },
  'click #menu a': function (e) {
    var cardId = Session.get('menu');
    var $target = $(e.target);
    
    if ($target.hasClass('unsummon')) {
      Cards.update(cardId, {$set: {state: 'hand', hand_time: new Date().getTime()}});
    }
    else if ($target.hasClass('tap')) {
      Cards.update(cardId, {$set: {state: 'tapped'}});
    }
    else if ($target.hasClass('untap')) {
      Cards.update(cardId, {$set: {state: 'untapped'}});
    }
    else if ($target.hasClass('libraryTop')) {
      Cards.update(cardId, {$set: {state: 'libraryTop', library_top_time: new Date().getTime()}});
    }
    else if ($target.hasClass('libraryBottom')) {
      Cards.update(cardId, {$set: {state: 'libraryBottom', library_bottom_time: new Date().getTime()}});
    }
    
    e.preventDefault();
    Session.set('menu', '');
  }
};

function getNewCardPosition() {
  var $mat = $('#mat');
  var top = $mat.height() / 2 - 100 + Math.floor(Math.random() * 31) - 15;
  var left = $mat.width() / 2 - 72 + Math.floor(Math.random() * 31) - 15;
  return { top: top, left: left };
}

$(function () {
  var prevDraggedId = '';
  var prevDraggedTime = 0;

  // jQuery UI drag'n'drop doesn't work well with the current version of Meteor,
  // since when the card is re-rendered mid-drag, it is "dropped" and no longer being dragged.
  // As a workaround, `elevate` and `dragged` are commented out below.
  // Consequently, when player 1 drags a card, player 2 doesn't see the card move
  // until player 1 drops the card.
  // TODO: Figure out a way to restore the original behavior.

  $('body').on('drag', '.card-container', function (e) {
    var now = new Date().getTime();
    var cardId;

    if (e.target.id != prevDraggedId) {
      cardId = e.target.id.substring(15);
      //elevate(cardId);
      prevDraggedId = e.target.id;
    }
    
    if (now - prevDraggedTime > 250) {
      if (!cardId) {
        cardId = e.target.id.substring(15);
      }
      //dragged(cardId, $(e.target).position());
      prevDraggedTime = now;
    }
  });
  
  $('body').on('dragstop', '.card-container', function (e) {
    var cardId = e.target.id.substring(15);
    elevate(cardId);
    dragged(cardId, $(e.target).position());
    prevDraggedId = '';
  });
  
  $('body').on('mouseup', '#mat .card', function (e) {
    var cardId;
    
    if (prevDraggedId != '') {
      return;
    }
  
    cardId = e.target.id.substring(5);
    elevate(cardId);
    Session.set('menu', cardId);
  });
  
  function dragged (cardId, position) {
    Cards.update(cardId, {$set: {top: position.top, left: position.left}});
    Session.set('menu', '');
  }
  
  function elevate (cardId) {
    maxZIndex = incrementCurrentMaxZIndex();
    Cards.update(cardId, {$set: {z_index: maxZIndex}});
  }
});
