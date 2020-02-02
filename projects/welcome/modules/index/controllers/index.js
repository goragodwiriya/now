Now.controller('Index/Index/Controller', {
  title: 'Welcome Now.js',
  index: function() {
    document.title = this.title;
    createClass('Index/Index/View', function () {
      $('#content').innerHTML = this.render();
    });
  },
});
