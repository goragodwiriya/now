Now.view('Index/Index/View', {
  updateView: function(todos) {
    var ul = $('#todo-list'),
      count = 0,
      remain = 0,
      tmp = this;
    ul.innerHTML = '';
    todos.forEach(function(item) {
      if (item.completed) {
        remain++;
      } else {
        count++;
      }
      tmp.renderItem(ul, item);
    });
    $('#todo-count strong').innerHTML = count;
    $('#clear-completed strong').innerHTML = remain;
    if (remain == 0) {
      $('#clear-completed').addClass('hidden');
    } else {
      $('#clear-completed').removeClass('hidden');
    }
    if (todos.length == 0) {
      $('#toggle-all').addClass('hidden');
    } else {
      $('#toggle-all').removeClass('hidden');
    }
  },
  renderItem: function(ul, item) {
    var tmp = this,
      li = ul.create('li', { id: item.id }),
      div = li.create('div', { className: 'view' });
    var _delete = function() {
      var node = $(this.parentNode.parentNode),
        model = Now.getClass('Index/Index/Model'),
        todos = model.delete(node.id);
      tmp.updateView(todos);
    };
    var _checked = function() {
      var node = $(this.parentNode.parentNode),
        model = Now.getClass('Index/Index/Model'),
        todos = model.update(node.id, { completed: this.checked });
      tmp.updateView(todos);
    };
    div.create('input', {
      type: 'checkbox',
      className: 'toggle',
      checked: item.completed
    }).addEvent('click', _checked);
    div.create('label', { innerHTML: item.title });
    div.create('button', { className: 'delete' }).addEvent('click', _delete);
  }
});