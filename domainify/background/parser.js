debug("Parser loaded.");

let currentPath = null;

browser.commands.onCommand.addListener(function(command) {
    debug("Shortcut key pressed...");
    domainify(command, false);
});

function domainify(command, forced) {
    debug("");
    debug("================PARSER================");
    debug("Getting current tab...");
    let tab = browser.tabs.query({ currentWindow: true, active: true });

    tab.then(function(tabs) {
        for (let tab of tabs) {
            debug("Parsing...");
            updateTab(command, tab, forced);
        }
    });
}

function updateTab(command, tab, forced) {
    debug("");
    debug("Updating tab with data: ");
    debug({command: command, tab: tab, forced: forced, currentPath: currentPath});

    if(currentPath == null) {
        debug("Current path not assigned, cloning from original...");
        currentPath = Object.assign({}, path);
        debug(currentPath);
    }

    let parsedURL = root.concat(currentPath.value);

    debug("Parsed url: ");
    debug(parsedURL);

    switch (command) {
        case "go-to-root":
            parsedURL = root;

            debug("Path to go to:");
            debug(parsedURL);
            break;
        case "go-up":
            if(skipRedirect) {
                if(redirects == null) {
                    debug("Redirects are not set yet!");
                } else {
                    debug("");
                    debug("Skipping redirects...");
                    while (currentPath.up.value != currentPath.value && redirects.get(currentPath.up.value)) {
                        debug(currentPath.up.value);
                        currentPath = currentPath.up;
                    }
                    debug("Redirects skipped.");
                    debug("");
                }
            }

            parsedURL = root.concat(currentPath.up.value);
            currentPath = currentPath.up;

            debug("Path to go to:");
            debug(parsedURL);

            break;
        case "go-down":
            parsedURL = root.concat(currentPath.down.value);

            if(currentPath.value == currentPath.down.value) {
                debug("Adding params");
                parsedURL = parsedURL.concat(currentPath.params);
            }

            currentPath = currentPath.down;

            debug("Path to go to:");
            debug(parsedURL);
            break;
        case "go-to-current":
            forced = true;
            break;
    }

    if(autoEnter == true || forced == true) {
        debug("Updating tab...");
        currentPath = null;
        browser.tabs.update({url: parsedURL});
    } else {
        debug("Updating tab without submitting...");
        browser.tabs.sendMessage(tab.id, {message: "set-url", url: parsedURL});
    }
}
