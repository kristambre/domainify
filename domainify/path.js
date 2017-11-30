let paths = [];

function Path(path, splitter, next) {
    path = removeLastCharacterIfNeeded(splitter, path);
    this.value = path;
    this.redirecting = false;

    paths.push(this);

    this.up = path.length > 0 ? new Path(path.substr(0, path.lastIndexOf(splitter)), splitter, this) : this;
    this.down = next == null ? this : next;
}

function detectRedirection() {
    let responsesGotten = 0;

    for (let p of paths) {
        let url = root.concat(p.value);
        let xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function() {
            if(xhr.readyState == 4) {
                p.redirecting = (url != removeLastCharacterIfNeeded("/", xhr.responseURL));
                responsesGotten++;

                if(responsesGotten == paths.length) {
                    browser.runtime.sendMessage({
                        message: "redirect-detect",
                        value: path
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
