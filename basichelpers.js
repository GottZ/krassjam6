(function(){
  "use strict";
  window.body = document.body;

  window.ce = (tag, opts, opts2) => {
    const node = document.createElement(tag);

    if (!opts) return node;

    if (opts instanceof HTMLElement) {
      const parent = {parent: opts};
      opts = typeof opts2 == 'object' ? Object.assign(parent, opts2) : parent;
    }

    for (let key in opts) {
      if (key == "parent" || key == "style") continue;
      node[key] = opts[key];
    }

    if (opts.parent) {
      opts.parent.appendChild(node);
    }

    if (opts.style) {
      Object.keys(opts.style).map(key => node.style[key] = opts.style[key]);
    }

    return node;
  };

  window.ct = (text, parent) => {
    text = text.split(/(?:\r\n|\n)/);
    if (text.length == 1) {
      const n = document.createTextNode(text.shift());
      if (parent) parent.appendChild(n);
      return n;
    }
    let p;
    const nodes = [];
    const texts = [];
    while((p = text.shift()) !== undefined) {
      if (p !== "") {
        const t = document.createTextNode(p);
        nodes.push(t);
        texts.push(t);
      }
      if (text.length > 0) nodes.push(ce("br"));
    }
    if (parent) nodes.map(n => parent.appendChild(n));

    return texts.length > 1 ? texts : texts.shift();
  };

  window.hookProperty = o => {
    Object.defineProperty(o.obj, o.name, {
      get: o.get,
      set: o.set
    });
  };

})();

