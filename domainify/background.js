function parsePort(port) {
    return port != '' && port != '80' && port != '443' ? ":"+port : '';
}

function parseHost(host) {
    return "//"+host;
}

function parsePath(path) {
    return path.split("/");
}

browser.commands.onCommand.addListener(function(command) {
    let tab = browser.tabs.query({ currentWindow: true, active: true });

    tab.then(function(tabs) {
                for (let tab of tabs) {
                    browser.tabs
                    .sendMessage(tab.id, {message: "get-url"})
                    .then(response => {
                        updateTab(response, command);
                    });
                }
            });
});

function updateTab(urlData, command) {
    let parsedURL = '';

    switch (command) {
        case "go-to-root":        
            parsedURL = urlData.protocol // appends ':' by default
                                        + parseHost(urlData.host) // prepends '//'
                                        + parsePort(urlData.port); // prepends ':' if port is visible
            break;
        case "go-up":
            parsedURL = urlData.protocol // appends ':' by default
                                        + parseHost(urlData.host) // prepends '//'
                                        + parsePort(urlData.port); // prepends ':' if port is visible

            let parsedPathArray = parsePath(urlData.path);

            for (let i = 0; i < parsedPathArray.length - 1; i++) {
                let path = parsedPathArray[i];
                
                if (path != '') {
                    parsedURL = parsedURL.concat("/").concat(path);
                }
            }

            break;
        }

    browser.tabs.update({url: parsedURL});

}

browser.browserAction.onClicked.addListener(function() {
    browser.runtime.openOptionsPage();
});
