class Compiler {
  constructor(el, vm) {
    this.el = document.querySelector(el);
    this.vm = vm;

    const fragment = this.createFragment(this.el);
    // console.log(this.el);
    this.compile(fragment);

    this.el.appendChild(fragment);
  }

  createFragment(el) {
    const fragment = document.createDocumentFragment();

    let firstChild;
    while ((firstChild = el.firstChild)) {
      fragment.appendChild(firstChild);
    }

    return fragment;
  }

  compile(fragment) {
    const childNodes = fragment.childNodes;
    // console.log(childNodes);
    [...childNodes].forEach((node) => {
      if (node.nodeType === 1) {
        this.compileNode(node);
      } else {
        this.compileText(node);
      }

      node.childNodes && this.compile(node);
    });
  }

  compileNode(node) {
    // console.log(node);
    const attributes = node.attributes;
    // console.log(attributes);
    [...attributes].forEach((attr) => {
      // console.log(attr);
      const { name, value } = attr;
      // console.log(name, value);
      // 's'.startsWith
      const expr = value;
      if (name.startsWith('v-')) {
        const orderName = name.split('-')[1];
        // console.log(orderName);
        compMidWare[orderName](expr, node, this.vm);
      }

      //
    });
  }

  compileText(node) {
    const text = node.textContent;
    // console.log(text);
    if (/\{\{(.+?)\}\}/.test(text)) {
      // console.log(node);
      const expr = text.replace(/\{\{(.+?)\}\}/, (...args) => {
        // console.log(args);
        return args[1];
      });

      // console.log(expr);
      console.log(expr);
      compMidWare['text'](expr, node, this.vm);
    }
  }
}

const compMidWare = {
  getValue(expr, vm) {
    return expr.split('.').reduce((pres, cur) => {
      return pres[cur];
    }, vm.$data);
  },

  html(expr, node, vm) {
    // console.log(expr, node, vm);

    const value = this.getValue(expr, vm);
    // console.log(value);
    new Watcher(expr, vm, (newValue) => {
      // console.log(newValue);
      this.toView.htmlToView(node, newValue);
    });

    this.toView.htmlToView(node, value);
  },
  text(expr, node, vm) {
    // console.log(expr, node, vm);
    // console.log(expr);
    const value = this.getValue(expr, vm);
    // console.log(value);
    new Watcher(expr, vm, (newValue) => {
      // console.log(newValue);
      this.toView.textToView(node, newValue);
    });
    this.toView.textToView(node, value);
  },
  on() {},
  model() {},
  toView: {
    htmlToView(node, value) {
      node.innerHTML = value;
    },
    textToView(node, value) {
      node.textContent = value;
    },
  },
};
