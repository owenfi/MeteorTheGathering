Games = new Meteor.Collection('games');
Players = new Meteor.Collection('players');
Decks = new Meteor.Collection('decks');
Cards = new Meteor.Collection('cards');

createNewGame = function(name) {
  return Games.insert({name: name, max_z_index: 0});
}

createNewDeck = function (name) {
  return Decks.insert({name: name, card_names: []});
}

Meteor.methods({
  
  createGame: function() {
    var gameId = createNewGame('');
    var deckId = createNewDeck('');

    return [gameId, deckId];
  }
});

Games.allow({
  'insert': function (userId, doc) {
    return true;
  },
  'update': function (userId, docs, fields, modifier) {
    return true;
  }
});

Players.allow({
  'insert': function (userId, doc) {
    return true;
  },
  'update': function (userId, docs, fields, modifier) {
    return true;
  }
});

Decks.allow({
  'insert': function (userId, doc) {
    return true;
  },
  'update': function (userId, docs, fields, modifier) {
    return true;
  }
});

Cards.allow({
  'insert': function (userId, doc) {
    return true;
  },
  'update': function (userId, docs, fields, modifier) {
    return true;
  }
});

if (Meteor.is_server) {
  Games.allow({
    'insert': function (userId, doc) {
      return true;
    },
    'update': function (userId, docs, fields, modifier) {
      return true;
    }
  });

  Players.allow({
    'insert': function (userId, doc) {
      return true;
    },
    'update': function (userId, docs, fields, modifier) {
      return true;
    }
  });

  Decks.allow({
    'insert': function (userId, doc) {
      return true;
    },
    'update': function (userId, docs, fields, modifier) {
      return true;
    }
  });

  Cards.allow({
    'insert': function (userId, doc) {
      return true;
    },
    'update': function (userId, docs, fields, modifier) {
      return true;
    }
  });

  Meteor.publish('games', function () {
    return Games.find({});
  });  

  Meteor.publish('players', function () {
    return Players.find();
  });

  Meteor.publish('decks', function () {
    return Decks.find();
  });

  Meteor.publish('cards', function (gameId) {
    return Cards.find({game_id: gameId});
  });
}
