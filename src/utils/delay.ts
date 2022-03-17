export function delay(time: number) {
    let timer;
    clearTimeout(timer);
    return new Promise(resolve => {
        timer = setTimeout(() => {
            resolve(true);
        }, time);
    });
};