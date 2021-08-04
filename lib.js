const init = () => {
    const ip = 'http://192.168.0.1:5000/io';
    return new Promise(res => socket.on('connect', res));
};
const getSensorData = () => {
    socket.emit('tracksensor');
    return new Promise(res => socket.once('return-tracksensor', ({ data }) => res(data)));
};
const move = ({ left = 0, right = 0 } = {}) => {
    if (left < -100 || left > 100 || right < -100 || right > 100)
        throw `Values should be between -100 and 100`;
    socket.emit('move', { left, right });
};
const LED = ({ r = 0, g = 120, b = 180 } = {}) => {
    const min = Math.min(r, g, b), max = Math.max(r, g, b);
    if (min < 0 || max > 255)
        throw `Values should be between 0 and 255`;
    socket.emit('led', { r, g, b });
};
stop = () => void socket.emit('stop');
sleep = (ms) => new Promise(res => setTimeout(res, ms));
//# sourceMappingURL=lib.js.map