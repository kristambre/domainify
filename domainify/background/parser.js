let currentPath = null;

browser.commands.onCommand.addListener(function(command) {
    domainify(command, false);
});

function domainify(command, forced) {
    let tab = browser.tabs.query({ currentWindow: true, active: true });

    tab.then(function(tabs) {
        for (let tab of tabs) {
            updateTab(command, tab, forced);
        }
    });
}

function updateTab(command, tab, forced) {
    if(currentPath == null) {
        currentPath = Object.assign({}, path);
    }

    let parsedURL = root.concat(currentPath.value);

    switch (command) {
        case "go-to-root":
            parsedURL = root;
            break;
        case "go-up":
            if(skipRedirect) {
                while(currentPath.up.value == currentPath.value || currentPath.up.redirecting) {
                    currentPath = currentPath.up;
                }
            }
            parsedURL = root.concat(currentPath.up.value);
            currentPath = currentPath.up;
            break;
        case "go-down":
            parsedURL = root.concat(currentPath.down.value);
            currentPath = currentPath.down;
            break;
        case "go-to-current":
            forced = true;
            break;
    }

    if(autoEnter == true || forced == true) {
        currentPath = null;
        browser.tabs.update({url: parsedURL});
    } else {
        browser.tabs.sendMessage(tab.id, {message: "set-url", url: parsedURL, newState: pushNewState});
        pushNewState = false;
    }
}
