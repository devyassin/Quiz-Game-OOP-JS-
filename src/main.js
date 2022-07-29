//selected elements
const count = document.querySelector(".count span");
const spans = document.querySelector(".spans");
const quizArea = document.querySelector(".quiz-area");
const answersArea = document.querySelector(".answers-area");
const submitQuestion = document.querySelector(".submit-button");
const results = document.querySelector(".results");

class App {
  #questionsCount;
  #data;
  #currentIndex = 0;
  #rightQuestions = [];
  #numberOfRightAnswers = 0;
  // TIME = 2;
  constructor() {
    this.getQuestions();
    this._submitQuestions();
    this._timer(2);
  }

  async getQuestions() {
    try {
      const res = await fetch("../question.json");
      this.#data = await res.json();
      this.#questionsCount = this.#data.length;
      this._creatBullets(this.#questionsCount);
      this._addQuestionData(this.#data[this.#currentIndex]);
      // this._timer(1);
    } catch (err) {
      console.log(err);
    }
  }

  _creatBullets(num) {
    count.innerHTML = num;
    let spanArr = [];
    for (let index = 0; index < num; index++) {
      spanArr.push(`<span ${index === 0 ? 'class="on"' : ""} ></span>`);
    }
    spans.insertAdjacentHTML("afterbegin", spanArr.join(""));
  }

  _addQuestionData(obj) {
    this.#rightQuestions.push(obj.right_answer);
    let bigArr = Object.values(obj.answers);
    const quizMarkup = `<h2>${obj.title}</h2>`;
    quizArea.insertAdjacentHTML("afterbegin", quizMarkup);
    const answersMarkup = bigArr
      .map((answer, i) => {
        return `
    <div class="answer">
          <input type="radio" id="answer_${
            i + 1
          }" name="questions" data-answer="answer_${i + 1}" ${
          i + 1 === 1 ? "checked" : ""
        }/>
          <label for="answer_${i + 1}">${answer}</label>
    </div>`;
      })
      .join("");

    answersArea.insertAdjacentHTML("afterbegin", answersMarkup);
  }

  _chosenAnswer() {
    let answersHTML = document.getElementsByName("questions");
    let chosenAnswer;
    for (let i = 0; i < answersHTML.length; i++) {
      if (answersHTML[i].checked) {
        chosenAnswer = answersHTML[i].dataset.answer;
      }
    }
    return chosenAnswer;
  }

  _checkAnsewer(right_answer, chosenAnswer) {
    const trueAnswer = Object.keys(this.#data[this.#currentIndex].answers).find(
      (key) => this.#data[this.#currentIndex].answers[key] === right_answer
    );

    if (trueAnswer === chosenAnswer) {
      this.#numberOfRightAnswers++;
      const divRightAnswer = document
        .getElementById(`${trueAnswer}`)
        .closest(".answer");
      divRightAnswer.style.backgroundColor = "	#00FF00";
    } else {
      const divRightAnswer = document
        .getElementById(`${trueAnswer}`)
        .closest(".answer");
      divRightAnswer.style.backgroundColor = "	#00FF00";
      const divChosenAnswer = document
        .getElementById(`${chosenAnswer}`)
        .closest(".answer");
      divChosenAnswer.style.backgroundColor = "	#FF6347";
    }
  }
  _submitQuestions() {
    submitQuestion.addEventListener("click", (e) => {
      let userAnswer = this._chosenAnswer();

      this._checkAnsewer(this.#rightQuestions[this.#currentIndex], userAnswer);

      if (this.#currentIndex === this.#questionsCount - 1) {
        this._renderResult();
        return;
      }

      setTimeout(() => {
        quizArea.innerHTML = "";
        answersArea.innerHTML = "";
        this.#currentIndex++;

        spans
          .querySelectorAll("span")
          .forEach((span) => span.classList.remove("on"));

        spans.querySelectorAll("span").forEach((span, i) => {
          if (i === this.#currentIndex) {
            span.classList.add("on");
          }
        });

        this._addQuestionData(this.#data[this.#currentIndex]);
      }, 1000);
    });
  }

  _renderResult() {
    let grade;
    if (this.#numberOfRightAnswers <= 3) {
      grade = "bad";
    } else if (
      this.#numberOfRightAnswers > 3 &&
      this.#numberOfRightAnswers <= 7
    ) {
      grade = "good";
    } else {
      grade = "perfect";
    }
    const resultMarkup = `
  <span class="${grade}">${grade} </span>You Answered ${
      this.#numberOfRightAnswers
    } from ${this.#questionsCount} `;
    results.insertAdjacentHTML("afterbegin", resultMarkup);
  }

  _timer(timeInMins) {
    const result = document.querySelector(".countdown");

    let time = 60 * timeInMins;
    let currIndex = this.#currentIndex;
    let questionCount = this.#questionsCount;
    setInterval(function () {
      let minutes = Math.floor(time / 60);
      let seconds = time % 60;

      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;
      result.innerHTML = `${minutes}:${seconds}`;
      if (currIndex === questionCount - 1) return;
      time--;
    }, 1000);
  }
}

const HTMLQuiz = new App();
