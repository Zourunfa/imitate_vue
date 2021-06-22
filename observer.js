class Observer {
  constructor(data) {
    // console.log(data);
    this.observe(data);
  }

  observe(data) {
    if (typeof data === 'object') {
      for (let key of Object.keys(data)) {
        this.defineReactive(data, key, data[key]);
      }
    }
  }

  defineReactive(data, key, value) {
    // 实现递归
    this.observe(value);

    let dep = new Dep();
    Object.defineProperty(data, key, {
      get: () => {
        // console.log(`获取值${key}`);
        Dep.target && dep.addWatcher(Dep.target);
        return value;
      },
      set: (newValue) => {
        if (newValue !== value) {
          console.log(value);
          value = newValue;
        }
        // console.log(newValue);
        dep.notify();
      },
    });
  }
}

class Dep {
  constructor() {
    this.subs = [];
  }

  addWatcher(watcher) {
    // console.log(watcher);
    this.subs.push(watcher);
  }

  notify() {
    this.subs.forEach((watcher) => {
      // console.log(watcher);
      watcher.update();
    });
  }
}

class Watcher {
  constructor(expr, vm, cb) {
    this.vm = vm;
    this.expr = expr;
    this.cb = cb;

    this.oldVal = this.getSub(expr, vm);
  }

  getSub(expr, vm) {
    Dep.target = this;

    const value = compMidWare.getValue(expr, vm);
    // console.log(value);
    return value;
  }

  update() {
    const newVal = compMidWare.getValue(this.expr, this.vm);

    this.cb(newVal);
  }
}
