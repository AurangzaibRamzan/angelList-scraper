function rnd(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function delay(delayInms) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(2);
    }, delayInms);
  });
}

module.exports = {
  delay, rnd,
}