let pushNewState = true;
let path = null;
let root = null;
let tabId = null;
let options = null;
let autoEnter = true;
let skipRedirect = false;

browser.runtime.onMessage.addListener(function(message) {
    //options change
    if (message.message == "update-options") {
        updateOptions();
    }

    //new url request
    if (message.message == "new-page") {
        newState(message.root, message.path);
    }

    if(message.message == "redirect-detect") {
        let iter = path;
        while(iter.value != iter.up.value) {
            console.log(iter.value+" == "+message.path);
            if(iter.value == message.path) {
                console.log("detected, redirection: "+message.value);
                iter.redirecting = message.value;
                break;
            }

            iter = iter.up;
        }
    }
});

//tab switch
browser.tabs.onActivated.addListener(function() {
    browser.tabs.sendMessage(tabId,
    {
        message: "set-url",
        newState: false,
        url: root.concat(path.value)
    });

    let currentTab = browser.tabs.query({ currentWindow: true, active: true });
    
    currentTab.then(function(tabs){
        for (let tab of tabs) {
            browser.tabs
            .sendMessage(tab.id, {message: "get-url-data"})
            .then(res => {
                newState(res.root, res.path);
            });
        }
    });

    currentPath = null;
});

function newState(r, p) {
    pushNewState = true;
    path = p;
    root = r;
    browser.tabs.query({ currentWindow: true, active: true }).then(function(tabs) {
        for (let tab of tabs) {
            tabId = tab.id;
        }
    });
}

function updateOptions() {
    browser.storage.sync.get().then(result => {
        autoEnter = result.auto_enter;
        skipRedirect = result.skip_redirect;
    });
}

if(options == null) {
    updateOptions();
}