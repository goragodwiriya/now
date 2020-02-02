(function() {
  'use strict';
  var _$ = {
    init: function(node) {
      for (var prop in this) {
        node[prop] = this[prop];
      }
      return node;
    },
    after: function(e) {
      var p = this.parentNode;
      if (this.nextSibling == null) {
        p.appendChild(e);
      } else {
        p.insertBefore(e, this.nextSibling);
      }
      return e;
    },
    before: function(e) {
      var p = this.parentNode;
      if (p.firstChild == this) {
        p.appendChild(e);
      } else {
        p.insertBefore(e, this);
      }
      return e;
    },
    insert: function(e) {
      var e = _$.init(e);
      this.appendChild(e);
      return e;
    },
    copy: function(o) {
      return _$.init(this.cloneNode(o || true));
    },
    replace: function(e) {
      var p = this.parentNode;
      p.insertBefore(e, this.nextSibling);
      p.removeChild(this);
      return _$.init(e);
    },
    remove: function() {
      this.parentNode.removeChild(this);
      return this;
    },
    setHTML: function(o) {
      try {
        this.innerHTML = o;
      } catch (e) {
        o = o
          .replace(/[\r\n\t]/g, "")
          .replace(/<script[^>]*>.*?<\/script>/gi, "");
        this.appendChild(o.toDOM());
      }
      return this;
    },
    getTop: function() {
      return this.viewportOffset().top;
    },
    getLeft: function() {
      return this.viewportOffset().left;
    },
    getWidth: function() {
      return this.getDimensions().width;
    },
    getHeight: function() {
      return this.getDimensions().height;
    },
    getClientWidth: function() {
      return (
        this.clientWidth -
        parseInt(this.getStyle("paddingLeft")) -
        parseInt(this.getStyle("paddingRight"))
      );
    },
    getClientHeight: function() {
      return (
        this.clientHeight -
        parseInt(this.getStyle("paddingTop")) -
        parseInt(this.getStyle("paddingBottom"))
      );
    },
    viewportOffset: function() {
      var t = 0,
        l = 0,
        p = this;
      while (p) {
        t += parseInt(p.offsetTop);
        l += parseInt(p.offsetLeft);
        p = p.offsetParent;
      }
      if (this.getBoundingClientRect) {
        return { top: t, left: this.getBoundingClientRect().left };
      } else {
        return { top: t, left: l };
      }
    },
    getDimensions: function() {
      var ow, oh;
      if (this == document) {
        ow = Math.max(
          Math.max(
            document.body.scrollWidth,
            document.documentElement.scrollWidth
          ),
          Math.max(
            document.body.offsetWidth,
            document.documentElement.offsetWidth
          ),
          Math.max(
            document.body.clientWidth,
            document.documentElement.clientWidth
          )
        );
        oh = Math.max(
          Math.max(
            document.body.scrollHeight,
            document.documentElement.scrollHeight
          ),
          Math.max(
            document.body.offsetHeight,
            document.documentElement.offsetHeight
          ),
          Math.max(
            document.body.clientHeight,
            document.documentElement.clientHeight
          )
        );
      } else {
        var d = this.getStyle("display");
        if (d != "none" && d !== null) {
          ow = this.offsetWidth;
          oh = this.offsetHeight;
        } else {
          var s = this.style;
          var ov = s.visibility;
          var op = s.position;
          var od = s.display;
          s.visibility = "hidden";
          s.position = "absolute";
          s.display = "block";
          ow = this.clientWidth;
          oh = this.clientHeight;
          s.display = od;
          s.position = op;
          s.visibility = ov;
        }
      }
      return { width: ow, height: oh };
    },
    getOffsetParent: function() {
      var e = this.offsetParent;
      if (!e) {
        e = this.parentNode;
        while (e != document.body && e.style.position == "static") {
          e = e.parentNode;
        }
      }
      return GElement(e);
    },
    getCaretPosition: function() {
      if (document.selection) {
        var range = document.selection.createRange(),
          textLength = range.text.length;
        range.moveStart("character", -this.value.length);
        var caretAt = range.text.length;
        return { start: caretAt, end: caretAt + textLength };
      } else if (this.selectionStart || this.selectionStart == "0") {
        return { start: this.selectionStart, end: this.selectionEnd };
      }
    },
    setCaretPosition: function(start, length) {
      if (this.setSelectionRange) {
        this.focus();
        this.setSelectionRange(start, start + length);
      } else if (this.createTextRange) {
        var range = this.createTextRange();
        range.collapse(true);
        range.moveEnd("character", start + length);
        range.moveStart("character", start);
        range.select();
      }
      return this;
    },
    getStyle: function(s) {
      s = s == "float" && this.currentStyle ? "styleFloat" : s;
      s = s == "borderColor" ? "borderBottomColor" : s;
      var v = this.currentStyle ? this.currentStyle[s] : null;
      v = !v && window.getComputedStyle ?
        document.defaultView
        .getComputedStyle(this, null)
        .getPropertyValue(s.replace(/([A-Z])/g, "-$1").toLowerCase()) :
        v;
      if (s == "opacity") {
        return Object.isNull(v) ? 100 : floatval(v) * 100;
      } else {
        return v;
      }
    },
    setStyle: function(p, v) {
      if (p == "opacity") {
        if (window.ActiveXObject) {
          this.style.filter = "alpha(opacity=" + v * 100 + ")";
        }
        this.style.opacity = v;
      } else if (p == "float" || p == "styleFloat" || p == "cssFloat") {
        if (Object.isNull(this.style.styleFloat)) {
          this.style["cssFloat"] = v;
        } else {
          this.style["styleFloat"] = v;
        }
      } else if (
        p == "backgroundColor" &&
        this.tagName.toLowerCase() == "iframe"
      ) {
        if (document.all) {
          this.contentWindow.document.bgColor = v;
        } else {
          this.style.backgroundColor = v;
        }
      } else if (p == "borderColor") {
        this.style.borderLeftColor = v;
        this.style.borderTopColor = v;
        this.style.borderRightColor = v;
        this.style.borderBottomColor = v;
      } else {
        this.style[p] = v;
      }
      return this;
    },
    center: function() {
      var size = this.getDimensions();
      if (this.getStyle("position") == "fixed") {
        this.style.top = (document.viewport.getHeight() - size.height) / 2 + "px";
        this.style.left = (document.viewport.getWidth() - size.width) / 2 + "px";
      } else {
        this.style.top = document.viewport.getscrollTop() + (document.viewport.getHeight() - size.height) / 2 + "px";
        this.style.left = document.viewport.getscrollLeft() + (document.viewport.getWidth() - size.width) / 2 + "px";
      }
      return this;
    },
    get: function(p) {
      try {
        return this.getAttribute(p);
      } catch (e) {
        return null;
      }
    },
    set: function(p, v) {
      try {
        this.setAttribute(p, v);
      } catch (e) {}
      return this;
    },
    hasClass: function(v) {
      var vs = v.split(" ");
      var cs = this.className.split(" ");
      for (var c = 0; c < cs.length; c++) {
        for (v = 0; v < vs.length; v++) {
          if (vs[v] != "" && vs[v] == cs[c]) {
            return vs[v];
          }
        }
      }
      return false;
    },
    addClass: function(v) {
      if (!v) {
        this.className = "";
      } else {
        var rm = v.split(" "),
          cs = [];
        this.className.split(" ").forEach(function(c) {
          if (c !== "" && rm.indexOf(c) == -1) {
            cs.push(c);
          }
        });
        cs.push(v);
        this.className = cs.join(" ");
      }
      return this;
    },
    removeClass: function(v) {
      if (!Object.isNull(this.className)) {
        var rm = v.split(" "),
          cs = [];
        this.className.split(" ").forEach(function(c) {
          if (c !== "" && rm.indexOf(c) == -1) {
            cs.push(c);
          }
        });
        this.className = cs.join(" ");
      }
      return this;
    },
    replaceClass: function(source, replace) {
      if (!Object.isNull(this.className)) {
        var rm = (replace + " " + source).split(" "),
          cs = [];
        this.className.split(" ").forEach(function(c) {
          if (c !== "" && rm.indexOf(c) == -1) {
            cs.push(c);
          }
        });
        cs.push(replace);
        this.className = cs.join(" ");
      }
      return this;
    },
    hide: function() {
      this.display = this.getStyle("display");
      this.setStyle("display", "none");
      return this;
    },
    show: function() {
      if (this.getStyle("display") == "none") {
        this.setStyle("display", "block");
      }
      return this;
    },
    visible: function() {
      return this.getStyle("display") != "none";
    },
    toggle: function() {
      if (this.visible()) {
        this.hide();
      } else {
        this.show();
      }
      return this;
    },
    nextNode: function() {
      var n = this;
      do {
        n = n.nextSibling;
      } while (n && n.nodeType != 1);
      return n;
    },
    previousNode: function() {
      var p = this;
      do {
        p = p.previousSibling;
      } while (p && p.nodeType != 1);
      return p;
    },
    firstNode: function() {
      var p = this.firstChild;
      do {
        p = p.nextSibling;
      } while (p && p.nodeType != 1);
      return p;
    },
    nextTab: function() {
      var self = this,
        check = null;
      document.forms.forEach(function(form) {
        form.getElementsByTagName("*").forEach(function(node) {
          if (node == self.elem) {
            check = node;
          } else if (check != null) {
            if (node.tabIndex >= 0 && node.disabled != true && node.style.display != "none" && node.offsetParent != null) {
              return node;
            }
          }
        });
      });
      return null;
    },
    sendKey: function(keyCode) {
      return this.callEvent("keypress", { keyCode: keyCode });
    },
    callEvent: function(t, params) {
      var evt;
      if (document.createEvent) {
        evt = document.createEvent("Events");
        evt.initEvent(t, true, true);
        for (var prop in params) {
          evt[prop] = params[prop];
        }
        this.dispatchEvent(evt);
      } else if (document.createEventObject) {
        evt = document.createEventObject();
        for (var prop in params) {
          evt[prop] = params[prop];
        }
        this.fireEvent("on" + t, evt);
      }
      return this;
    },
    addEvent: function(t, f, c) {
      var input = this;
      t.split(" ").forEach(function(e) {
        if (input.addEventListener) {
          c = !c ? false : c;
          input.addEventListener(e, f, c);
        } else if (input.attachEvent) {
          tmp = input;
          tmp["e" + e + f] = f;
          tmp[e + f] = function() {
            tmp["e" + e + f](window.event);
          };
          tmp.attachEvent("on" + e, tmp[e + f]);
        }
      });
      return this;
    },
    removeEvent: function(t, f) {
      if (this.removeEventListener) {
        this.removeEventListener(t == "mousewheel" && window.gecko ? "DOMMouseScroll" : t, f, false);
      } else if (this.detachEvent) {
        var tmp = this;
        tmp.detachEvent("on" + t, tmp[t + f]);
        tmp["e" + t + f] = null;
        tmp[t + f] = null;
      }
      return this;
    },
    highlight: function(o) {
      this.addClass("highlight");
      var self = this;
      window.setTimeout(function() {
        self.removeClass("highlight");
      }, 1);
      return this;
    },
    fadeIn: function(oncomplete) {
      this.addClass("fadein");
      var self = this;
      window.setTimeout(function() {
        self.removeClass("fadein");
        if (Object.isFunction(oncomplete)) {
          oncomplete.call(this);
        }
      }, 1000);
      return this;
    },
    fadeOut: function(oncomplete) {
      this.addClass("fadeout");
      var self = this;
      window.setTimeout(function() {
        self.removeClass("fadeout");
        if (Object.isFunction(oncomplete)) {
          oncomplete.call(this);
        }
      }, 1000);
      return this;
    },
    setValue: function(v) {
      function _find(e, a) {
        var s = e.getElementsByTagName("option");
        for (var i = 0; i < s.length; i++) {
          if (s[i].value == a) {
            return i;
          }
        }
        return -1;
      }
      v = decodeURIComponent(v);
      var t = this.tagName.toLowerCase();
      if (t == "img") {
        this.src = v;
      } else if (t == "select") {
        this.selectedIndex = _find(this, v);
      } else if (t == "input") {
        if (this.type == "checkbox" || this.type == "radio") {
          this.checked = v == this.value;
        } else {
          this.value = v.unentityify();
        }
      } else if (t == "textarea") {
        this.value = v.unentityify();
      } else {
        this.setHTML(v);
      }
      return this;
    },
    getText: function() {
      if (!Object.isNull(this.elem.selectedIndex)) {
        if (this.elem.selectedIndex == -1) {
          return null;
        }
        return this.elem.options[this.elem.selectedIndex].text;
      } else if (this.elem.innerHTML) {
        return this.elem.innerHTML;
      }
      return this.elem.value;
    },
    setOptions: function(json, value) {
      if (this.tagName.toLowerCase() == "select") {
        for (var i = this.options.length; i > 0; i--) {
          this.removeChild(this.options[i - 1]);
        }
        var selectedIndex = 0;
        if (json) {
          var i = 0;
          for (var key in json) {
            if (key == value) {
              selectedIndex = i;
            }
            var option = document.createElement("option");
            option.innerHTML = json[key];
            option.value = key;
            this.appendChild(option);
            i++;
          }
        }
        this.selectedIndex = selectedIndex;
      }
    },
    getSelectedText: function() {
      var text = "";
      if (this.selectionStart) {
        if (this.selectionStart != this.selectionEnd) {
          text = this.value.substring(this.selectionStart, this.selectionEnd);
        }
      } else if (document.selection) {
        var range = document.selection.createRange();
        if (range.parentElement() === this) {
          text = range.text;
        }
      }
      return text;
    },
    setSelectedText: function(value) {
      if (this.selectionStart) {
        if (this.selectionStart != this.selectionEnd) {
          this.value =
            this.value.substring(0, this.selectionStart) +
            value +
            this.value.substring(this.selectionEnd);
        }
      } else {
        var range = document.selection.createRange();
        if (range.parentElement() === this) {
          range.text = value;
        }
      }
      return this;
    },
    findLabel: function() {
      var id = this.id;
      document.getElementsByTagName("label").forEach(function(label) {
        if (label.htmlFor != "" && label.htmlFor == id) {
          return label;
        }
      });
      return null;
    },
    elems: function(tagname) {
      return this.getElementsByTagName(tagname);
    },
    create: function(tagname, o) {
      var v;
      if (tagname == "iframe" || tagname == "input") {
        if (window.ActiveXObject) {
          try {
            if (tagname == "iframe") {
              v = document.createElement('<iframe scrolling="no" />');
            } else {
              v = document.createElement('<input type="' + o.type + '" />');
            }
          } catch (e) {
            v = document.createElement(tagname);
          }
        } else {
          v = document.createElement(tagname);
        }
      } else {
        v = document.createElement(tagname);
      }
      for (var p in o) {
        v[p] = o[p];
      }
      this.appendChild(v);
      return _$.init(v);
    },
    msgBox: function(value, className, autohide) {
      var parent,
        tag = this.tagName.toLowerCase();
      if (tag == "body") {
        if ($E("body_msg_div")) {
          parent = $E("body_msg_div");
        } else {
          parent = document.createElement("div");
          parent.id = "body_msg_div";
          parent.style.position = "fixed";
          parent.style.right = "10px";
          parent.style.top = "10px";
          document.body.appendChild(parent);
        }
      } else {
        parent = this;
      }
      if (parent) {
        if (value && value != "") {
          var div = document.createElement("div"),
            innerDiv = document.createElement("div");
          div.className = "alert " + (className || "message");
          var span = document.createElement("span");
          span.innerHTML = "&times;";
          span.className = "closebtn";
          div.appendChild(span);
          div.appendChild(innerDiv);
          innerDiv.innerHTML = value;
          parent.appendChild(div);
        }
        forEach(parent.getElementsByClassName("closebtn"), function() {
          if (this.onclick === null) {
            var span = this;
            span.onclick = function() {
              var parent = this.parentNode;
              parent.style.opacity = "0";
              if (this.timer) {
                clearTimeout(this.timer);
              }
              setTimeout(function() {
                parent.remove();
              }, 600);
            };
            if (typeof autohide === "undefined" || autohide === true) {
              span.timer = setTimeout(function() {
                span.click();
              }, 3000);
            }
          }
        });
      }
    },
    valid: function(className) {
      if (this.ret) {
        if (this.ret.hasClass("validationResult")) {
          this.ret.remove();
          this.ret = false;
        } else {
          this.ret.replaceClass("invalid", "valid");
          this.ret.innerHTML = this.retDef ? this.retDef : "";
        }
      }
      this.replaceClass(
        "invalid wait",
        "valid" + (className ? " " + className : "")
      );
      return this;
    },
    invalid: function(value, className) {
      if (!this.ret) {
        if (
          typeof this.dataset !== "undefined" &&
          typeof this.dataset.result === "string" &&
          this.dataset.result !== "" &&
          $E(this.dataset.result)
        ) {
          this.ret = $G(this.dataset.result);
        } else {
          var id = this.id || this.name;
          if ($E("result_" + id)) {
            this.ret = $G("result_" + id);
          }
        }
        if (this.ret && !this.retDef) {
          this.retDef = this.ret.innerHTML;
        }
      }
      if (this.ret) {
        if (value && value != "") {
          this.ret.innerHTML = value;
        }
        this.ret.replaceClass(
          "valid",
          "invalid" + (className ? " " + className : "")
        );
      }
      this.replaceClass("valid wait", "invalid");
      return this;
    },
    reset: function() {
      if (this.ret) {
        if (this.ret.hasClass("validationResult")) {
          this.ret.remove();
          this.ret = false;
        } else {
          this.ret.replaceClass("invalid valid", "");
          this.ret.innerHTML = this.retDef ? this.retDef : "";
        }
      }
      this.replaceClass("invalid valid wait required", "");
      return this;
    },
  };
  /**
   * ฟังก์ชั่นคืนค่า element จาก id name class
   *
   * @param string|element element
   *
   * @returns element|array
   */
  window.$ = function(element) {
    if (Object.isString(element)) {
      var elems = document.querySelectorAll(element);
      if (elems.length == 0) {
        return null;
      } else if (elems.length == 1) {
        return _$.init(elems[0]);
      } else {
        for (var i = 0; i < elems.length; i++) {
          elems[i] = _$.init(elems[1]);
        }
        return elems;
      }
    } else if (!Object.defined(element)) {
      return _$.init(window);
    } else {
      return _$.init(element);
    }
  };
  /**
   * คลาสสำหรับอ่านค่าจาก event
   */
  window.GEvent = {
    isButton: function(e, code) {
      var button;
      e = window.event || e;
      if (e.which == null) {
        button = e.button < 2 ? 0 : e.button == 4 ? 1 : 2;
      } else {
        button = e.which < 2 ? 0 : e.which == 2 ? 1 : 2;
      }
      return button === code;
    },
    isLeftClick: function(e) {
      return GEvent.isButton(e, 0);
    },
    isMiddleClick: function(e) {
      return GEvent.isButton(e, 1);
    },
    isRightClick: function(e) {
      return GEvent.isButton(e, 2);
    },
    isCtrlKey: function(e) {
      return window.event ? window.event.ctrlKey : e.ctrlKey;
    },
    isShiftKey: function(e) {
      return window.event ? window.event.shiftKey : e.shiftKey;
    },
    isAltKey: function(e) {
      return window.event ? window.event.altKey : e.altKey;
    },
    element: function(e) {
      e = window.event || e;
      var node = e.target ? e.target : e.srcElement;
      return e.nodeType == 3 ? node.parentNode : node;
    },
    keyCode: function(e) {
      e = window.event || e;
      return e.which || e.keyCode;
    },
    stop: function(e) {
      e = window.event || e;
      if (e.stopPropagation) {
        e.stopPropagation();
      }
      e.cancelBubble = true;
      if (e.preventDefault) {
        e.preventDefault();
      }
      e.returnValue = false;
    },
    pointer: function(e) {
      e = window.event || e;
      return {
        x: e.pageX ||
          e.clientX +
          (document.documentElement.scrollLeft || document.body.scrollLeft),
        y: e.pageY ||
          e.clientY +
          (document.documentElement.scrollTop || document.body.scrollTop)
      };
    },
    pointerX: function(e) {
      return GEvent.pointer(e).x;
    },
    pointerY: function(e) {
      return GEvent.pointer(e).y;
    }
  };
  window.Cookie = {
    get: function(k) {
      var v = document.cookie.match(
        "(?:^|;)\\s*" + k.preg_quote() + "=([^;]*)"
      );
      return v ? decodeURIComponent(v[1]) : null;
    },
    set: function(k, v, options) {
      var _options = {
        path: false,
        domain: false,
        duration: false,
        secure: false
      };
      for (var property in options) {
        _options[property] = options[property];
      }
      v = encodeURIComponent(v);
      if (_options.domain) {
        v += "; domain=" + _options.domain;
      }
      if (_options.path) {
        v += "; path=" + _options.path;
      }
      if (_options.duration) {
        var date = new Date();
        date.setTime(date.getTime() + _options.duration * 24 * 60 * 60 * 1000);
        v += "; expires=" + date.toGMTString();
      }
      if (_options.secure) {
        v += "; secure";
      }
      document.cookie = k + "=" + v;
      return this;
    },
    remove: function(k) {
      Cookie.set(k, "", {
        duration: -1
      });
      return this;
    }
  };
}());