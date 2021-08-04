init();

let speed = 0,
  moving = false;

const speedSlider = document.getElementById("speed"),
  controls = {
    up: {
      element: document.getElementById("up"),
      keys: ["arrowup", "w"],
      onPress: (e) => {
        move({ left: speed, right: speed });
      },
    },
    down: {
      element: document.getElementById("down"),
      keys: ["arrowdown", "s"],
      onPress: () => {
        move({ left: speed, right: speed });
      },
    },
    left: {
      element: document.getElementById("left"),
      keys: ["arrowleft", "a"],
      onPress: () => {
        move({ left: 0, right: speed });
      },
    },
    right: {
      element: document.getElementById("right"),
      keys: ["arrowright", "d"],
      onPress: () => {
        move({ left: speed, right: 0 });
      },
    },
    break: {
      element: document.getElementById("handbreak"),
      keys: [" "],
      onPress: () => {
        move();
      },
    },
  };

speedSlider.onchange = () => (speed = speedSlider.value);

document.onkeydown = (event) => {
  console.log(event.key);

  const action = Object.values(controls).find((a) =>
    a.keys.includes(event.key.toLowerCase())
  );

  if (!action) return;

  action.onPress(event);
  action.element.style.backgroundColor = "seagreen";
};

document.onkeyup = (event) => {
  moving = false;

  const action = Object.values(controls).find((a) =>
    a.keys.includes(event.key.toLowerCase())
  );

  if (!action) return;

  action.element.style.backgroundColor = "lightseagreen";

  setTimeout(() => {
    if (!moving) {
      move();
      console.log("stop");
    }
  }, 200);
};

Object.values(controls).forEach((a) => {
  let t;

  const repeat = () => {
    console.log("click");
    a.onPress();
    t = setTimeout(() => repeat, 30);
  };

  a.element.onmousedown = () => repeat();

  a.element.onmouseup = () => clearTimeout(t);
});
