import { Spaceship } from "./Spaceship.js";
import { Enemy } from "./Enemy.js";

class Game {
  #htmlElements = {
    Spaceship: document.querySelector("[data-spaceship]"),
    container: document.querySelector("[data-container]"),
    scores: document.querySelector("[data-score]"),
    lives: document.querySelector("[data-lives]"),
    modal: document.querySelector("[data-modal]"),
    scoreInfo: document.querySelector("[data-score-info]"),
    button: document.querySelector("[data-button]"),
  };
  #ship = new Spaceship(
    this.#htmlElements.Spaceship,
    this.#htmlElements.container
  );
  #enemys = [];
  #lives = null;
  #score = null;
  #enemysInterval = null;
  #checkPositionInterval = null;
  #createEnemyInterval = null;
  init() {
    this.#ship.init();
    this.#newGame();
    this.#htmlElements.button.addEventListener("click", () => {
      this.#newGame();
    });
  }

  #newGame() {
    this.#htmlElements.modal.classList.add("hide");
    this.#enemysInterval = 30;
    this.#lives = 3;
    this.#score = 0;
    this.#updateLivesText();
    this.#updateScoreText();
    this.#ship.element.style.left = "0px";
    this.#ship.setPosition();
    this.#createEnemyInterval = setInterval(() => this.#randomNewEnemy(), 1000);
    this.#checkPositionInterval = setInterval(() => this.#checkPosition(), 1);
  }
  #randomNewEnemy() {
    const randomNumber = Math.floor(Math.random() * 5) + 1;
    randomNumber % 5
      ? this.#createNewEnemy(
          this.#htmlElements.container,
          this.#enemysInterval,
          "enemy",
          "explosion"
        )
      : this.#createNewEnemy(
          this.#htmlElements.container,
          this.#enemysInterval * 2,
          "enemy--big",
          "explosion--big",
          3
        );
  }
  #createNewEnemy(...params) {
    const enemy = new Enemy(...params);
    enemy.init();
    this.#enemys.push(enemy);
  }
  #checkPosition() {
    this.#enemys.forEach((enemy, enemyIndex, enemiesArr) => {
      const enemyPositon = {
        top: enemy.element.offsetTop,
        right: enemy.element.offsetLeft + enemy.element.offsetWidth,
        bottom: enemy.element.offsetTop + enemy.element.offsetHeight,
        left: enemy.element.offsetLeft,
      };
      if (enemyPositon.top > window.innerHeight) {
        enemy.explode();
        enemiesArr.splice(enemyIndex, 1);
        this.#updateLives();
      }
      this.#ship.missiles.forEach((missile, missileIndex, missileArr) => {
        const missilePosition = {
          top: missile.element.offsetTop,
          right: missile.element.offsetLeft + missile.element.offsetWidth,
          bottom: missile.element.offsetTop + missile.element.offsetHeight,
          left: missile.element.offsetLeft,
        };
        if (
          missilePosition.bottom >= enemyPositon.top &&
          missilePosition.top <= enemyPositon.bottom &&
          missilePosition.right >= enemyPositon.left &&
          missilePosition.left <= enemyPositon.right
        ) {
          enemy.hit();
          if (!enemy.lives) {
            enemiesArr.splice(enemyIndex, 1);
          }
          missile.remove();
          missileArr.splice(missileIndex, 1);
          this.#updateScore();
        }
        if (missilePosition.bottom < 0) {
          missile.remove();
          missileArr.splice(missileIndex, 1);
        }
      });
    });
  }
  #updateScore() {
    this.#score++;
    if (!(this.#score % 5)) {
      this.#enemysInterval--;
    }

    this.#updateScoreText();
  }
  #updateLives() {
    this.#lives--;
    this.#updateLivesText();
    this.#htmlElements.container.classList.add("hit");
    setTimeout(() => this.#htmlElements.container.classList.remove("hit"), 100);
    if (!this.#lives) {
      this.#endGame();
    }
  }
  #updateScoreText() {
    this.#htmlElements.scores.textContent = `Score: ${this.#score}`;
  }
  #updateLivesText() {
    this.#htmlElements.lives.textContent = `Lives: ${this.#lives}`;
  }
  #endGame() {
    this.#htmlElements.modal.classList.remove("hide");
    this.#htmlElements.scoreInfo.textContent = `You lose! Your score is ${
      this.#score
    }`;
    this.#enemys.forEach((enemy) => enemy.explode());
    this.#enemys.length = 0;
    clearInterval(this.#createEnemyInterval);
    clearInterval(this.#checkPosition);
  }
}

window.onload = function () {
  const game = new Game();
  game.init();
};
