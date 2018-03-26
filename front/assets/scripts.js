
/* **********************************************
     Begin prism-core.js
********************************************** */

var _self = typeof window !== 'undefined' ? window // if in browser
: typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope ? self // if in worker
: {} // if in node js
;

/**
 * Prism: Lightweight, robust, elegant syntax highlighting
 * MIT license http://www.opensource.org/licenses/mit-license.php/
 * @author Lea Verou http://lea.verou.me
 */

var Prism = function () {

  // Private helper vars
  var lang = /\blang(?:uage)?-(\w+)\b/i;
  var uniqueId = 0;

  var _ = _self.Prism = {
    manual: _self.Prism && _self.Prism.manual,
    disableWorkerMessageHandler: _self.Prism && _self.Prism.disableWorkerMessageHandler,
    util: {
      encode: function (tokens) {
        if (tokens instanceof Token) {
          return new Token(tokens.type, _.util.encode(tokens.content), tokens.alias);
        } else if (_.util.type(tokens) === 'Array') {
          return tokens.map(_.util.encode);
        } else {
          return tokens.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\u00a0/g, ' ');
        }
      },

      type: function (o) {
        return Object.prototype.toString.call(o).match(/\[object (\w+)\]/)[1];
      },

      objId: function (obj) {
        if (!obj['__id']) {
          Object.defineProperty(obj, '__id', { value: ++uniqueId });
        }
        return obj['__id'];
      },

      // Deep clone a language definition (e.g. to extend it)
      clone: function (o, visited) {
        var type = _.util.type(o);
        visited = visited || {};

        switch (type) {
          case 'Object':
            if (visited[_.util.objId(o)]) {
              return visited[_.util.objId(o)];
            }
            var clone = {};
            visited[_.util.objId(o)] = clone;

            for (var key in o) {
              if (o.hasOwnProperty(key)) {
                clone[key] = _.util.clone(o[key], visited);
              }
            }

            return clone;

          case 'Array':
            if (visited[_.util.objId(o)]) {
              return visited[_.util.objId(o)];
            }
            var clone = [];
            visited[_.util.objId(o)] = clone;

            o.forEach(function (v, i) {
              clone[i] = _.util.clone(v, visited);
            });

            return clone;
        }

        return o;
      }
    },

    languages: {
      extend: function (id, redef) {
        var lang = _.util.clone(_.languages[id]);

        for (var key in redef) {
          lang[key] = redef[key];
        }

        return lang;
      },

      /**
       * Insert a token before another token in a language literal
       * As this needs to recreate the object (we cannot actually insert before keys in object literals),
       * we cannot just provide an object, we need anobject and a key.
       * @param inside The key (or language id) of the parent
       * @param before The key to insert before. If not provided, the function appends instead.
       * @param insert Object with the key/value pairs to insert
       * @param root The object that contains `inside`. If equal to Prism.languages, it can be omitted.
       */
      insertBefore: function (inside, before, insert, root) {
        root = root || _.languages;
        var grammar = root[inside];

        if (arguments.length == 2) {
          insert = arguments[1];

          for (var newToken in insert) {
            if (insert.hasOwnProperty(newToken)) {
              grammar[newToken] = insert[newToken];
            }
          }

          return grammar;
        }

        var ret = {};

        for (var token in grammar) {

          if (grammar.hasOwnProperty(token)) {

            if (token == before) {

              for (var newToken in insert) {

                if (insert.hasOwnProperty(newToken)) {
                  ret[newToken] = insert[newToken];
                }
              }
            }

            ret[token] = grammar[token];
          }
        }

        // Update references in other language definitions
        _.languages.DFS(_.languages, function (key, value) {
          if (value === root[inside] && key != inside) {
            this[key] = ret;
          }
        });

        return root[inside] = ret;
      },

      // Traverse a language definition with Depth First Search
      DFS: function (o, callback, type, visited) {
        visited = visited || {};
        for (var i in o) {
          if (o.hasOwnProperty(i)) {
            callback.call(o, i, o[i], type || i);

            if (_.util.type(o[i]) === 'Object' && !visited[_.util.objId(o[i])]) {
              visited[_.util.objId(o[i])] = true;
              _.languages.DFS(o[i], callback, null, visited);
            } else if (_.util.type(o[i]) === 'Array' && !visited[_.util.objId(o[i])]) {
              visited[_.util.objId(o[i])] = true;
              _.languages.DFS(o[i], callback, i, visited);
            }
          }
        }
      }
    },
    plugins: {},

    highlightAll: function (async, callback) {
      _.highlightAllUnder(document, async, callback);
    },

    highlightAllUnder: function (container, async, callback) {
      var env = {
        callback: callback,
        selector: 'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'
      };

      _.hooks.run("before-highlightall", env);

      var elements = env.elements || container.querySelectorAll(env.selector);

      for (var i = 0, element; element = elements[i++];) {
        _.highlightElement(element, async === true, env.callback);
      }
    },

    highlightElement: function (element, async, callback) {
      // Find language
      var language,
          grammar,
          parent = element;

      while (parent && !lang.test(parent.className)) {
        parent = parent.parentNode;
      }

      if (parent) {
        language = (parent.className.match(lang) || [, ''])[1].toLowerCase();
        grammar = _.languages[language];
      }

      // Set language on the element, if not present
      element.className = element.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;

      if (element.parentNode) {
        // Set language on the parent, for styling
        parent = element.parentNode;

        if (/pre/i.test(parent.nodeName)) {
          parent.className = parent.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;
        }
      }

      var code = element.textContent;

      var env = {
        element: element,
        language: language,
        grammar: grammar,
        code: code
      };

      _.hooks.run('before-sanity-check', env);

      if (!env.code || !env.grammar) {
        if (env.code) {
          _.hooks.run('before-highlight', env);
          env.element.textContent = env.code;
          _.hooks.run('after-highlight', env);
        }
        _.hooks.run('complete', env);
        return;
      }

      _.hooks.run('before-highlight', env);

      if (async && _self.Worker) {
        var worker = new Worker(_.filename);

        worker.onmessage = function (evt) {
          env.highlightedCode = evt.data;

          _.hooks.run('before-insert', env);

          env.element.innerHTML = env.highlightedCode;

          callback && callback.call(env.element);
          _.hooks.run('after-highlight', env);
          _.hooks.run('complete', env);
        };

        worker.postMessage(JSON.stringify({
          language: env.language,
          code: env.code,
          immediateClose: true
        }));
      } else {
        env.highlightedCode = _.highlight(env.code, env.grammar, env.language);

        _.hooks.run('before-insert', env);

        env.element.innerHTML = env.highlightedCode;

        callback && callback.call(element);

        _.hooks.run('after-highlight', env);
        _.hooks.run('complete', env);
      }
    },

    highlight: function (text, grammar, language) {
      var env = {
        text: text,
        grammar: grammar,
        language: language
      };
      env.tokens = _.tokenize(text, grammar);
      _.hooks.run('after-tokenize', env);
      return Token.stringify(_.util.encode(env.tokens), language);
    },

    matchGrammar: function (text, strarr, grammar, index, startPos, oneshot, target) {
      var Token = _.Token;

      for (var token in grammar) {
        if (!grammar.hasOwnProperty(token) || !grammar[token]) {
          continue;
        }

        if (token == target) {
          return;
        }

        var patterns = grammar[token];
        patterns = _.util.type(patterns) === "Array" ? patterns : [patterns];

        for (var j = 0; j < patterns.length; ++j) {
          var pattern = patterns[j],
              inside = pattern.inside,
              lookbehind = !!pattern.lookbehind,
              greedy = !!pattern.greedy,
              lookbehindLength = 0,
              alias = pattern.alias;

          if (greedy && !pattern.pattern.global) {
            // Without the global flag, lastIndex won't work
            var flags = pattern.pattern.toString().match(/[imuy]*$/)[0];
            pattern.pattern = RegExp(pattern.pattern.source, flags + "g");
          }

          pattern = pattern.pattern || pattern;

          // Don’t cache length as it changes during the loop
          for (var i = index, pos = startPos; i < strarr.length; pos += strarr[i].length, ++i) {

            var str = strarr[i];

            if (strarr.length > text.length) {
              // Something went terribly wrong, ABORT, ABORT!
              return;
            }

            if (str instanceof Token) {
              continue;
            }

            pattern.lastIndex = 0;

            var match = pattern.exec(str),
                delNum = 1;

            // Greedy patterns can override/remove up to two previously matched tokens
            if (!match && greedy && i != strarr.length - 1) {
              pattern.lastIndex = pos;
              match = pattern.exec(text);
              if (!match) {
                break;
              }

              var from = match.index + (lookbehind ? match[1].length : 0),
                  to = match.index + match[0].length,
                  k = i,
                  p = pos;

              for (var len = strarr.length; k < len && (p < to || !strarr[k].type && !strarr[k - 1].greedy); ++k) {
                p += strarr[k].length;
                // Move the index i to the element in strarr that is closest to from
                if (from >= p) {
                  ++i;
                  pos = p;
                }
              }

              /*
               * If strarr[i] is a Token, then the match starts inside another Token, which is invalid
               * If strarr[k - 1] is greedy we are in conflict with another greedy pattern
               */
              if (strarr[i] instanceof Token || strarr[k - 1].greedy) {
                continue;
              }

              // Number of tokens to delete and replace with the new match
              delNum = k - i;
              str = text.slice(pos, p);
              match.index -= pos;
            }

            if (!match) {
              if (oneshot) {
                break;
              }

              continue;
            }

            if (lookbehind) {
              lookbehindLength = match[1] ? match[1].length : 0;
            }

            var from = match.index + lookbehindLength,
                match = match[0].slice(lookbehindLength),
                to = from + match.length,
                before = str.slice(0, from),
                after = str.slice(to);

            var args = [i, delNum];

            if (before) {
              ++i;
              pos += before.length;
              args.push(before);
            }

            var wrapped = new Token(token, inside ? _.tokenize(match, inside) : match, alias, match, greedy);

            args.push(wrapped);

            if (after) {
              args.push(after);
            }

            Array.prototype.splice.apply(strarr, args);

            if (delNum != 1) _.matchGrammar(text, strarr, grammar, i, pos, true, token);

            if (oneshot) break;
          }
        }
      }
    },

    tokenize: function (text, grammar, language) {
      var strarr = [text];

      var rest = grammar.rest;

      if (rest) {
        for (var token in rest) {
          grammar[token] = rest[token];
        }

        delete grammar.rest;
      }

      _.matchGrammar(text, strarr, grammar, 0, 0, false);

      return strarr;
    },

    hooks: {
      all: {},

      add: function (name, callback) {
        var hooks = _.hooks.all;

        hooks[name] = hooks[name] || [];

        hooks[name].push(callback);
      },

      run: function (name, env) {
        var callbacks = _.hooks.all[name];

        if (!callbacks || !callbacks.length) {
          return;
        }

        for (var i = 0, callback; callback = callbacks[i++];) {
          callback(env);
        }
      }
    }
  };

  var Token = _.Token = function (type, content, alias, matchedStr, greedy) {
    this.type = type;
    this.content = content;
    this.alias = alias;
    // Copy of the full string this token was created from
    this.length = (matchedStr || "").length | 0;
    this.greedy = !!greedy;
  };

  Token.stringify = function (o, language, parent) {
    if (typeof o == 'string') {
      return o;
    }

    if (_.util.type(o) === 'Array') {
      return o.map(function (element) {
        return Token.stringify(element, language, o);
      }).join('');
    }

    var env = {
      type: o.type,
      content: Token.stringify(o.content, language, parent),
      tag: 'span',
      classes: ['token', o.type],
      attributes: {},
      language: language,
      parent: parent
    };

    if (o.alias) {
      var aliases = _.util.type(o.alias) === 'Array' ? o.alias : [o.alias];
      Array.prototype.push.apply(env.classes, aliases);
    }

    _.hooks.run('wrap', env);

    var attributes = Object.keys(env.attributes).map(function (name) {
      return name + '="' + (env.attributes[name] || '').replace(/"/g, '&quot;') + '"';
    }).join(' ');

    return '<' + env.tag + ' class="' + env.classes.join(' ') + '"' + (attributes ? ' ' + attributes : '') + '>' + env.content + '</' + env.tag + '>';
  };

  if (!_self.document) {
    if (!_self.addEventListener) {
      // in Node.js
      return _self.Prism;
    }

    if (!_.disableWorkerMessageHandler) {
      // In worker
      _self.addEventListener('message', function (evt) {
        var message = JSON.parse(evt.data),
            lang = message.language,
            code = message.code,
            immediateClose = message.immediateClose;

        _self.postMessage(_.highlight(code, _.languages[lang], lang));
        if (immediateClose) {
          _self.close();
        }
      }, false);
    }

    return _self.Prism;
  }

  //Get current script and highlight
  var script = document.currentScript || [].slice.call(document.getElementsByTagName("script")).pop();

  if (script) {
    _.filename = script.src;

    if (!_.manual && !script.hasAttribute('data-manual')) {
      if (document.readyState !== "loading") {
        if (window.requestAnimationFrame) {
          window.requestAnimationFrame(_.highlightAll);
        } else {
          window.setTimeout(_.highlightAll, 16);
        }
      } else {
        document.addEventListener('DOMContentLoaded', _.highlightAll);
      }
    }
  }

  return _self.Prism;
}();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Prism;
}

