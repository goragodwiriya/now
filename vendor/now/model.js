/**
 * แม่แบบ Model
 *
 * @param string className
 * @param object o
 */
Now.model = function(className, o) {
  var obj = new Object();
  /* ลงทะเบียน Class */
  Now.registerClass(obj, className, o);
};