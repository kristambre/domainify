browser.runtime.onMessage.addListener(function(message) {
    if(message.message == "get-url") {
        let url = window.location.href;
        let host = window.location.hostname;
        let path = window.location.pathname;
        let protocol = window.location.protocol;
        let port = window.location.port;

        return Promise.resolve({
            url: url,
            host: host,
            path: path,
            protocol: protocol,
            port: port
        });
    }
});
