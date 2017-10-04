console.log("workinggggg");

let correctButton= document.getElementById("correctButton");
let incorrectButton= document.getElementById("incorrectButton");

let flashCards = document.getElementsByClassName("flipper")

let total = flashCards.length;

let score = 0

console.log(total);

correctButton.addEventLister('click', (event)=>{
    event.preventDefault();

})
