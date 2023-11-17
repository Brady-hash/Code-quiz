var questions = [
    {
        question: "Commonly used data types DO NOT include:",
        choices: ["strings", "booleans", "alerts", "numbers"],
        answer: "alerts"
    },
    {
        question: "The condition in an if / else statement is enclosed within ____.",
        choices: ["quotes", "curly brackets", "parentheses", "square brackets"],
        answer: "parentheses"
    },
    {
        question: "Arrays in Javascript can be used to store ____.",
        choices: ["numbers and strings", "other arrays", "booleans", "all of the above"],
        answer: "all of the above"
    },
    {
        question: "String values must be enclosed within ____ when being assigned to variables.",
        choices: ["commas", "curly brackets", "quotes", "parenthesis"],
        answer: "quotes"
    },
    {
        question: "A very useful tool used during development and debugging for printing content to the debugger is:",
        choices: ["Javascript", "terminal / bash", "for loops", "console log"],
        answer: "console log"
    }
];

var startButtonEl = $('#start-btn');
var questionChoicesEl = $('.qChoices');
var questionEl = $('.questions');
var timerEl = $('#timer');
var pElement = $('.description');
var submitEl = $('#submit-btn');
var goBackEl = $('#back-btn');
var clearEl = $('#clear-btn');
var userInput = $('#inits');
var highScoresListEl = $('.highScoresList');

var timerCount;
var timer;
var currentQuestionIndex = 0;
var quizCompleted = false;
var scoreList = getScoreList();

function startQuiz() {
    timerCount = 100;
    setTimer();
    renderQuestion();
    startButtonEl.hide();
    pElement.text("").hide();
}

function setTimer() {
    timer = setInterval(function () {
        timerCount--;
        timerEl.text('Timer: ' + timerCount);

        if (timerCount <= 0) {
            clearInterval(timer);
            alert("Time's up! Restarting quiz...");
            setTimeout(function () {
                window.location.reload();
            }, 500);
        }
    }, 1000);
}

function renderQuestion() {
    var currentQuestion = questions[currentQuestionIndex];

    questionEl.text(currentQuestion.question);
    questionChoicesEl.empty();

    for (var i = 0; i < currentQuestion.choices.length; i++) {
        var choice = currentQuestion.choices[i];
        var li = $('<li class="qChoices">');
        var button = $('<button class="btn">');

        button.text(choice);
        questionChoicesEl.append(li);
        li.append(button);
    }

    questionChoicesEl.off().on('click', '.qChoices button', function () {
        if (quizCompleted) return;

        var selectedAnswer = $(this).text();

        if (selectedAnswer !== currentQuestion.answer) {
            timerCount -= 20;
        }

        currentQuestionIndex++;

        if (currentQuestionIndex < questions.length) {
            renderQuestion();
        } else {
            quizDone();
        }
    });
}

function quizDone() {
    quizCompleted = true;
    score = timerCount;
    clearInterval(timer);
    questionEl.text("Done");
    pElement.text("Your final score is " + score + "!");
    pElement.show();
    questionChoicesEl.empty();
    submitEl.show();
    userInput.append($('<div><label id="inits">Initials: </label><input type="text" id="inits"></div>'));
}

function highScoreLister() {
    questionEl.text("Highscores");
    submitEl.hide();
    pElement.hide();
    userInput.hide();
    goBackEl.show();
    clearEl.show();
    displayHighScores();
}

function displayHighScores() {
    highScoresListEl.empty();
    scoreList.sort((a, b) => b.score - a.score);

    scoreList.forEach(function (scoreItem) {
        var listItem = $('<li>');
        listItem.text(scoreItem.initials + ': ' + scoreItem.score);
        highScoresListEl.append(listItem);
    });
}

function getScoreList() {
    return JSON.parse(localStorage.getItem('scoreList')) || [];
}

function saveScoreList() {
    localStorage.setItem('scoreList', JSON.stringify(scoreList));
}

submitEl.on('click', function () {
    var initials = $('#inits input').val().trim();
    if (initials !== "") {
        var newScore = {
            initials: initials,
            score: timerCount
        };
        scoreList.push(newScore);
        saveScoreList();
        displayHighScores();
    }
});

clearEl.on('click', function () {
    localStorage.removeItem('scoreList');
    scoreList = [];
    highScoresListEl.empty();
});

startButtonEl.on('click', startQuiz);
submitEl.on('click', highScoreLister);
goBackEl.on('click', function () {
    location.reload();
});
