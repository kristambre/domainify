let pushNewState = true;
let path = null;
let root = null;
let tabId = null;
let options = null;
let autoEnter = true;

browser.runtime.onMessage.addListener(function(message) {
    //options change
    if (message.message == "update-options") {
        updateOptions();
    }

    //new url request
    if (message.message == "new-page") {
        newState(message.root, message.path);
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
    });
}

if(options == null) {
    updateOptions();
}