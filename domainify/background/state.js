let path = null;
let root = null;
let tabId = null;
let options = null;

let redirects = null;

let autoEnter = true;
let skipRedirect = false;
let deb = false;

debug("State loaded.");

browser.runtime.onMessage.addListener(function(message) {
    debug("");
    debug("================STATE================");
    debug("Got: ");
    debug(message);
    //options change
    if (message.message == "update-options") {
        debug("Refreshing options...");
        updateOptions();
    }

    //new url request
    if (message.message == "new-page") {
        debug("Initializing for new page...");
        newState(message.root, message.path);

        return Promise.resolve({
            skipRedirect: skipRedirect
        })
    }

    if(message.message == "redirect-detect") {
        debug("Setting redirect values...");
        redirects = message.value;
    }

    debug("");
});

//tab switch
browser.tabs.onActivated.addListener(handleSwitching);

//window switch
browser.windows.onFocusChanged.addListener(handleSwitching);

function handleSwitching() {
    debug("");
    debug("================STATE================");
    debug("Tab/window switched");
    debug("Resetting old tab back to original value...");
    browser.tabs.sendMessage(tabId,
        {
            message: "set-url",
            url: root.concat(path.value).concat(path.params)
        });

    debug("Getting current tab...");
    let currentTab = browser.tabs.query({ currentWindow: true, active: true });

    currentTab.then(function(tabs){
        for (let tab of tabs) {
            browser.tabs
                .sendMessage(tab.id, {message: "get-url-data"})
                .then(res => {
                    debug("Current tab url data: ");
                    debug(res);
                    newState(res.root, res.path);
                });
        }
    });

    debug("");
}

function newState(r, p) {
    debug("Resetting state...");
    path = p;
    root = r;
    currentPath = null;
    browser.tabs.query({ currentWindow: true, active: true }).then(function(tabs) {
        for (let tab of tabs) {
            debug("Current tab id: "+tab.id);
            tabId = tab.id;
        }
    });
}

function updateOptions() {
    browser.storage.sync.get().then(result => {
        debug("Got options from storage: ");
        debug(result);

        autoEnter = result.auto_enter;
        skipRedirect = result.skip_redirect;
        deb = result.debug;
    });
}

function debug(msg) {
    if(deb) {
        console.log(msg);
    }
}

if(options == null) {
    updateOptions();
}