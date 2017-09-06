'use strict';
module.exports = function(sequelize, DataTypes) {
  var Card = sequelize.define('Card', {
    deckId: DataTypes.INTEGER,
    front: DataTypes.STRING,
    back: DataTypes.STRING
}, {});


    Cards.associate = function(models){

        Cards.belongsTo(models.Deck,{
            as: "Deck",
            foreignKey: "deckId"
        })
    }
  return Card;
};
