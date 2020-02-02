(function() {
  include([
    WEB_URL + 'vendor/now/hmac-sha256-min.js',
    WEB_URL + 'vendor/now/enc-base64-min.js'
  ]);
  Now.JWT = {
    encode: function(secret, data, header) {
      header = header || { "alg": "HS256", "typ": "JWT" };
      var stringifiedHeader = CryptoJS.enc.Utf8.parse(JSON.stringify(header));
      var encodedHeader = this.base64url(stringifiedHeader);
      var stringifiedData = CryptoJS.enc.Utf8.parse(JSON.stringify(data));
      var encodedData = this.base64url(stringifiedData);
      var signature = encodedHeader + '.' + encodedData;
      signature = CryptoJS.HmacSHA256(signature, secret);
      return encodedHeader + '.' + encodedData + '.' + this.base64url(signature);
    },
    decode: function(source) {
      return source;
    },
    base64url: function(source) {
      encodedSource = CryptoJS.enc.Base64.stringify(source);
      encodedSource = encodedSource.replace(/=+$/, '');
      encodedSource = encodedSource.replace(/\+/g, '-');
      encodedSource = encodedSource.replace(/\//g, '_');
      return encodedSource;
    }
  };
})();