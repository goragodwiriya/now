Now.view('Index/Index/View', {
  render: function () {
    var template = Now.Template.load('welcome');
    return template.render();
  }
});
