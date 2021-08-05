// this code talks to the robot
// https://github.com/Kris030/roblib

let socket;
export const init = (ip) => {
    const man = new io.Manager(ip);
    socket = man.socket('/io', {});
    socket.on('connect', () => {
        console.log('Connected!');
    });
    return new Promise(res => socket.on('connect', res));
};
export const getSensorData = () => {
    socket.emit('tracksensor');
    return new Promise(res => socket.once('return-tracksensor', ({ data }) => res(data)));
};
export const move = ({ left = 0, right = 0 } = {}) => {
    if (left < -100 || left > 100 || right < -100 || right > 100)
        throw `Values should be between -100 and 100`;
    socket.emit('move', { left, right });
};
export const LED = ({ r = 0, g = 120, b = 180 } = {}) => {
    const min = Math.min(r, g, b), max = Math.max(r, g, b);
    if (min < 0 || max > 255)
        throw `Values should be between 0 and 255`;
    socket.emit('led', { r, g, b });
    console.log({ r, g, b });
};
export const stop = () => void socket.emit('stop');
export const sleep = (ms) => new Promise(res => setTimeout(res, ms));
export const exit = (stops = false) => {
    if (stops)
        stop();
    close();
};
export const buzzer = ({ pw = 0, ms = 0 } = {}) => {
    socket.emit('buzzer', { pw, ms });
    console.log({ pw, ms })
}