import { Missile } from "./Missile.js";

export class Spaceship {
  missiles = [];
  leftArrow = false;
  rightArrow = false;
  constructor(element, container) {
    this.element = element;
    this.container = container;
  }

  init() {
    this.#setPosition();
    this.#eventListeners();
    this.#gameLoop();
  }

  #setPosition() {
    this.element.style.bottom = "0px";
    this.element.style.left = `${
      window.innerWidth / 2 - this.#getPosition()
    }px`;
  }
  #getPosition() {
    return this.element.offsetLeft + this.element.offsetWidth / 2;
  }
  #eventListeners() {
    window.addEventListener("keydown", ({ keyCode }) => {
      if (keyCode === 37 || keyCode === 65) {
        this.leftArrow = true;
      } else if (keyCode === 39 || keyCode === 68) {
        this.rightArrow = true;
      }
    });
    window.addEventListener("keyup", ({ keyCode }) => {
      switch (keyCode) {
        case 32:
          this.#shot();
          break;
      }
      if (keyCode === 37 || keyCode === 65) {
        this.leftArrow = false;
      } else if (keyCode === 39 || keyCode === 68) {
        this.rightArrow = false;
      }
    });
  }
  #gameLoop = () => {
    this.#whatKey();
    requestAnimationFrame(this.#gameLoop);
  };
  #whatKey() {
    if (this.leftArrow && this.#getPosition() > 0) {
      this.element.style.left = `${
        parseInt(this.element.style.left, 10) - 10
      }px`;
    }
    if (this.rightArrow && this.#getPosition() < window.innerWidth) {
      this.element.style.left = `${
        parseInt(this.element.style.left, 10) + 10
      }px`;
    }
  }
  #shot() {
    const missile = new Missile(
      this.#getPosition(),
      this.element.offsetTop,
      this.container
    );
    missile.init();
    this.missiles.push(missile);
  }
}
