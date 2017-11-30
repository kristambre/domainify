let root = null;
let path = null;
let alreadyPushed = false;

newUrl();

browser.runtime.onMessage.addListener(function(message) {
    if(message.message == "set-url") {
        if(!alreadyPushed) {
            window.history.pushState('', '', message.url);
            alreadyPushed = true;
        } else {
            window.history.replaceState('', '', message.url);
        }
    }

    if(message.message == "get-url-data") {
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

    path = new Path(window.location.pathname, "/", null);

    browser.runtime.sendMessage({
        message: "new-page",
        root: root,
        path: path,
    }).then(res => {
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
