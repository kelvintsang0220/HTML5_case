window.resourceLoader = (function() {
    var cache = {};
    
    var ext_re = /\.(\w+)(?:$|\?)/;
    
    function _preload(type, list, callback) {
        if(!list.length) {
            return;
        }
        var _src = list.shift();
        if(typeof _src == 'object') {
            _preload(type, _src, callback);
            return;
        }
            
        var 
            _match = _src.match(/http:\/\/([^\/]+)/),
            _host = (_match && _match[1]) || document.domain,
            x_domain = _host != document.domain;
        
        if(!_host || cache[_src]) {
            callback && callback(+!!_host, _src);
            _preload(type, list, callback);
        }else {
            if(x_domain) {
                var _file;
                if(type == 'css') {
                //     _file = document.createElement('object');
                //     _file.width = 0;
                //     _file.height = 0;
                //     _file.data = _src;
                //     document.body.appendChild(_file);
                // }else {
                    _file = document.createElement('object');
                    _file.width = 0;
                    _file.height = 0;
                    _file.data = _src;
                    document.body.appendChild(_file);
                }

                _file.onload = function() {
                    callback && callback(1, _src);
                    document.body.removeChild(this);
                    _file = null;
                    
                    _preload(type, list, callback);
                }
            }else {
                var xhr = new XMLHttpRequest();
                
                if(xhr) {
                    xhr.onreadystatechange = function() {
                        if (xhr.readyState == 4) {
                            callback && callback(1, _src);
                            _preload(type, list, callback);
                        }
                    }
                    xhr.open('GET', _src, true);
                    xhr.send();
                }
            }
        }
    }

    return {
        data: {img:[], css:[], js:[]},
        /*
            opt.type: img-1, css-2, js-4
            opt.thread:
            opt.onload:
        */
        load: function(opt) {
            var 
                _type = opt.type || 7,
                _thread = opt.thread || 1;
                
            for(var i=0; i<_thread; i++) {
                if(_type&1 && this.data.img.length) {
                    _preload('img',this.data.img, opt.onload);
                }
                
                if(_type&2 && this.data.css.length) {
                    _preload('css',this.data.css, opt.onload);
                }
                
                if(_type&4 && this.data.js.length) {
                    _preload('js',this.data.js, opt.onload);
                }
            }
        },
        add: function(data) {
            if(data.img || data.css || data.js) {
                this.data.img = this.data.img.concat(data.img||[]);
                this.data.css = this.data.css.concat(data.css||[]);
                this.data.js = this.data.js.concat(data.js||[]);
                
            }else if(data.length){
                data.forEach(function(src) {
                    var _match = src.match(ext_re);
                    if(_match[1] == 'css') {
                        this.data.css.push(src);
                    }else if(_match[1] == 'js') {
                        this.data.js.push(src);
                    }else {
                        this.data.img.push(src);
                    }
                    
                }, this);
                
            }
            
            return this;
        },
        loadScript: function(url) {
            if(url.length) {
                var _head = document.querySelector('head');
                var _src = url.shift();
                
                var _script = document.createElement('script');
                _script.src = _src;
                _script.addEventListener('load', function() {
                    resourceLoader.loadScript(url);
                });

                _head.appendChild(_script);
                
            }else if(document.dispatchEvent) {
                var _evt = document.createEvent('HTMLEvents');
                _evt.initEvent('scripts_loaded', false, false);
                document.dispatchEvent(_evt);
            }
        },
        loadStyle: function(url) {
            if(url.length) {
                var _head = document.querySelector('head');
                var _src = url.shift();
                
                var _style = document.createElement('link');
                _style.setAttribute("rel", "stylesheet");
                _style.setAttribute("type", "text/css");
                _style.setAttribute("href", _src);

                _head.appendChild(_style);
                
                this.loadStyle(url);
            }
        }
    }
})();