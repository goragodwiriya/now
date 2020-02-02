/**
 * แม่แบบ View
 *
 * @param string className
 * @param object o
 */
Now.view = function(className, o) {
  var obj = new Object();
  /* default Method */
  obj.render = emptyFunction;
  /* ลงทะเบียน Class */
  Now.registerClass(obj, className, o);
};