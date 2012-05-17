Template.editor.show = function () {
  return Session.equals('mode', 'editor');
};

Template.editor.deckName = function () {
	var myDeck = currentPlayerDeck();
  return myDeck && myDeck.name;
};

Template.editor.deckCardCount = function () {
  var myDeck = currentPlayerDeck();
  return (myDeck && myDeck.card_names) ? myDeck.card_names.length : 0;
};

Template.editor.cards = function () {
  var myDeck = currentPlayerDeck();
  return myDeck ? myDeck.card_names : [];
};

Template.editor.events = {
  'click #done-editing': function (e) {
    Session.set('mode', 'game');
    e.preventDefault();
  },
  'submit #add-card-form': function (e) {
    var cardNameStr = $.trim($('#new-card').val());
    var me;
    var cardNames;
    
    if (cardNameStr.length > 0) {
      me = currentPlayer();
      if (me) {
        cardNames = [];
        $.each(cardNameStr.split(';'), function (key, cardName) {
          cardName = $.trim(cardName);
          if (cardName.length > 0) {
            cardNames.push(cardName);
          }
        });
        Decks.update(me.deck_id, {$pushAll: {card_names: cardNames}});
      }
    }
    e.preventDefault();
  },
  'click .card': function (e) {
    var cardName = $(e.target).attr('alt');
    if (cardName && cardName.length > 0) {
      var me = currentPlayer();
      if (me) {
        Decks.update(me.deck_id, {$pull: {card_names: cardName}});
      }
    }
  }
};



