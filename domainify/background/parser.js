browser.commands.onCommand.addListener(function(command) {
    domainify(command, false);
});

function domainify(command, forced) {
    let tab = browser.tabs.query({ currentWindow: true, active: true });

    tab.then(function(tabs) {
        for (let tab of tabs) {
            browser.tabs
                .sendMessage(tab.id, {message: "get-url"})
                .then(response => {
                    updateTab(response, command, tab, forced);
                });
        }
    });
}

function parsePort(port) {
    return port != '' && port != '80' && port != '443' ? ":"+port : '';
}

function parseHost(host) {
    return "//"+host;
}

function updateTab(urlData, command, tab, forced) {
    let parsedURL = urlData.protocol // appends ':' by default
            .concat(parseHost(urlData.host)) // prepends '//'
            .concat(parsePort(urlData.port)); // prepends ':' if port is visible;

    if(path == null) {
        path = new Path(urlData.path, "/", null);
    }

    switch (command) {
        case "go-to-root":
            //default behaviour
            break;
        case "go-up":
            parsedURL = parsedURL.concat(path.up.value);
            path = path.up;
            break;
        case "go-down":
            parsedURL = parsedURL.concat(path.down.value);
            path = path.down;
            break;
        case "go-to-current":
            parsedURL = urlData.url;
            forced = true;
            break;
    }

    if(autoEnter == true || forced == true) {
        browser.tabs.update({url: parsedURL});
    } else {
        browser.tabs.sendMessage(tab.id, {message: "set-url", url: parsedURL, newState: pushNewState});
        pushNewState = false;
    }
}
