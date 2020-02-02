(function() {
  /**
   * ฟังก์ชั่นคืนค่า URL ของสคริปต์ที่กำลังทำงานอยู่
   *
   * @returns {string}
   */
  function getCurrentScript() {
    if (document.currentScript) {
      return document.currentScript.src;
    } else {
      var scripts = document.getElementsByTagName('script'),
        script = scripts[scripts.length - 1];
      if (script.getAttribute.length !== 'undefined') {
        return script.src;
      } else {
        return script.getAttribute('src', -1);
      }
    }
  }
  /* URL ของเว็บไซต์ */
  window.WEB_URL = getCurrentScript().replace('vendor/now/now.js', '');
  window.emptyFunction = function() {};
  window.returnFunction = function() {
    return true;
  };

  /**
   * เมธอดสำหรับการสร้างคลาส
   * โหลดคลาสสำเร็จ ทำงานต่อใน callBack
   *
   * @param {string} className
   * @param {function} callBack
   */
  window.createClass = function(className, callBack) {
    var cls = className.toLowerCase().replace(/[^a-z\/]{1,}/g, '').split('/');
    include('modules/' + cls[0] + '/' + cls[2] + 's/' + cls[1] + '.js', function() {
      if (Object.isFunction(callBack)) {
        callBack.call(Now[className]);
      }
    });
  };
  /**
   * Now base Class
   */
  var Now = this.Now = {},
    HINSTANCE = this;

  Now.version = "beta";
  /**
   * คอนโทรเลอร์หลักสำหรับการเรียกใช้งานในครั้งแรก
   */
  Now.defaultController = 'Index/Index/Controller';
  /**
   * ในกรณีที่ไม่มีการระบุ เมธอด จะเรียกมาที่เมธอดนี้
   */
  Now.defaultMethod = 'index';
  /**
   * ไดเร็คทอรี่เก็บ template
   */
  Now.skin = 'skin';
  /**
   * ตรวจสอบว่าเป็น Object หรือไม่
   * คืนค่า true ถ้าเป็น Object
   *
   * @returns {boolean}
   */
  Object.isObject = function(o) {
    return typeof o == "object";
  };
  /**
   * ตรวจสอบว่าเป็น Function หรือไม่
   * คืนค่า true ถ้าเป็น Function
   *
   * @returns {boolean}
   */
  Object.isFunction = function(o) {
    return typeof o == "function";
  };
  /**
   * ตรวจสอบว่าเป็น String หรือไม่
   * คืนค่า true ถ้าเป็น String
   *
   * @returns {boolean}
   */
  Object.isString = function(o) {
    return typeof o == "string";
  };
  /**
   * ตรวจสอบว่าเป็น Number หรือไม่
   * คืนค่า true ถ้าเป็น Number
   *
   * @returns {boolean}
   */
  Object.isNumber = function(o) {
    return typeof o == "number";
  };
  /**
   * ตรวจสอบว่าเป็น Null หรือไม่
   * คืนค่า true ถ้าเป็น Null
   *
   * @returns {boolean}
   */
  Object.isNull = function(o) {
    return o === null;
  };
  /**
   * ตรวจสอบว่าเป็น undefined หรือไม่
   * คืนค่า true ถ้าไม่ได้เป็น undefined
   *
   * @returns {boolean}
   */
  Object.defined = function(o) {
    return typeof o != "undefined";
  };
  /**
   * ตรวจสอบว่าเป็น Object ว่างหรือไม่
   * คืนค่า true ถ้าว่าง
   *
   * @returns {boolean}
   */
  Object.isEmpty = function(o) {
    for (var key in o) {
      if (obj.hasOwnProperty(key)) return false;
    }
    return true;
  };
  /**
   * แปลง Object เป็น Array
   *
   * @returns {Array}
   */
  Object.toArray = function(o) {
    var prop,
      result = [];
    for (prop in o) {
      result.push(o[prop]);
    }
    return result;
  };
  var queue = {};
  /**
   * เมธอดสำหรับโหลดไฟล์ Javascript ไว้ที่ส่วน head
   *
   * @param {sting[]} files URL ของไฟล์ Javascript ที่ต้องการ
   * @param {function} callBack ฟังก์ชั่นเรียกเมื่อโหลดสำเร็จ
   */
  window.include = function(files, callBack) {
    function _include(id) {
      var js = document.createElement('script');
      js.type = 'text/javascript';
      js.src = queue[id];
      js.async = false;
      js.defer = false;
      if (js.readyState) {
        js.onreadystatechange = function() {
          if (this.readyState === 'loaded' || this.readyState === 'complete') {
            queue[id] = true;
          }
        };
      } else {
        js.onload = function() {
          queue[id] = true;
        };
      }
      document.getElementsByTagName('head')[0].appendChild(js);
    }
    if (Array.isArray(files)) {
      for (var i = 0; i < files.length; i++) {
        queue[files[i]] = files[i];
      }
    } else {
      queue[files] = files;
    }
    for (var id in queue) {
      if (queue[id] !== true) {
        _include(id);
      }
    }
    var _doTimer = function() {
      for (var id in queue) {
        if (queue[id] !== true) {
          window.setTimeout(_doTimer, 0);
          return;
        }
      }
      if (Object.isFunction(callBack)) {
        callBack(this);
      }
    };
    window.setTimeout(_doTimer, 0);
  };

  /**
   * เมธอดสำหรับลงทะเบียนคลาส
   *
   * @param {object} obj
   * @param {string} className
   * @param {object} properties
   */
  Now.registerClass = function(obj, className, properties) {
    for (var prop in properties) {
      obj[prop] = properties[prop];
    }
    obj.className = className;
    Now[className] = obj;
  };

  /**
   * เมธอดคืนค่า Object ของคลาส
   *
   * @param {string} className
   *
   * @returns {object}
   */
  Now.getClass = function(className) {
    return Now[className];
  };
  /**
   * เริ่มต้นทำงาน Application
   * เรียกไปยัง defaultController (Index/Index/Controller)
   * เมธอด defaultMethod (index)
   *
   * @param {object} cfg สำหรับกำหนดค่าเริ่มต้น property ของ App
   */
  Now.createWebApplication = function(cfg = {}) {
    for (var key in cfg) {
      Now[key] = cfg[key];
    }
    var hashChange = function() {
      var url = location.hash.slice(1) || '',
        search = /([^&=]+)=?([^&]*)/g,
        decode = function(s) { return decodeURIComponent(s.replace(/\+/g, " ")); },
        params = {},
        match;
      while (match = search.exec(url)) {
        params[decode(match[1])] = decode(match[2]);
      }
      var method = params.method || Now.defaultMethod;
      if (!params.className) {
        if (match = /^([a-z]{1,20})(\-([a-z]{1,20}))?$/.exec(params.module || '')) {
          if (Object.defined(match[3])) {
            params.className = match[1].capitalize() + '/' + match[3].capitalize() + '/Controller';
          } else {
            params.className = 'Index/' + match[1].capitalize() + '/Controller';
          }
        } else {
          params.className = Now.defaultController;
        }
      }
      if (Now[params.className]) {
        if (Object.isFunction(Now[params.className][method])) {
          Now[params.className][method].call(Now[params.className], params);
        }
      } else {
        createClass(params.className, function() {
          if (Object.isFunction(Now[params.className][method])) {
            this[method].call(this, params);
          }
        });
      }
    };
    /* โหลดคลาสต่างๆ */
    include([
      WEB_URL + 'vendor/now/element.js',
      WEB_URL + 'vendor/now/ajax.js',
      WEB_URL + 'vendor/now/controller.js',
      WEB_URL + 'vendor/now/view.js',
      WEB_URL + 'vendor/now/model.js',
      WEB_URL + 'vendor/now/string.js',
      WEB_URL + 'vendor/now/template.js',
    ], function() {
      createClass(Now.defaultController, function() {
        window.addEventListener('hashchange', hashChange);
        if (Object.isFunction(Now.init)) {
          Now.init.call(HINSTANCE);
        }
        hashChange.call(HINSTANCE);
      });
    });
  };
}(window));