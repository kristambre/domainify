debug("Other loaded.");

browser.browserAction.onClicked.addListener(function() {
    debug("Button clicked");
    domainify("go-up", true);
});

browser.menus.create({
    id: "root",
    contexts: ["browser_action"],
    title: "Go to root",
    type: "normal"
});

browser.menus.create({
    id: "options",
    contexts: ["browser_action"],
    title: "Options",
    type: "normal"
});

browser.menus.onClicked.addListener((info, tab) => {
    switch(info.menuItemId) {
        case "options":
            browser.runtime.openOptionsPage();
            break;
        case "root":
            domainify("go-to-root", true);
            break;
    };
});