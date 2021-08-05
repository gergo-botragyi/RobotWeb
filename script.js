import { buzzer, init, LED, move } from "./lib.js";
try {
  init("192.168.0.1:5000");
} catch (err) {
  console.error(err);
  alert("failed to connect to the C.U.M. servers. try again laterx")
}

let speed = 50,
  moving = false;

const speedSlider = document.getElementById("speed"),
  controls = {
    up: {
      element: document.getElementById("up"),
      keys: ["arrowup", "w", "k"],
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
      color: "turquoise",
      onPress: () => {
        LED(Math.floor(Math.random()), Math.floor(Math.random()), Math.floor(Math.random()));
      }
    },
    horn: {
      element: document.getElementById("horn"),
      keys: ["e"],
      color: "turquoise",
      onPress: () => {
        buzzer({ ms: 1000 })
      },
      onStop: () => { }
    }
  };

speedSlider.onchange = () => setSpeed(speedSlider.value);

document.onkeydown = (event) => {
  console.log(event.key);

  const action = Object.values(controls).find((a) =>
    a.keys.includes(event.key.toLowerCase())
  );

  if ((moving && action.keys[0] !== " ") || !action) return;
  moving = true;

  action.onPress(event);
  action.element.style.backgroundColor = "seagreen";
};

document.onkeyup = (event) => {
  moving = false;

  const action = Object.values(controls).find((a) =>
    a.keys.includes(event.key.toLowerCase())
  );

  if (!action) return;

  action.element.style.backgroundColor = action.color || "lightseagreen";

  setTimeout(() => {
    if (!moving) {
      action.onStop?.() || move();
      console.log("stop");
    }
  }, 200);
};

Object.values(controls).forEach((a) => {
  const onDown = (e) => {
    e.preventDefault()
    moving = true
    a.onPress()
    a.element.style.backgroundColor = "seagreen";
    console.log("click");
  }
  a.element.onmousedown = onDown
  a.element.ontouchstart = onDown

  const onUp = () => {
    moving = false
    a.element.style.backgroundColor = "lightseagreen";
    setTimeout(() => {
      if (!moving) {
        move();
        console.log("stop");
      }
    }, 200);
  }
  a.element.onmouseup = onUp
  a.element.ontouchend = onUp
});

function setSpeed(s) {
  speed = s
  speedSlider.value = speed
}

document.onwheel = (event) => {
  if (event.deltaY < 0) setSpeed(speed + 5)
  else if (event.deltaY > 0) setSpeed(speed - 5)
}
