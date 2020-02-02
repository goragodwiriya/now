(function () {
  Now.Template = {
    load: function (module, name) {
      if (name) {
        url = Now.skin + '/' + module + '/' + name + '.html';
      } else {
        url = Now.skin + '/' + module + '.html';
      }
      var req = Now.Ajax.create({method: 'get', asynchronous: false});
      req.send(url, null);
      this.content = req.responseText;
      return this;
    },
    render: function () {
      return this.content;
    }
  };
}).call(this);
