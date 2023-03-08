  Now.createWebApplication({
    init: function() {
      /* โหลดเมนู */
      Now.Ajax.create({ asynchronous: false, method: 'get' }).send('https://oas.kotchasan.com/api.php/v1/product/categories', null, function(xhr) {
        var ds = xhr.responseText.toJSON();
        if (ds) {
          var menu = $('#categorymenu'),
            li;
          for (var prop in ds) {
            /* global variable */
            Now.category_id = Now.category_id || ds[prop].category_id;
            /* create menu item */
            li = document.createElement('li');
            li.innerHTML = '<a href="index.html#cat=' + ds[prop].category_id + '"><span>' + ds[prop].topic + '</span></a>';
            menu.appendChild(li);
          }
        }
      });
    }
  });
