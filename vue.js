class Vue {
  constructor(options) {
    this.$data = options.data;
    this.$el = options.el;

    // console.log(options);
    this._init();
  }

  _init() {
    new Observer(this.$data);
    new Compiler(this.$el, this);
  }
}
