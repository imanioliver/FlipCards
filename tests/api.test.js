const request = require("supertest");
const app = require("../server.js")
//two key words. describe: describes what the test is doing, and test, is a callback function with all the testing and expectations in it

describe("GET /entry", function(){
    test("should render successfully", function(){
        return request(app)
            .get("/entry") //here you show what kind of request you're making and on what endpoint
            .expect(200);//status message you expect
    });
});

describe("GET /api/decks", function(){
    test("should retrieve all decks successfully", function(){
        return request(app)
            .get("/api/bro") //here you show what kind of request you're making and on what endpoint
            .expect(200)//status message you expect
            .then(function(res){
                expect(res.body).toHaveProperty("id");
                expect(res.body).toHaveProperty("deckId");
            });
    });
});



router.get("/api/decks", passport.authenticate('basic', { session: false }), function(req, res){
    Deck.findAll({})
    .then(function(data){
        res.status(200).send(objectIt("success", "all decks found", data))
    })
})
