const theme = '„A simulation game where you trade resources to dominate the market.“';
const currency = '₭';
const currencyName = '₿ellebits';

ce('h2', body, {textContent: 'welcome to krassconomy!'})
ce('h3', body, {textContent: theme});

const buttonContainer = ce('div', body, {
  className: 'buttonContainer'
})

const game = {};

const nodes = {
  money: ce('div', body, {
    className: 'money'
  })
};

{
  let _money = 0.1;
  const node = ct('0', nodes.money);
  ct(` ${currencyName}`, nodes.money);

  hookProperty({
    obj: game,
    name: 'money',
    set: x => {
      _money = x;
      node.nodeValue = x.toFixed(2);
    },
    get: () => _money
  });
}

const buttons = [{
  name: 'Toilet Cleaning',
  basePrice: 0.1,
  gain: 0.05,
  exponent: 1.8
},{
  name: 'Dishwashing',
  basePrice: 5,
  gain: 1,
  exponent: 1.3
},{
  name: 'selling Lemonade',
  basePrice: 50,
  gain: 10,
  exponent: 1.2
},{
  name: 'Fence painting',
  basePrice: 120,
  gain: 25,
  exponent: 1.4
},{
  name: 'Lawn mowing',
  basePrice: 600,
  gain: 70,
  exponent: 1.3
},{
  name: 'washing seniors',
  basePrice: 1500,
  gain: 120,
  exponent: 1.01
},{
  name: 'selling Gas',
  basePrice: 4500,
  gain: 360,
  exponent: 1.4
},{
  name: 'IT Support',
  basePrice: 10000,
  gain: 1000,
  exponent: 1.9
},{
  name: 'Baking Cookies',
  basePrice: 50000,
  gain: 3500,
  exponent: 1.9
},{
  name: '₿ellebit Mining',
  basePrice: 200000,
  gain: 100000,
  exponent: 2.5
}];

const buttonProto = {
  calcPrice: function () {
    this.price = this.basePrice * Math.pow(this.exponent, this.count);
    this.priceText.nodeValue = this.price.toFixed(2);
    this.totalText.nodeValue = (this.gain * this.count).toFixed(2);
  },
  checkAffordable: function () {
    this.node.style.setProperty('--perc', `${Math.min(1, game.money / this.price) * 100}%`);
    this.affordable = game.money >= this.price;
  }
};

buttons.forEach(button => {
  Object.setPrototypeOf(button, buttonProto);

  const node = ce('div', buttonContainer, {
    className: 'button',
    onmousedown: e => {
      e.stopPropagation();
      e.preventDefault();
    }
  });

  button.node = node;

  ce('div', node, {className: 'name', textContent: button.name});

  let _count = 0;
  const countNode = ce('div', node, {
    className: 'count'
  });
  const countText = ct('0', countNode);

  const priceNode = ce('div', node, {className: 'price', textContent: 'Price: '});
  button.priceText = ct('', priceNode);
  ct(currency, priceNode);

  const totalNode = ce('div', node, {className: 'total', textContent: 'Total: '});
  button.totalText = ct('', totalNode);
  ct(currency, totalNode);

  ce('div', node, {className: 'gain', textContent: `gains: ${button.gain.toFixed(2)}${currency}`});

  hookProperty({
    obj: button,
    name: 'count',
    set: x => {
      _count = x;
      countText.nodeValue = x;
      button.calcPrice();
    },
    get: () => _count
  });
  button.calcPrice();

  let _affordable = false;
  hookProperty({
    obj: button,
    name: 'affordable',
    set: x => {
      x = !!x;
      if (_affordable == x) return;
      node.classList.toggle('affordable', x);
      _affordable = x;
    },
    get: () => _affordable
  });

  node.addEventListener('click', e => {
    if (button.price <= game.money) {
      game.money -= button.price;
      button.count++;
    }
  });
});




let _then = 0;

const loop = (t) => {
  requestAnimationFrame(loop);
  const diff = t - _then;
  _then = t;
  const factor = diff / 1000;

  let gain = 0;
  buttons.forEach(button => {
    gain += button.count * button.gain;
  });

  game.money += gain * factor;

  buttons.forEach(button => {
    button.checkAffordable();
  });
}

requestAnimationFrame(loop);
