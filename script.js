init()

let speed = 0;
let moving = false;

const up = document.getElementById("up");
const down = document.getElementById("down");
const left = document.getElementById("left");
const right = document.getElementById("right");

document.onkeydown=(event)=>{
    console.log(event.key)
    switch(event.key){
        case 'w':
            moving = true;
            changeSpeed(2);
            move({left:speed, right:speed});
            up.style.backgroundColor = 'seagreen';
        break
        case 'a':
            moving = true;
            changeSpeed(2);
            move({left:0,right:speed});
            left.style.backgroundColor = 'seagreen';
        break
        case 's':
            moving = true;
            changeSpeed(-2);
            move({left:speed, right:speed});
            down.style.backgroundColor = 'seagreen';
        break
        case 'd':
            moving = true;
            changeSpeed(2);
            move({left:speed,right:0});
            right.style.backgroundColor = 'seagreen';
        break
        case ' ':
            speed = 0;
            move();
        break
    }
}

function changeSpeed(s){
    const new_speed = speed+s;
    if(new_speed <= 100 && new_speed >= -100){
        speed=new_speed;
    }
    else if(new_speed > 100){
        speed = 100;
    }
    else{
        speed = -100;
    }
    console.log(speed);
}

document.onkeyup=(event)=>{
    moving = false;
    switch(event.key){
        case 'w':
            up.style.backgroundColor = 'lightseagreen';
        break;
        case 'a':
            left.style.backgroundColor = 'lightseagreen';
        break;
        case 's':
            down.style.backgroundColor = 'lightseagreen';
        break;
        case 'd':
            right.style.backgroundColor = 'lightseagreen';
        break;
    }
    setTimeout(()=>{
        if(!moving){
            speed=0;
            move();
            console.log('stop')   
        }
    },200)
}

document.getElementById("up").onmousedown(()=>{
    console.log("click");
})