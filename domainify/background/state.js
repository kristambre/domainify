let pushNewState = true;
let path = null;
let options;
let autoEnter = true;

browser.runtime.onMessage.addListener(function(message) {
    //options change
    if (message.message == "update-options") {
        updateOptions();
    }

    //new url request
    if (message.message == "reset-state") {
        resetState();
    }
});

//tab switch
browser.tabs.onActivated.addListener(function() {
    resetState();
});

function resetState() {
    pushNewState = true;
    path = null;
}

function updateOptions() {
    browser.storage.sync.get().then(result => {
        autoEnter = result.auto_enter;
    });
}

if(!options) {
    updateOptions();
}