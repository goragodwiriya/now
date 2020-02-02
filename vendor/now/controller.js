/**
 * แม่แบบ Controller
 *
 * @param string className
 * @param object o
 */
Now.controller = function(className, o) {
  var obj = new Object();
  /* default Method */
  obj.index = emptyFunction;
  /* ลงทะเบียน Class */
  Now.registerClass(obj, className, o);
};