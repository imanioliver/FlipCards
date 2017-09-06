'use strict';
module.exports = function(sequelize, DataTypes) {
  var Deck = sequelize.define('Deck', {
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {});

  Deck.associate = function(models){
      Deck.belongsTo(models.User, {
          as: "User",
          foreignKey: "userId"
      })

      Deck.hasMany(models.Card, {
          as: "Cards",
          foreignKey: "deckId"
      })
  }
  return Deck;
};
