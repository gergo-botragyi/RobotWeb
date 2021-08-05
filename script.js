import confetti from "./confetti.mjs";
import { buzzer, init, LED, move } from "./lib.js";

// connect to server
try {
  init("192.168.0.1:5000");
} catch (err) {
  console.error(err);
  alert("failed to connect to the C.U.M. servers. try again later");
}

let speed = 50,
  moving = false;

const speedSlider = document.getElementById("speed"),
  // define the controls on the site.
  controls = {
    up: {
      element: document.getElementById("up"), // clickable html element
      keys: ["arrowup", "w", "k"], // keyboard shortcuts
      // function to run
      onPress: (e) => {
        move({ left: speed, right: speed });
      },
    },
    down: {
      element: document.getElementById("down"),
      keys: ["arrowdown", "s", "j"],
      onPress: () => {
        move({ left: speed * -1, right: speed * -1 });
      },
    },
    left: {
      element: document.getElementById("left"),
      keys: ["arrowleft", "a", "h"],
      onPress: () => {
        move({ left: speed * -1, right: speed });
      },
    },
    right: {
      element: document.getElementById("right"),
      keys: ["arrowright", "d", "l"],
      onPress: () => {
        move({ left: speed, right: speed * -1 });
      },
    },
    break: {
      element: document.getElementById("handbreak"),
      keys: [" "],
      onPress: () => {
        move();
      },
    },
    LEDs: {
      element: document.getElementById("leds"),
      keys: ["q"],
      color: "turquoise", // button background color
      onPress: () => {
        const led = {
          r: !!Math.round(Math.random()),
          g: !!Math.round(Math.random()),
          b: !!Math.round(Math.random()),
        };
        console.log(led);
        LED(led);
      },
    },
    horn: {
      element: document.getElementById("horn"),
      keys: ["e"],
      color: "turquoise",
      onPress: () => {
        buzzer(25);
      },
      // function to run when released
      onStop: () => {
        buzzer();
        console.log("buzzer stopped");
      },
    },
  };

speedSlider.onchange = () => setSpeed(speedSlider.value);

// KEYBOARD CONTROLS

// a key was pressed
document.onkeydown = (event) => {
  console.log(event.key);

  // decide what to do based on what key was pressed
  const action = Object.values(controls).find((a) =>
    a.keys.includes(event.key.toLowerCase())
  );

  // dont move it already moving
  if ((moving && action.keys[0] !== " ") || !action) return;
  moving = true;

  action.onPress(event);
  action.element.style.backgroundColor = "seagreen";
};

// a key was released
document.onkeyup = (event) => {
  moving = false;

  const action = Object.values(controls).find((a) =>
    a.keys.includes(event.key.toLowerCase())
  );

  if (!action) return;

  action.element.style.backgroundColor = action.color || "lightseagreen";

  // stop the robot after 200ms
  setTimeout(() => {
    if (!moving) {
      action.onStop?.() || move();
      console.log("stop");
    }
  }, 200);
};

// MOUSE AND TOUCH CONTROLS
Object.values(controls).forEach((a) => {
  const onDown = (e) => {
    e.preventDefault();
    moving = true;
    a.onPress();
    a.element.style.backgroundColor = "seagreen";
    console.log("click");
  };
  a.element.onmousedown = onDown;
  a.element.ontouchstart = onDown;

  const onUp = () => {
    moving = false;
    a.element.style.backgroundColor = a.color || "lightseagreen";
    setTimeout(() => {
      if (!moving) {
        a.onStop?.() || move();
        console.log("stop");
      }
    }, 200);
  };
  a.element.onmouseup = onUp;
  a.element.ontouchend = onUp;
});

// set the slider when the speed changes
function setSpeed(s) {
  speed = s;
  speedSlider.value = speed;
}
// change speed with the mouse wheel
document.onwheel = (event) => {
  if (event.deltaY < 0) setSpeed(speed + 5);
  else if (event.deltaY > 0) setSpeed(speed - 5);
};

// EASTER EGG 🥛🎉😳
let confettiLvl = 0;
const confettiElements = Array.from(document.querySelectorAll(".red")).sort(
  (x) => x.id
),
  confettiActions = [
    () => {
      console.log({ cumLvl: confettiLvl });
      confettiLvl === 0 && confettiLvl++;
    },
    () => {
      console.log({ cumLvl: confettiLvl });
      confettiLvl === 1 ? confettiLvl++ : (confettiLvl = 0);
    },
    async () => {
      console.log({ cumLvl: confettiLvl });
      if (confettiLvl === 2) {
        confettiLvl++;

        const end = Date.now() + 5 * 1000,
          colors = ["#18b6d6", "#46b31b"];

        await (async function frame() {
          const p1 = confetti({
            particleCount: 2,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors,
          }),
            p2 = confetti({
              particleCount: 2,
              angle: 120,
              spread: 55,
              origin: { x: 1 },
              colors,
            });

          if (Date.now() < end) {
            requestAnimationFrame(frame);
          }

          return Promise.all([p1, p2]);
        })();
      }
      confettiLvl = 0;
    },
  ];

confettiElements.forEach((c, i) => (c.onclick = confettiActions[i]));
