(function() {
  String.prototype.entityify = function() {
    return this.replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;")
      .replace(/\\/g, "&#92;")
      .replace(/&/g, "&amp;")
      .replace(/\{/g, "&#x007B;")
      .replace(/\}/g, "&#x007D;");
  };
  String.prototype.unentityify = function() {
    return this.replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#[0]?39;/g, "'")
      .replace(/&#92;/g, "\\")
      .replace(/&amp;/g, "&")
      .replace(/&#x007B;/g, "{")
      .replace(/&#x007D;/g, "}");
  };
  String.prototype.toJSON = function() {
    try {
      return JSON.parse(this);
    } catch (e) {
      return false;
    }
  };
  String.prototype.toInt = function() {
    return floatval(this);
  };
  String.prototype.currFormat = function() {
    return floatval(this).toFixed(2);
  };
  String.prototype.preg_quote = function() {
    return this.replace(/([-.*+?^${}()|[\]\/\\])/g, "\\$1");
  };
  String.prototype.capitalize = function() {
    return this.replace(/\b[a-z]/g, function(m) {
      return m.toUpperCase();
    });
  };
  String.prototype.evalScript = function() {
    var regex = /<script.*?>(.*?)<\/script>/g;
    var t = this.replace(/[\r\n]/g, "")
      .replace(/\/\/<\!\[CDATA\[/g, "")
      .replace(/\/\/\]\]>/g, "");
    var m = regex.exec(t);
    while (m) {
      try {
        eval(m[1]);
      } catch (e) {}
      m = regex.exec(t);
    }
    return this;
  };
  String.prototype.leftPad = function(c, f) {
    var r = "";
    for (var i = 0; i < c - this.length; i++) {
      r = r + f;
    }
    return r + this;
  };
  String.prototype.trim = function() {
    return this.replace(/^(\s|&nbsp;)+|(\s|&nbsp;)+$/g, "");
  };
  String.prototype.ltrim = function() {
    return this.replace(/^(\s|&nbsp;)+/, "");
  };
  String.prototype.rtrim = function() {
    return this.replace(/(\s|&nbsp;)+$/, "");
  };
  String.prototype.strip_tags = function(allowed) {
    allowed = (
      ((allowed || "") + "").toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []
    ).join("");
    var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;
    var php = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
    return this.replace(php, "").replace(tags, function($0, $1) {
      return allowed.indexOf("<" + $1.toLowerCase() + ">") > -1 ? $0 : "";
    });
  };
  String.prototype.toDOM = function() {
    var s = function(a) {
      return a
        .replace(/&gt;/g, ">")
        .replace(/&lt;/g, "<")
        .replace(/&nbsp;/g, " ")
        .replace(/&quot;/g, '"')
        .replace(/&#[0]?39;/g, "'")
        .replace(/&#92;/g, "\\")
        .replace(/&amp;/g, "&");
    };
    var t = function(a) {
      return a.replace(/ /g, "");
    };
    var u = function(a) {
      var b = document.createDocumentFragment();
      var c = a.indexOf(" ");
      if (c == -1) {
        var d = a.toLowerCase();
        b.appendChild(document.createElement(d));
      } else {
        d = t(a.substring(0, c)).toLowerCase();
        if (document.all && (d == "input" || d == "iframe")) {
          try {
            b.appendChild(document.createElement("<" + a + "/>"));
            return b;
          } catch (e) {}
        }
        a = a.substring(c + 1);
        b.appendChild(document.createElement(d));
        while (a.length > 0) {
          var e = a.indexOf("=");
          if (e >= 0) {
            var f = t(a.substring(0, e)).toLowerCase();
            var g = a.indexOf('"');
            a = a.substring(g + 1);
            g = a.indexOf('"');
            var h = s(a.substring(0, g));
            a = a.substring(g + 2);
            if (document.all && f == "style") {
              b.lastChild.style.cssText = h;
            } else if (f == "class") {
              b.lastChild.className = h;
            } else {
              b.lastChild.setAttribute(f, h);
            }
          } else {
            break;
          }
        }
      }
      return b;
    };
    var v = function(a, b, c) {
      var d = a;
      var e = b;
      c = c.toLowerCase();
      var f = e.indexOf("</" + c + ">");
      d = d.concat(e.substring(0, f));
      e = e.substring(f);
      while (d.indexOf("<" + c) != -1) {
        d = d.substring(d.indexOf("<" + c));
        d = d.substring(d.indexOf(">") + 1);
        e = e.substring(e.indexOf(">") + 1);
        f = e.indexOf("</" + c + ">");
        d = d.concat(e.substring(0, f));
        e = e.substring(f);
      }
      return b.length - e.length;
    };
    var w = function(a) {
      var b = document.createDocumentFragment();
      while (a && a.length > 0) {
        var c = a.indexOf("<");
        if (c == -1) {
          a = s(a);
          b.appendChild(document.createTextNode(a));
          a = null;
        }
        if (c > 0) {
          var d = s(a.substring(0, c));
          b.appendChild(document.createTextNode(d));
          a = a.substring(c);
        }
        if (c == 0) {
          var e = a.indexOf("<!--");
          if (e == 0) {
            var f = a.indexOf("-->");
            var g = a.substring(4, f);
            g = s(g);
            b.appendChild(document.createComment(g));
            a = a.substring(f + 3);
          } else {
            var h = a.indexOf(">");
            if (a.substring(h - 1, h) == "/") {
              var i = a.indexOf("/>");
              var j = a.substring(1, i);
              b.appendChild(u(j));
              a = a.substring(i + 2);
            } else {
              var k = a.indexOf(">");
              var l = a.substring(1, k);
              var m = document.createDocumentFragment();
              m.appendChild(u(l));
              a = a.substring(k + 1);
              var n = a.substring(0, a.indexOf("</"));
              a = a.substring(a.indexOf("</"));
              if (n.indexOf("<") != -1) {
                var o = m.lastChild.nodeName;
                var p = v(n, a, o);
                n = n.concat(a.substring(0, p));
                a = a.substring(p);
              }
              a = a.substring(a.indexOf(">") + 1);
              m.lastChild.appendChild(w(n));
              b.appendChild(m);
            }
          }
        }
      }
      return b;
    };
    return w(this);
  };
  String.prototype.toDate = function() {
    var patt = /(([0-9]{4,4})-([0-9]{1,2})-([0-9]{1,2})|today|tomorrow|yesterday)([\s]{0,}([+-])[\s]{0,}([0-9]+))?/,
      hs = patt.exec(this),
      d;
    if (hs) {
      if (typeof hs[2] == "undefined") {
        d = new Date();
      } else {
        d = new Date(floatval(hs[2]), floatval(hs[3]) - 1, hs[4], 0, 0, 0, 0);
      }
      if (hs[1] == "yesterday") {
        d.setDate(d.getDate() - 1);
      } else if (hs[1] == "tomorrow") {
        d.setDate(d.getDate() + 1);
      }
      if (hs[6] == "+" && floatval(hs[7]) > 0) {
        d.setDate(d.getDate() + floatval(hs[7]));
      } else if (hs[6] == "-" && floatval(hs[7]) > 0) {
        d.setDate(d.getDate() - floatval(hs[7]));
      }
      return d;
    } else {
      return null;
    }
  };
}.call(this));
