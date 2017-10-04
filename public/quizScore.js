console.log("workinggggg");

let correctButton= document.getElementById("correctButton");
let incorrectButton= document.getElementById("incorrectButton");
let scoreDisplay= document.getElementById("scoreDisplay");
let flashCards = document.getElementsByClassName("flashCards");
let quizComplete = document.getElementById('quizComplete');
let total = flashCards.length;

let score = 0
let attempts=0
console.log("score: ", score);

console.log("total: ", total);
console.log("attempts: ", attempts);


//
// if(attempts!== 0 &&  ){
//
// }


correctButton.addEventListener('click', (event)=>{
    event.preventDefault();

    if (attempts != total){
        score++;
        attempts++;
        scoreDisplay.innerHTML = `Your Score: ${score}/${total}`

    }
    else {
        alert(scoreDisplay.innerHTML = `Your FINAL Score: ${score}/${total}`)


    }

    console.log("score after increment: ", score);
    console.log("attempts after increment: ", attempts);

})

incorrectButton.addEventListener('click', (event)=>{
    event.preventDefault();

    if (attempts != total){
        attempts++;
        scoreDisplay.innerHTML = `Your Score: ${score}/${total}`
    }
    else{
        alert(scoreDisplay.innerHTML = `QUIZ FINISHED! Your FINAL Score: ${score}/${total}`)
    }
    console.log("score after decrement: ", score);
    console.log("attempts after decrement: ", attempts);

})
// scoreDisplay.innerHTML+=`<diYour Score: ${score}/${total}</div>`

if (attempts!==0 && attempts===score){
    quizComplete.innerHTML+=`your FINAL score!`
}
