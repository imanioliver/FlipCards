const express           = require("express");
const router            = express.Router();
const bcrypt            = require("bcrypt");
const User              = require("../models/index").User;
const Deck              = require("../models/index").Deck;
const Card              = require("../models/index").Card;

const passport = require('passport');

const isAuthenticated = function (req, res, next) {
    console.log(req.isAuthenticated());
    if (req.isAuthenticated()) {
        return next()
    }
    req.flash('error', 'You have to be logged in to access the page.')
    res.redirect('/entry')
};

router.get("/", isAuthenticated, function(req, res) {
    User.findAll({})
    .then(function(data) {
        res.render("index")
    })
    .catch(function(err) {
        console.log(err);
        res.send("error")
    });
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/decks',
    failureRedirect: '/entry',
    failureFlash: true
}));

router.get("/entry", function(req, res) {
    res.render("entry");
});

router.post("/signup", function(req, res) {
    let name = req.body.name
    let username = req.body.username
    let password = req.body.passwordHash


    if (!username || !password) {
        req.flash('error', "Please, fill in all the fields.")
        res.redirect('/entry')
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
    .then(function() {
        res.redirect('/')})
    .catch(function(error) {
        req.flash('error', "Please, choose a different username.")
        res.redirect('/entry')
    });

});

router.post('/', passport.authenticate('local', {
    successRedirect: '/decks',
    failureRedirect: '/',
    failureFlash: true
}));

router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
});

router.post("/decks/create", function(req, res){
    Deck.create({
        title: req.body.title,
        description: req.body.description,
        userId: req.body.user
    })
    .then(function(data){
        res.redirect("/decks")
    })
})

router.get("/decks", isAuthenticated, function(req, res){
    Deck.findAll({})
    .then(function(data){
        res.render("index", {data:data})
    })
})

router.get("/decks/view/:id", isAuthenticated, function(req, res){
    let deckId = req.params.id;

    Deck.findOne({
        where: {
            id: deckId
        },
        include:[
            {
                model: Card,
                as: "Cards"
            }
        ]
    })
    .then(function(deckData){
        console.log(deckData);
        Card.findAll({

            where: {
                deckId : deckId
            },
            // include: [
            //     {model:"Decks"}
            // ],
            order:[["updatedAt", "DESC"]]})
        .then(function(cardData){
            res.render("deck", {oneDeck:deckData, allCards:cardData})
        })
    })
})


router.post("/decks/cards/:id/edit", function(req, res){

    let cardId = req.params.id;


        Card.update({
            front: req.body.front,
            back: req.body.back
        },{
            where: {
                id: cardId
            },
            include:[{
                model: "Decks",
            }]
        })
        .then(function(data){
            Card.findById(cardId)
            .then(function(card){
                res.redirect("/decks/view/" + card.deckId )
            })
        })


})


router.post("/decks/cards/:id/create", function(req, res){

    let deckId = req.params.id;

    Card.create({
        deckId: deckId,
        front: req.body.front,
        back: req.body.back
    })
    .then(function(data){
        res.redirect("/decks/view/" + deckId)
    })
    .catch(function(err){
        console.log(err);
        res.send(err)
    })

})


router.get("/decks/:deckId/quiz", function(req, res){
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

            let shuffleSet = [];

            for (var i = 0; i < cards.length; i++) {

                let splicedCard = cards.splice(Math.floor(Math.random()*cards.length), 1)[0]);
                    shuffleSet.push(splicedCard)
                    console.log(splicedCard);
            }

            let randomCard = cards[Math.floor(Math.random()*cards.length)];
            res.send("works");
            // res.redirect("/decks/"+ deckId+"/quiz/" + randomCard.id)
        })
    })
})

router.get("/decks/:deckId/quiz/:cardId", function(req,res) {
    console.log(req.quiz);
    res.send('card')
    // randomCard = (cards[Math.floor(Math.random()*cards.length)]);
})




module.exports = router;
