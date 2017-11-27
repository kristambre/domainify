let options;
let autoEnter = true;

function updateOptions() {
    browser.storage.sync.get().then(result => {
        autoEnter = result.auto_enter;
    });
}

function parsePort(port) {
    return port != '' && port != '80' && port != '443' ? ":"+port : '';
}

function parseHost(host) {
    return "//"+host;
}

function parsePath(path) {
    if(path == ["/"]) {
        return [];
    }

    let parsedPath = null;

    if(path.endsWith("/")) {
        parsedPath = path.substr(0, path.length - 1);
    }

    parsedPath = parsedPath === null ? path.substr(1).split("/") : parsedPath.substr(1).split("/");
    parsedPath[0] = "/".concat(parsedPath[0]);

    return parsedPath;
}

browser.commands.onCommand.addListener(function(command) {
    let tab = browser.tabs.query({ currentWindow: true, active: true });

    tab.then(function(tabs) {
                for (let tab of tabs) {
                    browser.tabs
                    .sendMessage(tab.id, {message: "get-url"})
                    .then(response => {
                        updateTab(response, command, tab);
                    });
                }
            });
});

let pushNewState = true;
let path = null;

function updateTab(urlData, command, tab) {
    let forced = false;
    let parsedURL = urlData.protocol // appends ':' by default
            .concat(parseHost(urlData.host)) // prepends '//'
            .concat(parsePort(urlData.port)); // prepends ':' if port is visible;

    let currentPath = parsePath(urlData.path);

    if (path === null) {
        path = parsePath(urlData.path);
    }

    switch (command) {
        case "go-to-root":
            //default behaviour
            break;
        case "go-up":
            if (currentPath.length == 0) {
                break;
            }

            for (let i = 0; i < currentPath.length - 1; i++) {
                parsedURL = parsedURL.concat(currentPath[i]).concat("/");
            }

            break;
        case "go-down":
            let length = currentPath.length + 1;

            if (length > path.length) {
                length = path.length;
            }

            for (let i = 0; i < path.length; i++) {
                if(i < length) {
                    parsedURL = parsedURL.concat(path[i]).concat("/");
                }
            }

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

browser.browserAction.onClicked.addListener(function() {
    browser.runtime.openOptionsPage();
});

browser.runtime.onMessage.addListener(function(message) {
    if (message.message == "update-options") {
        updateOptions();
    }

    if (message.message == "reset-state") {
        resetState();
    }
});

browser.tabs.onActivated.addListener(function() {
    resetState();
});

function resetState() {
    pushNewState = true;
    path = null;
}

if(!options) {
    updateOptions();
}
