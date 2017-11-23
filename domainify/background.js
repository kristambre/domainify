function parsePort(port) {
    return port != '' && port != '80' && port != '443' ? ":"+port : '';
}

function parseHost(host) {
    return "//"+host;
}

browser.commands.onCommand.addListener(function(command) {
    if(command == "go-to-root") {
        let tab = browser.tabs.query({ currentWindow: true, active: true });
        
        tab.then(function(tabs) {
            for (let tab of tabs) {
                browser.tabs
                .sendMessage(tab.id, {message: "get-url"})
                .then(response => {
                    let parsedURL = response.protocol // appends ':' by default
                                    + parseHost(response.host) // prepends '//'
                                    + parsePort(response.port); // prepends ':' if port is visible
                    
                    browser.tabs.update({url: parsedURL});
                });
            }
        });
    }
});
