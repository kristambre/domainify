let root = null;
let path = null;
let alreadyPushed = false;

newUrl();

browser.runtime.onMessage.addListener(function(message) {
    if(message.message == "set-url") {
        debug("Setting url...");
        if(!alreadyPushed) {
            window.history.pushState('', '', message.url);
            alreadyPushed = true;
        } else {
            window.history.replaceState('', '', message.url);
        }
    }

    if(message.message == "get-url-data") {
        debug("Getting url data...");
        return Promise.resolve({
            root: root,
            path: path,
        });
    }
});

function newUrl() {
    root =  window.location.protocol // appends ':' by default
                .concat(parseHost(window.location.hostname)) // prepends '//'
                .concat(parsePort(window.location.port)); // prepends ':' if port is visible;

    debug("Root: "+root);
    debug("Parsing paths...");
    path = new Path(window.location.pathname, "/", null);

    debug("Sending new page...");
    browser.runtime.sendMessage({
        message: "new-page",
        root: root,
        path: path,
    }).then(res => {
        debug("Skip redirects: "+res.skipRedirect);
        if(res.skipRedirect) {
            detectRedirection();
        }
    });
}


function parsePort(port) {
    return port != '' && port != '80' && port != '443' ? ":"+port : '';
}

function parseHost(host) {
    return "//"+host;
}

function debug(msg) {
    console.log(msg);
}
