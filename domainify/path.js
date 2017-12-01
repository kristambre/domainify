debug("Path loaded.");

let paths = new Map();

function Path(path, splitter, next) {
    path = removeLastCharacterIfNeeded(splitter, path);
    this.value = path;

    paths.set(this.value, false);
    debug(path);

    this.up = path.length > 0 ? new Path(path.substr(0, path.lastIndexOf(splitter)), splitter, this) : this;
    this.down = next == null ? this : next;
}

function detectRedirection() {
    let responsesGotten = 0;
    debug("Detecting redirection...");

    for (let [p, value] of paths) {
        let url = root.concat(p);
        let xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function() {
            if(xhr.readyState == 4) {
                paths.set(p, (url != removeLastCharacterIfNeeded("/", xhr.responseURL)));
                debug("Path: "+p+", redirecting: "+paths.get(p));
                responsesGotten++;

                if(responsesGotten == paths.size) {
                    debug("All paths detected.");
                    browser.runtime.sendMessage({
                        message: "redirect-detect",
                        value: paths
                    });
                }
            }
        }

        xhr.open('GET', url, true);
        xhr.send(null);
    }
}

function removeLastCharacterIfNeeded(char, string) {
    return string.endsWith(char) ? string.substr(0, string.length - 1) : string;
}
