Games = new Meteor.Collection('games');
Players = new Meteor.Collection('players');
Decks = new Meteor.Collection('decks');
Cards = new Meteor.Collection('cards');

function createNewGame(name) {
  return Games.insert({name: name, max_z_index: 0});
}

function createNewDeck(name) {
  return Decks.insert({name: name, card_names: []});
}

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
