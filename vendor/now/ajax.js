(function() {
  'use strict';
  var ajaxAccepts = {
    xml: "application/xml, text/xml",
    html: "text/html",
    text: "text/plain",
    json: "application/json, text/javascript",
    all: "text/html, text/plain, application/xml, text/xml, application/json, text/javascript"
  };
  Now.Ajax = {
    /**
     * create Object
     * @param {object} options
     * @returns {static}
     */
    create: function(options) {
      this.options = {
        method: "post",
        cache: false,
        asynchronous: true,
        contentType: "application/x-www-form-urlencoded",
        encoding: "UTF-8",
        Accept: "all",
        onTimeout: emptyFunction,
        onError: emptyFunction,
        onProgress: emptyFunction,
        timeout: 0,
        loadingClass: "wait"
      };
      for (var property in options) {
        this.options[property] = options[property];
      }
      this.options.method = this.options.method.toLowerCase();
      return this;
    },
    /**
     * create XMLHttpRequest
     *
     * @returns {XMLHttpRequest}
     */
    createXMLHttpRequest: function() {
      var xmlHttp = null;
      if (window.XMLHttpRequest) {
        xmlHttp = new XMLHttpRequest();
      } else if (window.ActiveXObject) {
        try {
          xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
          xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
      }
      return xmlHttp;
    },
    /**
     * call Ajax
     *
     * @param {string} url
     * @param {string} parameters
     * @param {function} callback
     * @returns {static}
     */
    send: function(url, parameters, callback) {
      var self = this,
        xhr = this.createXMLHttpRequest();
      this._abort = false;
      if (!Object.isNull(xhr)) {
        var option = this.options;
        if (option.method === "get") {
          if (parameters !== null) {
            url += "?" + parameters;
          }
          parameters = null;
        } else {
          parameters = parameters === null ? "" : parameters;
        }
        if (option.cache === false) {
          var match = /\?/;
          url += (match.test(url) ? "&" : "?") + new Date().getTime();
        }
        xhr.open(option.method, url, option.asynchronous);
        if (option.method === "post") {
          xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
          xhr.setRequestHeader("Accept", ajaxAccepts[option.Accept]);
          if (option.contentType && option.encoding) {
            xhr.setRequestHeader("Content-Type", option.contentType + "; charset=" + option.encoding);
          }
        }
        if (option.timeout > 0) {
          this.calltimeout = window.setTimeout(_callTimeout, option.timeout);
        }
        xhr.onreadystatechange = function() {
          if (xhr.readyState == 4) {
            window.clearTimeout(self.calltimeout);
            if (xhr.status == 200 && !self._abort && Object.isFunction(callback)) {
              self.responseText = xhr.responseText;
              self.responseXML = xhr.responseXML;
              callback(self);
            } else {
              option.onError(self);
            }
          }
        };
        var _callTimeout = function() {
          window.clearTimeout(self.calltimeout);
          option.onTimeout.bind(self);
        };
        xhr.send(parameters);
        if (!option.asynchronous) {
          window.clearTimeout(this.calltimeout);
          this.responseText = xhr.responseText;
          this.responseXML = xhr.responseXML;
        }
      }
      return this;
    },
    /**
     * ยกเลิกการทำงาน Ajax ก่อนหน้า
     * @returns {static}
     */
    abort: function() {
      this._abort = true;
      return this;
    }
  };
}());