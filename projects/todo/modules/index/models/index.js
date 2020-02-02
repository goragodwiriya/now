Now.model('Index/Index/Model', {
  insert: function(value) {
    var item = {
      id: this.uuid(),
      title: value,
      completed: false
    };
    var todos = this.all();
    todos.push(item);
    this.save(todos);
    return todos;
  },
  all: function() {
    var store = localStorage.getItem('now_todo');
    return (store && JSON.parse(store)) || [];
  },
  delete: function(id) {
    var todos = [];
    this.all().forEach(function(item) {
      if (item.id !== id) {
        todos.push(item);
      }
    });
    this.save(todos);
    return todos;
  },
  save: function(todos) {
    localStorage.setItem('now_todo', JSON.stringify(todos));
  },
  update: function(id, datas) {
    var todos = [];
    this.all().forEach(function(item) {
      if (item.id === id) {
        for (var key in datas) {
          item[key] = datas[key];
        }
      }
      todos.push(item);
    });
    this.save(todos);
    return todos;
  },
  clearComplete: function() {
    var todos = [];
    this.all().forEach(function(item) {
      if (!item.completed) {
        todos.push(item);
      }
    });
    this.save(todos);
    return todos;
  },
  completed: function(val) {
    var todos = this.all();
    todos.forEach(function(item) {
      item.completed = val;
    });
    this.save(todos);
    return todos;
  },
  uuid: function(a, b) {
    for (b = a = ''; a++ < 36; b += a * 51 & 52 ? (a ^ 15 ? 8 ^ Math.random() * (a ^ 20 ? 16 : 4) : 4).toString(16) : '-');
    return b;
  },
});