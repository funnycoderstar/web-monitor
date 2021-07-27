(function () {
    // create XMLHttpRequest proxy object
    var oldXMLHttpRequest = XMLHttpRequest;
    // define constructor for my proxy object
    window.XMLHttpRequest = function () {
      var actual = new oldXMLHttpRequest();
      var self = this;
      this.onreadystatechange = null;
      // this is the actual handler on the real XMLHttpRequest object
      actual.onreadystatechange = function () {
        if (this.readyState == 1) {
        onLoadStart.call(this);
        } else if (this.readyState == 4) {
          if(this.status==200)
             onLoadEnd.call(this);
          else{
             onError.call(this);
          }
        }
       if (self.onreadystatechange) {
          return self.onreadystatechange();
        }
      };
  ​
  ​
  // add all proxy getters
  ["status", "statusText", "responseType", "response",
  "readyState", "responseXML", "upload"
  ].forEach(function (item) {
    Object.defineProperty(self, item, {
    get: function () {
      return actual[item];
     },
    set: function (val) {
      actual[item] = val;
    }
    });
  });
  ​
  ​
  // add all proxy getters/setters
  ["ontimeout, timeout", "withCredentials", "onload", "onerror", "onprogress"].forEach(function (item) {
    Object.defineProperty(self, item, {
      get: function () {
        return actual[item];
      },
      set: function (val) {
        actual[item] = val;
      }
    });
  });
  ​
  ​
  // add all pure proxy pass-through methods
  ["addEventListener", "send", "open", "abort", "getAllResponseHeaders",
  "getResponseHeader", "overrideMimeType", "setRequestHeader", "removeEventListener"
  ].forEach(function (item) {
    Object.defineProperty(self, item, {
      value: function () {
        return actual[item].apply(actual, arguments);
      }
     });
    });
    }
  })();
  
  
  
  
