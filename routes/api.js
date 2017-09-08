const express           = require("express");
const router            = express.Router();
const bcrypt            = require("bcrypt");
const User              = require("../models/index").User;
const Deck              = require("../models/index").Deck;
const Card              = require("../models/index").Card;

const passport = require('passport');




function objectIt (a, b, c){
    let obj = {
        status: a,
        message: b,
        data: c
    };
    return obj
}

router.get("/api/", passport.authenticate('basic', { session: false }), function(req, res) {
    User.findAll({})
    .then(function(data) {
        // res.render("index")
        res.status(200).send("Authenticated home");
    })
    .catch(function(err) {
        console.log(err);
        res.status(500).send("error")
    });
});

router.post('/api/login', passport.authenticate('local', {
    successRedirect: '/api/decks',
    failureRedirect: '/api/entry',
    failureFlash: true
}));

router.get("/api/entry", passport.authenticate('basic', { session: false }), function(req, res) {
    res.status(200).send("entry");
});

router.post("/api/signup", passport.authenticate('basic', { session: false }), function(req, res) {
    let name = req.body.name
    let username = req.body.username
    let password = req.body.passwordHash

    if (!username || !password) {
        req.flash('error', "Please, fill in all the fields.");
        res.redirect('/api/entry')
    }

    let salt = bcrypt.genSaltSync(10)
    let hashedPassword = bcrypt.hashSync(password, salt)

    let newUser = {
        name: name,
        username: username,
        passwordHash: hashedPassword,
        salt: salt,
    }

    User.create(newUser)
    .then(function(data) {
        res.status(200).send(data)})
    .catch(function(error) {
        // req.flash('error', "Please, choose a different username.")
        res.status(500).send(error)
        // res.redirect('/api/entry')

    });

});

router.post('/api/', passport.authenticate('local', {
    successRedirect: '/api/decks',
    failureRedirect: '/api/',
    failureFlash: true
}));

router.get("/api/logout", passport.authenticate('basic', { session: false }), function(req, res) {
    req.logout();
    res.status(200).send("logout is successful");
});

router.post("/api/decks/create", passport.authenticate('basic', { session: false }), function(req, res){
    Deck.create({
        title: req.body.title,
        description: req.body.description,
        userId: req.body.user
    })
    .then(function(data){
        res.status(200).send("Deck successfull created.")
    })
})

router.get("/api/decks", passport.authenticate('basic', { session: false }), function(req, res){
    Deck.findAll({})
    .then(function(data){
        res.status(200).send(objectIt("success", "all decks found", data))
    })
})

router.get("/api/decks/view/:id", passport.authenticate('basic', { session: false }), function(req, res){
    let deckId = req.params.id;
    Deck.findOne({
        where: {id: deckId},
        include:[{model: Card, as: "Cards"}]
    })
    .then(function(deckData){
        console.log(deckData);
        Card.findAll({
            where: {deckId : deckId},
            order:[["updatedAt", "DESC"]]})
        .then(function(cardData){
            res.status(200).send(objectIt("success", "all cards in the deck", deckData))
        })
    })
})

router.put("/api/decks/cards/:id/edit", passport.authenticate('basic', { session: false }), function(req, res){
    let cardId = req.params.id;

        Card.update({
            front: req.body.front,
            back: req.body.back
        },{
            where: {id: cardId},
            include:[{model: "Decks"}]
        })
        .then(function(data){
            Card.findById(cardId)
            .then(function(card){
                res.status(200).send(objectIt("success", "card successfully edited", card))
                res.redirect("/api/decks/view/" + card.deckId )
            })
        })
})

router.delete("/api/decks/cards/:id/delete", passport.authenticate('basic', { session: false }), function(req, res){
    let cardId= req.params.id;

    Card.destroy({
        where: {
            id: cardId
        },
        include: [{
            model: Deck,
            as: "decks"
        }]
    })
    .then(function(data){
        console.log("data.Deck.id:       *****\n", data.Deck.id);
        console.log("Deck.id:      *******\n", Deck.id);
        res.status(200).send(objectIt("success", "number of cards destroyed", data))
        // res.redirect("/api/decks/view/"+ Deck.id)
    })
    .catch(function(err){
        res.status(500).send(objectIt("fail", "delete failed", err))
    })




})

router.post("/api/decks/cards/:id/create", passport.authenticate('basic', { session: false }), function(req, res){

    let deckId = req.params.id;

    Card.create({
        deckId: deckId,
        front: req.body.front,
        back: req.body.back
    })
    .then(function(data){
        res.status(200).send(objectIt("success", "card created", data))
        // res.redirect("/api/decks/view/" + deckId)
    })
    .catch(function(err){
        console.log(err);
        res.status(500).send(err)
    })

})

router.get("/api/decks/:deckId/quiz", passport.authenticate('basic', { session: false }), function(req, res){
    let deckId = req.params.deckId;

    Deck.findById(deckId)
    .then(function(theDeck){
        Card.findAll({
            where: {
                deckId: deckId
            }
        })
        .then(function(cards){
            // let cards = allCards;
            let length = cards.length;
            let shuffleSet = [];

            for (var i = 0; i < length; i++) {
                console.log("LENGTH OF CARDS DATA *****: ", cards.length);
                console.log("the length of \"LENGTH\": ", length);
                console.log("MATHFLOOR", Math.floor(Math.random()*cards.length));
                let splicedCard = (cards.splice(Math.floor(Math.random()*cards.length), 1)[0]);
                    shuffleSet.push(splicedCard)
                    console.log("THIS IS THE RANDOMLY SPLICED CARD: ", splicedCard);
            }

            let randomCard = cards[Math.floor(Math.random()*cards.length)];
            req.session.shuffleSet = shuffleSet;
            console.log("this is REQ.SESSION.SHUFFLEsET: ", req.session.shuffleSet);
            // res.render("quiz", {shuffle:shuffleSet})
            // res.send("works");
            res.status(200).send(objectIt("success", "cards found", shuffleSet))
        })
    })
})

router.get("/api/decks/:deckId/quiz/:cardIndex", passport.authenticate('basic', { session: false }), function(req,res) {

    if (req.session.shuffleSet.length === cardIndex) {
        req.session.score=0/0
        req.render("quizOver")
    } else {
        //game logic
    }
    res.send('card')
    // randomCard = (cards[Math.floor(Math.random()*cards.length)]);
})




module.exports = router;
