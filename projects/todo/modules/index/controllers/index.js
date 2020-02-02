Now.controller('Index/Index/Controller', {
  index: function() {
    var tmp = this;
    include([
      'modules/index/models/index.js',
      'modules/index/views/index.js'
    ], function() {
      var todos = Now.getClass('Index/Index/Model').all();
      Now.getClass('Index/Index/View').updateView(todos);
      $('#new-todo').addEvent('keydown', function(e) {
        if (GEvent.keyCode(e) == 13) {
          if (this.value != '') {
            todos = Now.getClass('Index/Index/Model').insert(this.value);
            Now.getClass('Index/Index/View').updateView(todos);
            this.value = '';
          }
        }
      });
      $('#clear-completed').addEvent('click', function() {
        todos = Now.getClass('Index/Index/Model').clearComplete();
        Now.getClass('Index/Index/View').updateView(todos);
      });
      $('#toggle-all').addEvent('click', function() {
        todos = Now.getClass('Index/Index/Model').completed(this.checked);
        Now.getClass('Index/Index/View').updateView(todos);
      });
    });
  }
});