// hack for components to work correctly in node.js
if (typeof global !== 'undefined') {
  global.Prism = Prism;
}

/* **********************************************
     Begin prism-markup.js
********************************************** */

Prism.languages.markup = {
  'comment': /<!--[\s\S]*?-->/,
  'prolog': /<\?[\s\S]+?\?>/,
  'doctype': /<!DOCTYPE[\s\S]+?>/i,
  'cdata': /<!\[CDATA\[[\s\S]*?]]>/i,
  'tag': {
    pattern: /<\/?(?!\d)[^\s>\/=$<%]+(?:\s+[^\s>\/=]+(?:=(?:("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|[^\s'">=]+))?)*\s*\/?>/i,
    greedy: true,
    inside: {
      'tag': {
        pattern: /^<\/?[^\s>\/]+/i,
        inside: {
          'punctuation': /^<\/?/,
          'namespace': /^[^\s>\/:]+:/
        }
      },
      'attr-value': {
        pattern: /=(?:("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|[^\s'">=]+)/i,
        inside: {
          'punctuation': [/^=/, {
            pattern: /(^|[^\\])["']/,
            lookbehind: true
          }]
        }
      },
      'punctuation': /\/?>/,
      'attr-name': {
        pattern: /[^\s>\/]+/,
        inside: {
          'namespace': /^[^\s>\/:]+:/
        }
      }

    }
  },
  'entity': /&#?[\da-z]{1,8};/i
};

Prism.languages.markup['tag'].inside['attr-value'].inside['entity'] = Prism.languages.markup['entity'];

// Plugin to make entity title show the real entity, idea by Roman Komarov
Prism.hooks.add('wrap', function (env) {

  if (env.type === 'entity') {
    env.attributes['title'] = env.content.replace(/&amp;/, '&');
  }
});

Prism.languages.xml = Prism.languages.markup;
Prism.languages.html = Prism.languages.markup;
Prism.languages.mathml = Prism.languages.markup;
Prism.languages.svg = Prism.languages.markup;

/* **********************************************
     Begin prism-css.js
********************************************** */

Prism.languages.css = {
  'comment': /\/\*[\s\S]*?\*\//,
  'atrule': {
    pattern: /@[\w-]+?.*?(?:;|(?=\s*\{))/i,
    inside: {
      'rule': /@[\w-]+/
      // See rest below
    }
  },
  'url': /url\((?:(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1|.*?)\)/i,
  'selector': /[^{}\s][^{};]*?(?=\s*\{)/,
  'string': {
    pattern: /("|')(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
    greedy: true
  },
  'property': /[-_a-z\xA0-\uFFFF][-\w\xA0-\uFFFF]*(?=\s*:)/i,
  'important': /\B!important\b/i,
  'function': /[-a-z0-9]+(?=\()/i,
  'punctuation': /[(){};:]/
};

Prism.languages.css['atrule'].inside.rest = Prism.languages.css;

if (Prism.languages.markup) {
  Prism.languages.insertBefore('markup', 'tag', {
    'style': {
      pattern: /(<style[\s\S]*?>)[\s\S]*?(?=<\/style>)/i,
      lookbehind: true,
      inside: Prism.languages.css,
      alias: 'language-css',
      greedy: true
    }
  });

  Prism.languages.insertBefore('inside', 'attr-value', {
    'style-attr': {
      pattern: /\s*style=("|')(?:\\[\s\S]|(?!\1)[^\\])*\1/i,
      inside: {
        'attr-name': {
          pattern: /^\s*style/i,
          inside: Prism.languages.markup.tag.inside
        },
        'punctuation': /^\s*=\s*['"]|['"]\s*$/,
        'attr-value': {
          pattern: /.+/i,
          inside: Prism.languages.css
        }
      },
      alias: 'language-css'
    }
  }, Prism.languages.markup.tag);
}

/* **********************************************
     Begin prism-clike.js
********************************************** */

Prism.languages.clike = {
  'comment': [{
    pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
    lookbehind: true
  }, {
    pattern: /(^|[^\\:])\/\/.*/,
    lookbehind: true
  }],
  'string': {
    pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
    greedy: true
  },
  'class-name': {
    pattern: /((?:\b(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[\w.\\]+/i,
    lookbehind: true,
    inside: {
      punctuation: /[.\\]/
    }
  },
  'keyword': /\b(?:if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
  'boolean': /\b(?:true|false)\b/,
  'function': /[a-z0-9_]+(?=\()/i,
  'number': /\b0x[\da-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?/i,
  'operator': /--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*|\/|~|\^|%/,
  'punctuation': /[{}[\];(),.:]/
};

/* **********************************************
     Begin prism-javascript.js
********************************************** */

Prism.languages.javascript = Prism.languages.extend('clike', {
  'keyword': /\b(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|var|void|while|with|yield)\b/,
  'number': /\b(?:0[xX][\dA-Fa-f]+|0[bB][01]+|0[oO][0-7]+|NaN|Infinity)\b|(?:\b\d+\.?\d*|\B\.\d+)(?:[Ee][+-]?\d+)?/,
  // Allow for all non-ASCII characters (See http://stackoverflow.com/a/2008444)
  'function': /[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*\()/i,
  'operator': /-[-=]?|\+[+=]?|!=?=?|<<?=?|>>?>?=?|=(?:==?|>)?|&[&=]?|\|[|=]?|\*\*?=?|\/=?|~|\^=?|%=?|\?|\.{3}/
});

Prism.languages.insertBefore('javascript', 'keyword', {
  'regex': {
    pattern: /(^|[^/])\/(?!\/)(\[[^\]\r\n]+]|\\.|[^/\\\[\r\n])+\/[gimyu]{0,5}(?=\s*($|[\r\n,.;})]))/,
    lookbehind: true,
    greedy: true
  },
  // This must be declared before keyword because we use "function" inside the look-forward
  'function-variable': {
    pattern: /[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*=\s*(?:function\b|(?:\([^()]*\)|[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)\s*=>))/i,
    alias: 'function'
  }
});

Prism.languages.insertBefore('javascript', 'string', {
  'template-string': {
    pattern: /`(?:\\[\s\S]|[^\\`])*`/,
    greedy: true,
    inside: {
      'interpolation': {
        pattern: /\$\{[^}]+\}/,
        inside: {
          'interpolation-punctuation': {
            pattern: /^\$\{|\}$/,
            alias: 'punctuation'
          },
          rest: Prism.languages.javascript
        }
      },
      'string': /[\s\S]+/
    }
  }
});

if (Prism.languages.markup) {
  Prism.languages.insertBefore('markup', 'tag', {
    'script': {
      pattern: /(<script[\s\S]*?>)[\s\S]*?(?=<\/script>)/i,
      lookbehind: true,
      inside: Prism.languages.javascript,
      alias: 'language-javascript',
      greedy: true
    }
  });
}

Prism.languages.js = Prism.languages.javascript;

/* **********************************************
     Begin prism-file-highlight.js
********************************************** */

(function () {
  if (typeof self === 'undefined' || !self.Prism || !self.document || !document.querySelector) {
    return;
  }

  self.Prism.fileHighlight = function () {

    var Extensions = {
      'js': 'javascript',
      'py': 'python',
      'rb': 'ruby',
      'ps1': 'powershell',
      'psm1': 'powershell',
      'sh': 'bash',
      'bat': 'batch',
      'h': 'c',
      'tex': 'latex'
    };

    Array.prototype.slice.call(document.querySelectorAll('pre[data-src]')).forEach(function (pre) {
      var src = pre.getAttribute('data-src');

      var language,
          parent = pre;
      var lang = /\blang(?:uage)?-(?!\*)(\w+)\b/i;
      while (parent && !lang.test(parent.className)) {
        parent = parent.parentNode;
      }

      if (parent) {
        language = (pre.className.match(lang) || [, ''])[1];
      }

      if (!language) {
        var extension = (src.match(/\.(\w+)$/) || [, ''])[1];
        language = Extensions[extension] || extension;
      }

      var code = document.createElement('code');
      code.className = 'language-' + language;

      pre.textContent = '';

      code.textContent = 'Loading…';

      pre.appendChild(code);

      var xhr = new XMLHttpRequest();

      xhr.open('GET', src, true);

      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {

          if (xhr.status < 400 && xhr.responseText) {
            code.textContent = xhr.responseText;

            Prism.highlightElement(code);
          } else if (xhr.status >= 400) {
            code.textContent = '✖ Error ' + xhr.status + ' while fetching file: ' + xhr.statusText;
          } else {
            code.textContent = '✖ Error: File does not exist or is empty';
          }
        }
      };

      xhr.send(null);
    });
  };

  document.addEventListener('DOMContentLoaded', self.Prism.fileHighlight);
})();

/**
 * Sticky Sidebar JavaScript Plugin.
 * @version 3.3.1
 * @author Ahmed Bouhuolia <a.bouhuolia@gmail.com>
 * @license The MIT License (MIT)
 */
const StickySidebar = (() => {

  // ---------------------------------
  // # Define Constants
  // ---------------------------------
  //
  const EVENT_KEY = '.stickySidebar';
  const VERSION = '3.3.1';

  const DEFAULTS = {

    /**
     * Additional top spacing of the element when it becomes sticky.
     * @type {Numeric|Function}
     */
    topSpacing: 0,

    /**
     * Additional bottom spacing of the element when it becomes sticky.
     * @type {Numeric|Function}
     */
    bottomSpacing: 0,

    /**
     * Container sidebar selector to know what the beginning and end of sticky element.
     * @type {String|False}
     */
    containerSelector: false,

    /**
     * Inner wrapper selector.
     * @type {String}
     */
    innerWrapperSelector: '.inner-wrapper-sticky',

    /**
     * The name of CSS class to apply to elements when they have become stuck.
     * @type {String|False}
     */
    stickyClass: 'is-affixed',

    /**
     * Detect when sidebar and its container change height so re-calculate their dimensions.
     * @type {Boolean}
     */
    resizeSensor: true,

    /**
     * The sidebar returns to its normal position if its width below this value.
     * @type {Numeric}
     */
    minWidth: false
  };

  // ---------------------------------
  // # Class Definition
  // ---------------------------------
  //
  /**
   * Sticky Sidebar Class.
   * @public
   */
  class StickySidebar {

    /**
     * Sticky Sidebar Constructor.
     * @constructor
     * @param {HTMLElement|String} sidebar - The sidebar element or sidebar selector.
     * @param {Object} options - The options of sticky sidebar.
     */
    constructor(sidebar, options = {}) {
      this.options = StickySidebar.extend(DEFAULTS, options);

      // Sidebar element query if there's no one, throw error.
      this.sidebar = 'string' === typeof sidebar ? document.querySelector(sidebar) : sidebar;
      if ('undefined' === typeof this.sidebar) throw new Error("There is no specific sidebar element.");

      this.sidebarInner = false;
      this.container = this.sidebar.parentElement;

      // Current Affix Type of sidebar element.
      this.affixedType = 'STATIC';
      this.direction = 'down';
      this.support = {
        transform: false,
        transform3d: false
      };

      this._initialized = false;
      this._reStyle = false;
      this._breakpoint = false;
      this._resizeListeners = [];

      // Dimensions of sidebar, container and screen viewport.
      this.dimensions = {
        translateY: 0,
        topSpacing: 0,
        lastTopSpacing: 0,
        bottomSpacing: 0,
        lastBottomSpacing: 0,
        sidebarHeight: 0,
        sidebarWidth: 0,
        containerTop: 0,
        containerHeight: 0,
        viewportHeight: 0,
        viewportTop: 0,
        lastViewportTop: 0
      };

      // Bind event handlers for referencability.
      ['handleEvent'].forEach(method => {
        this[method] = this[method].bind(this);
      });

      // Initialize sticky sidebar for first time.
      this.initialize();
    }

    /**
     * Initializes the sticky sidebar by adding inner wrapper, define its container, 
     * min-width breakpoint, calculating dimensions, adding helper classes and inline style.
     * @private
     */
    initialize() {
      this._setSupportFeatures();

      // Get sticky sidebar inner wrapper, if not found, will create one.
      if (this.options.innerWrapperSelector) {
        this.sidebarInner = this.sidebar.querySelector(this.options.innerWrapperSelector);

        if (null === this.sidebarInner) this.sidebarInner = false;
      }

      if (!this.sidebarInner) {
        let wrapper = document.createElement('div');
        wrapper.setAttribute('class', 'inner-wrapper-sticky');
        this.sidebar.appendChild(wrapper);

        while (this.sidebar.firstChild != wrapper) wrapper.appendChild(this.sidebar.firstChild);

        this.sidebarInner = this.sidebar.querySelector('.inner-wrapper-sticky');
      }

      // Container wrapper of the sidebar.
      if (this.options.containerSelector) {
        let containers = document.querySelectorAll(this.options.containerSelector);
        containers = Array.prototype.slice.call(containers);

        containers.forEach((container, item) => {
          if (!container.contains(this.sidebar)) return;
          this.container = container;
        });

        if (!containers.length) throw new Error("The container does not contains on the sidebar.");
      }

      // If top/bottom spacing is not function parse value to integer.
      if ('function' !== typeof this.options.topSpacing) this.options.topSpacing = parseInt(this.options.topSpacing) || 0;

      if ('function' !== typeof this.options.bottomSpacing) this.options.bottomSpacing = parseInt(this.options.bottomSpacing) || 0;

      // Breakdown sticky sidebar if screen width below `options.minWidth`.
      this._widthBreakpoint();

      // Calculate dimensions of sidebar, container and viewport.
      this.calcDimensions();

      // Affix sidebar in proper position.
      this.stickyPosition();

      // Bind all events.
      this.bindEvents();

      // Inform other properties the sticky sidebar is initialized.
      this._initialized = true;
    }

    /**
     * Bind all events of sticky sidebar plugin.
     * @protected
     */
    bindEvents() {
      window.addEventListener('resize', this, { passive: true, capture: false });
      window.addEventListener('scroll', this, { passive: true, capture: false });

      this.sidebar.addEventListener('update' + EVENT_KEY, this);

      if (this.options.resizeSensor && 'undefined' !== typeof ResizeSensor) {
        new ResizeSensor(this.sidebarInner, this.handleEvent);
        new ResizeSensor(this.container, this.handleEvent);
      }
    }

    /**
     * Handles all events of the plugin.
     * @param {Object} event - Event object passed from listener.
     */
    handleEvent(event) {
      this.updateSticky(event);
    }

    /**
     * Calculates dimensions of sidebar, container and screen viewpoint
     * @public
     */
    calcDimensions() {
      if (this._breakpoint) return;
      var dims = this.dimensions;

      // Container of sticky sidebar dimensions.
      dims.containerTop = StickySidebar.offsetRelative(this.container).top;
      dims.containerHeight = this.container.clientHeight;
      dims.containerBottom = dims.containerTop + dims.containerHeight;

      // Sidebar dimensions.
      dims.sidebarHeight = this.sidebarInner.offsetHeight;
      dims.sidebarWidth = this.sidebar.offsetWidth;

      // Screen viewport dimensions.
      dims.viewportHeight = window.innerHeight;

      this._calcDimensionsWithScroll();
    }

    /**
     * Some dimensions values need to be up-to-date when scrolling the page.
     * @private
     */
    _calcDimensionsWithScroll() {
      var dims = this.dimensions;

      dims.sidebarLeft = StickySidebar.offsetRelative(this.sidebar).left;

      dims.viewportTop = document.documentElement.scrollTop || document.body.scrollTop;
      dims.viewportBottom = dims.viewportTop + dims.viewportHeight;
      dims.viewportLeft = document.documentElement.scrollLeft || document.body.scrollLeft;

      dims.topSpacing = this.options.topSpacing;
      dims.bottomSpacing = this.options.bottomSpacing;

      if ('function' === typeof dims.topSpacing) dims.topSpacing = parseInt(dims.topSpacing(this.sidebar)) || 0;

      if ('function' === typeof dims.bottomSpacing) dims.bottomSpacing = parseInt(dims.bottomSpacing(this.sidebar)) || 0;

      if ('VIEWPORT-TOP' === this.affixedType) {
        // Adjust translate Y in the case decrease top spacing value.
        if (dims.topSpacing < dims.lastTopSpacing) {
          dims.translateY += dims.lastTopSpacing - dims.topSpacing;
          this._reStyle = true;
        }
      } else if ('VIEWPORT-BOTTOM' === this.affixedType) {
        // Adjust translate Y in the case decrease bottom spacing value.
        if (dims.bottomSpacing < dims.lastBottomSpacing) {
          dims.translateY += dims.lastBottomSpacing - dims.bottomSpacing;
          this._reStyle = true;
        }
      }

      dims.lastTopSpacing = dims.topSpacing;
      dims.lastBottomSpacing = dims.bottomSpacing;
    }

    /**
     * Determine whether the sidebar is bigger than viewport.
     * @public
     * @return {Boolean}
     */
    isSidebarFitsViewport() {
      return this.dimensions.sidebarHeight < this.dimensions.viewportHeight;
    }

    /**
     * Observe browser scrolling direction top and down.
     */
    observeScrollDir() {
      var dims = this.dimensions;
      if (dims.lastViewportTop === dims.viewportTop) return;

      var furthest = 'down' === this.direction ? Math.min : Math.max;

      // If the browser is scrolling not in the same direction.
      if (dims.viewportTop === furthest(dims.viewportTop, dims.lastViewportTop)) this.direction = 'down' === this.direction ? 'up' : 'down';
    }

    /**
     * Gets affix type of sidebar according to current scrollTop and scrollLeft.
     * Holds all logical affix of the sidebar when scrolling up and down and when sidebar 
     * is bigger than viewport and vice versa.
     * @public
     * @return {String|False} - Proper affix type.
     */
    getAffixType() {
      var dims = this.dimensions,
          affixType = false;

      this._calcDimensionsWithScroll();

      var sidebarBottom = dims.sidebarHeight + dims.containerTop;
      var colliderTop = dims.viewportTop + dims.topSpacing;
      var colliderBottom = dims.viewportBottom - dims.bottomSpacing;

      // When browser is scrolling top.
      if ('up' === this.direction) {
        if (colliderTop <= dims.containerTop) {
          dims.translateY = 0;
          affixType = 'STATIC';
        } else if (colliderTop <= dims.translateY + dims.containerTop) {
          dims.translateY = colliderTop - dims.containerTop;
          affixType = 'VIEWPORT-TOP';
        } else if (!this.isSidebarFitsViewport() && dims.containerTop <= colliderTop) {
          affixType = 'VIEWPORT-UNBOTTOM';
        }
        // When browser is scrolling up.
      } else {
        // When sidebar element is not bigger than screen viewport.
        if (this.isSidebarFitsViewport()) {

          if (dims.sidebarHeight + colliderTop >= dims.containerBottom) {
            dims.translateY = dims.containerBottom - sidebarBottom;
            affixType = 'CONTAINER-BOTTOM';
          } else if (colliderTop >= dims.containerTop) {
            dims.translateY = colliderTop - dims.containerTop;
            affixType = 'VIEWPORT-TOP';
          }
          // When sidebar element is bigger than screen viewport.
        } else {

          if (dims.containerBottom <= colliderBottom) {
            dims.translateY = dims.containerBottom - sidebarBottom;
            affixType = 'CONTAINER-BOTTOM';
          } else if (sidebarBottom + dims.translateY <= colliderBottom) {
            dims.translateY = colliderBottom - sidebarBottom;
            affixType = 'VIEWPORT-BOTTOM';
          } else if (dims.containerTop + dims.translateY <= colliderTop) {
            affixType = 'VIEWPORT-UNBOTTOM';
          }
        }
      }

      // Make sure the translate Y is not bigger than container height.
      dims.translateY = Math.max(0, dims.translateY);
      dims.translateY = Math.min(dims.containerHeight, dims.translateY);

      dims.lastViewportTop = dims.viewportTop;
      return affixType;
    }

    /**
     * Gets inline style of sticky sidebar wrapper and inner wrapper according 
     * to its affix type.
     * @private
     * @param {String} affixType - Affix type of sticky sidebar.
     * @return {Object}
     */
    _getStyle(affixType) {
      if ('undefined' === typeof affixType) return;

      var style = { inner: {}, outer: {} };
      var dims = this.dimensions;

      switch (affixType) {
        case 'VIEWPORT-TOP':
          style.inner = { position: 'fixed', top: dims.topSpacing,
            left: dims.sidebarLeft - dims.viewportLeft, width: dims.sidebarWidth };
          break;
        case 'VIEWPORT-BOTTOM':
          style.inner = { position: 'fixed', top: 'auto', left: dims.sidebarLeft,
            bottom: dims.bottomSpacing, width: dims.sidebarWidth };
          break;
        case 'CONTAINER-BOTTOM':
        case 'VIEWPORT-UNBOTTOM':
          let translate = this._getTranslate(0, dims.translateY + 'px');

          if (translate) style.inner = { transform: translate };else style.inner = { position: 'absolute', top: dims.translateY, width: dims.sidebarWidth };
          break;
      }

      switch (affixType) {
        case 'VIEWPORT-TOP':
        case 'VIEWPORT-BOTTOM':
        case 'VIEWPORT-UNBOTTOM':
        case 'CONTAINER-BOTTOM':
          style.outer = { height: dims.sidebarHeight, position: 'relative' };
          break;
      }

      style.outer = StickySidebar.extend({ height: '', position: '' }, style.outer);
      style.inner = StickySidebar.extend({ position: 'relative', top: '', left: '',
        bottom: '', width: '', transform: this._getTranslate() }, style.inner);

      return style;
    }

    /**
     * Cause the sidebar to be sticky according to affix type by adding inline
     * style, adding helper class and trigger events.
     * @function
     * @protected
     * @param {string} force - Update sticky sidebar position by force.
     */
    stickyPosition(force) {
      if (this._breakpoint) return;

      force = this._reStyle || force || false;

      var offsetTop = this.options.topSpacing;
      var offsetBottom = this.options.bottomSpacing;

      var affixType = this.getAffixType();
      var style = this._getStyle(affixType);

      if ((this.affixedType != affixType || force) && affixType) {
        let affixEvent = 'affix.' + affixType.toLowerCase().replace('viewport-', '') + EVENT_KEY;
        StickySidebar.eventTrigger(this.sidebar, affixEvent);

        if ('STATIC' === affixType) StickySidebar.removeClass(this.sidebar, this.options.stickyClass);else StickySidebar.addClass(this.sidebar, this.options.stickyClass);

        for (let key in style.outer) {
          let _unit = 'number' === typeof style.outer[key] ? 'px' : '';
          this.sidebar.style[key] = style.outer[key];
        }

        for (let key in style.inner) {
          let _unit = 'number' === typeof style.inner[key] ? 'px' : '';
          this.sidebarInner.style[key] = style.inner[key] + _unit;
        }

        let affixedEvent = 'affixed.' + affixType.toLowerCase().replace('viewport-', '') + EVENT_KEY;
        StickySidebar.eventTrigger(this.sidebar, affixedEvent);
      } else {
        if (this._initialized) this.sidebarInner.style.left = style.inner.left;
      }

      this.affixedType = affixType;
    }

    /**
     * Breakdown sticky sidebar when window width is below `options.minWidth` value.
     * @protected
     */
    _widthBreakpoint() {

      if (window.innerWidth <= this.options.minWidth) {
        this._breakpoint = true;
        this.affixedType = 'STATIC';

        this.sidebar.removeAttribute('style');
        StickySidebar.removeClass(this.sidebar, this.options.stickyClass);
        this.sidebarInner.removeAttribute('style');
      } else {
        this._breakpoint = false;
      }
    }

    /**
     * Switches between functions stack for each event type, if there's no 
     * event, it will re-initialize sticky sidebar.
     * @public
     */
    updateSticky(event = {}) {
      if (this._running) return;
      this._running = true;

      (eventType => {

        requestAnimationFrame(() => {
          switch (eventType) {
            // When browser is scrolling and re-calculate just dimensions
            // within scroll. 
            case 'scroll':
              this._calcDimensionsWithScroll();
              this.observeScrollDir();
              this.stickyPosition();
              break;

            // When browser is resizing or there's no event, observe width
            // breakpoint and re-calculate dimensions.
            case 'resize':
            default:
              this._widthBreakpoint();
              this.calcDimensions();
              this.stickyPosition(true);
              break;
          }
          this._running = false;
        });
      })(event.type);
    }

    /**
     * Set browser support features to the public property.
     * @private
     */
    _setSupportFeatures() {
      var support = this.support;

      support.transform = StickySidebar.supportTransform();
      support.transform3d = StickySidebar.supportTransform(true);
    }

    /**
     * Get translate value, if the browser supports transfrom3d, it will adopt it.
     * and the same with translate. if browser doesn't support both return false.
     * @param {Number} y - Value of Y-axis.
     * @param {Number} x - Value of X-axis.
     * @param {Number} z - Value of Z-axis.
     * @return {String|False}
     */
    _getTranslate(y = 0, x = 0, z = 0) {
      if (this.support.transform3d) return 'translate3d(' + y + ', ' + x + ', ' + z + ')';else if (this.support.translate) return 'translate(' + y + ', ' + x + ')';else return false;
    }

    /**
     * Destroy sticky sidebar plugin.
     * @public
     */
    destroy() {
      window.removeEventListener('resize', this, { caption: false });
      window.removeEventListener('scroll', this, { caption: false });

      this.sidebar.classList.remove(this.options.stickyClass);
      this.sidebar.style.minHeight = '';

      this.sidebar.removeEventListener('update' + EVENT_KEY, this);

      var styleReset = { inner: {}, outer: {} };

      styleReset.inner = { position: '', top: '', left: '', bottom: '', width: '', transform: '' };
      styleReset.outer = { height: '', position: '' };

      for (let key in styleReset.outer) this.sidebar.style[key] = styleReset.outer[key];

      for (let key in styleReset.inner) this.sidebarInner.style[key] = styleReset.inner[key];

      if (this.options.resizeSensor && 'undefined' !== typeof ResizeSensor) {
        ResizeSensor.detach(this.sidebarInner, this.handleEvent);
        ResizeSensor.detach(this.container, this.handleEvent);
      }
    }

    /**
     * Determine if the browser supports CSS transform feature.
     * @function
     * @static
     * @param {Boolean} transform3d - Detect transform with translate3d.
     * @return {String}
     */
    static supportTransform(transform3d) {
      var result = false,
          property = transform3d ? 'perspective' : 'transform',
          upper = property.charAt(0).toUpperCase() + property.slice(1),
          prefixes = ['Webkit', 'Moz', 'O', 'ms'],
          support = document.createElement('support'),
          style = support.style;

      (property + ' ' + prefixes.join(upper + ' ') + upper).split(' ').forEach(function (property, i) {
        if (style[property] !== undefined) {
          result = property;
          return false;
        }
      });
      return result;
    }

    /**
     * Trigger custom event.
     * @static
     * @param {DOMObject} element - Target element on the DOM.
     * @param {String} eventName - Event name.
     * @param {Object} data - 
     */
    static eventTrigger(element, eventName, data) {
      try {
        var event = new CustomEvent(eventName, { detail: data });
      } catch (e) {
        var event = document.createEvent('CustomEvent');
        event.initCustomEvent(eventName, true, true, data);
      }
      element.dispatchEvent(event);
    }

    /**
     * Extend options object with defaults.
     * @function
     * @static
     */
    static extend(defaults, options) {
      var results = {};
      for (let key in defaults) {
        if ('undefined' !== typeof options[key]) results[key] = options[key];else results[key] = defaults[key];
      }
      return results;
    }

    /**
     * Get current coordinates left and top of specific element.
     * @static
     */
    static offsetRelative(element) {
      var result = { left: 0, top: 0 };

      do {
        let offsetTop = element.offsetTop;
        let offsetLeft = element.offsetLeft;

        if (!isNaN(offsetTop)) result.top += offsetTop;

        if (!isNaN(offsetLeft)) result.left += offsetLeft;

        element = 'BODY' === element.tagName ? element.parentElement : element.offsetParent;
      } while (element);
      return result;
    }

    /**
     * Add specific class name to specific element.
     * @static 
     * @param {ObjectDOM} element 
     * @param {String} className 
     */
    static addClass(element, className) {
      if (!StickySidebar.hasClass(element, className)) {
        if (element.classList) element.classList.add(className);else element.className += ' ' + className;
      }
    }

    /**
     * Remove specific class name to specific element
     * @static
     * @param {ObjectDOM} element 
     * @param {String} className 
     */
    static removeClass(element, className) {
      if (StickySidebar.hasClass(element, className)) {
        if (element.classList) element.classList.remove(className);else element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
      }
    }

    /**
     * Determine weather the element has specific class name.
     * @static
     * @param {ObjectDOM} element 
     * @param {String} className 
     */
    static hasClass(element, className) {
      if (element.classList) return element.classList.contains(className);else return new RegExp('(^| )' + className + '( |$)', 'gi').test(element.className);
    }
  }

  return StickySidebar;
})();

// export default StickySidebar;

// Global
// -------------------------
window.StickySidebar = StickySidebar;