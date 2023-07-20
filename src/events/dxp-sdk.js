var options = {
    scope: 'www.dxp.co.id',
    url: {
        api: 'http://localhost:8181',
        script: 'http://localhost:3400',
    },
    source: {
        id: "ee2db027-46cf-4034-a759-79f1c930f80d"
    },
    initialPageProperties: {
        path: location.pathname + location.hash,
        pageInfo: {
            pageID: "index",
            pageName: document.title,
            pagePath: document.location.pathname,
            destinationURL: document.location.origin + document.location.pathname,
            language: "en",
            categories: [],
            tags: []
        },
    }
};

window.dxp || (window.dxp = {});
(function () {
    var dxpQueue = [];
    var methods = ['trackSubmit', 'trackClick', 'trackLink', 'trackForm', 'initialize', 'pageview', 'identify', 'reset', 'group', 'track', 'ready', 'alias', 'debug', 'page', 'once', 'off', 'on', 'personalize'];

    var factory = function (method) {
        return function () {
            var args = Array.prototype.slice.call(arguments);
            args.unshift(method);
            dxpQueue.push(args);
            return window.dxp;
        };
    };

    // For each of our methods, generate a queueing stub.
    for (var i = 0; i < methods.length; i++) {
        var method = methods[i];
        window.dxp[method] = factory(method);
    }

    function callback(e) {
        dxp.initialize({'Apache Unomi': options });
        while (dxpQueue.length > 0) {
            var item = dxpQueue.shift();
            var method = item.shift();
            if (dxp[method]) {
                dxp[method].apply(dxp, item);
            }
        }
    }

    // Define a method to load Analytics.js from our CDN,
    // and that will be sure to only ever load it once.
    dxp.load = function () {
        // Create an async script element based on your key.
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.src = options.url.script + '/public/sdk/dxp-tracker.min.js';

        if (script.addEventListener) {
            script.addEventListener('load', function (e) {
                if (typeof callback === 'function') {
                    callback(e);
                }
            }, false);
        } else {
            script.onreadystatechange = function () {
                if (this.readyState === 'complete' || this.readyState === 'loaded') {
                    callback(window.event);
                }
            };
        }

        // Insert our script next to the first script element.
        var first = document.getElementsByTagName('script')[0];
        first.parentNode.insertBefore(script, first);
    };

    document.addEventListener('DOMContentLoaded', dxp.load);
    dxp.page(options.initialPageProperties);
    
})();

var tracker = {
    onCustomEvent(eventName, object){
        dxp.track(eventName, object);
    },
    onClick(eventName, object){
        dxp.trackClick(eventName, object);
    },
    onLink(links, event, properties){
        dxp.trackLink(links, event, properties);
    },
    onFormSubmit(formId, eventName, object){
        window.addEventListener("load", function () {
            var form = document.getElementById(formId);
            console.log('form submit', form)
            dxp.trackForm(form, eventName, {formName: form.name});
        });
    },
    onInitialize(options){
        dxp.initialize(options);
    },
    onInitPage(options){
        dxp.page(options);
    },
    onPageView(options){
        dxp.pageview(options);
    },
    onIdentify(eventName, object){
        dxp.identify(eventName, object);
    },  
};