const interval = 15;
const maximum = {
    r: 255,
    g: 255,
    b: 150   
};
const count = {
    r: 1,
    g: maximum.g / interval,
    b: maximum.b / interval
};

export const colorSetting = Object.freeze({
    interval,
    maximum,
    count,
    total: count.r * (count.g + 1) * (count.b + 1)
});