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
    if(path.endsWith("/")) {
        path = path.substr(0, path.length - 1);
    }

    path = path.substr(1).split("/");
    path[0] = "/".concat(path[0]);

    return path;
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

function updateTab(urlData, command, tab) {
    let forced = false;
    let parsedURL = urlData.protocol // appends ':' by default
                    + parseHost(urlData.host) // prepends '//'
                    + parsePort(urlData.port); // prepends ':' if port is visible;

    switch (command) {
        case "go-to-root":
            //default behaviour
            break;
        case "go-up":
            let parsedPathArray = parsePath(urlData.path);

            for (let i = 0; i < parsedPathArray.length - 1; i++) {
                let path = parsedPathArray[i];

                parsedURL = parsedURL.concat(path).concat("/");
                console.log(parsedURL);
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
        pushNewState = true;
    }
});

if(!options) {
    updateOptions();
}
