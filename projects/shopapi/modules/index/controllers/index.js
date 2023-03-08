Now.controller('Index/Index/Controller', {
  title: 'Shop API Demo - ตัวอย่างการแสดงรายการสินค้าด้วย API',
  /**
   * เมธอดสำหรับโหดหน้าเว็บ
   * @param object params
   */
  index: function(params) {
    var self = this;
    Now.Ajax.create({ method: 'get' }).send("https://oas.kotchasan.com/api.php/v1/product/products/" + (params.cat || Now.category_id) + "/" + (params.page || 1), "limit=20", function(xhr) {
      // แปลงข้อมูลตอบกลับเป็น JSON Object
      var ds = xhr.responseText.toJSON(),
        detail = "",
        item,
        col = 4,
        n = 0;
      if (ds) {
        document.title = ds.category || self.title;
        detail += "<h2>" + document.title + "</h2>";
        // วนลูปรายการ ds.items เพื่อแสดงรายการสินค้า โดยใช้ griid ในการแสดงผล
        detail += '<div class="document-list thumbview"><div class="row">';
        for (var i in ds.items) {
          if (n > 0 && n % col == 0) {
            detail += '</div><div class="row">';
          }
          item = ds.items[i];
          detail += '<article class="col' + col + '">';
          detail += '<a class="figure" href="index.html#module=view&amp;id=' + item.id + '">';
          detail += '<img class=nozoom src="' + item.image + '" alt="' + item.topic + '">';
          detail += "</a><div>";
          detail += '<h6><a href="index.html#module=view&amp;id=' + item.id + '">' + item.topic + "</a></h6>";
          detail += '<p class="price">' + item.price + " THB</p>";
          detail += "</div></article>";
          n++;
        }
        detail += "</div></div>";
        // ลิงค์รายการแบ่งหน้า (ถ้ามี)
        if (ds.totalpage > 0) {
          detail += '<footer class="splitpage">';
          for (i = 1; i <= ds.totalpage; i++) {
            if (i == ds.page) {
              detail += "<strong>" + i + "</strong>";
            } else {
              detail +=
                '<a href="index.html#cat=' + ds.category_id + '&amp;page=' + i + '" id="' + ds.category_id + "/" + i + '">' + i + '</a>';
            }
          }
          detail += "</footer>";
        }
        // แสดงผลข้อมูลลงใน #content
        $('#content').innerHTML = detail;

      }
    });
  }
});
