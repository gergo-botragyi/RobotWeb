let socket;
export const init = () => {
    const ip = 'http://192.168.0.1:5000/io';
    const man = new io.Manager(ip);
    socket = man.socket('/io', {});
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
};
export const stop = () => void socket.emit('stop');
export const sleep = (ms) => new Promise(res => setTimeout(res, ms));