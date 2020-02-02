Now.controller('Index/View/Controller', {
  title: 'Shop API Demo - ตัวอย่างการแสดงรายละเอียดสินค้าด้วย API',
  index: function(params) {
    Now.Ajax.create({ method: 'get' }).send("https://oas.kotchasan.com/api.php/product/" + params.id, null, function(xhr) {
      // แปลงข้อมูลตอบกลับเป็น JSON Object
      var ds = xhr.responseText.toJSON(),
        detail = "";
      if (ds) {
        document.title = ds.topic;
        detail += '<h2><a href="index.html#module=view&amp;id=' + ds.id + '">' + ds.topic + "</a></h2>";
        detail += '<div class="ggrid"><div class="float-left block6">';
        detail += '<img src="' + ds.image + '" alt="' + ds.topic + '">';
        detail += '</div><div class="float-left block6">';
        detail += "<h3>" + ds.topic + "</h3>";
        detail += "<h4>รหัสสินค้า : " + ds.product_no + "</h4>";
        detail += "<p>" + ds.description + "</p>";
        detail += "<p>ราคา <em>" + ds.price + "</em> บาท</p>";
        detail += "</div></div>";
        // แสดงผลข้อมูลลงใน #content
        $("#content").innerHTML = detail;
      }
    });
  },
});