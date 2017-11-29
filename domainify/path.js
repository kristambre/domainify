function Path(path, splitter, next) {
    path = removeLastCharacterIfNeeded(splitter, path);
    this.value = path;
    this.redirecting = detectRedirection(this.value, this.splitter);
    this.up = path.length > 0 ? new Path(path.substr(0, path.lastIndexOf(splitter)), splitter, this) : this;
    this.down = next == null ? this : next;
}

function detectRedirection(value, splitter) {
    let url = root.concat(value);
    let xhr = new XMLHttpRequest();
    
    xhr.onreadystatechange = function() {
        if(xhr.readyState == 4) {
            browser.runtime.sendMessage({
                message: "redirect-detect",
                path: value,
                value: (url != removeLastCharacterIfNeeded("/", xhr.responseURL))
            });
        }
    }
    xhr.open('GET', url, true);
    xhr.send(null);
}

function removeLastCharacterIfNeeded(char, string) {
    return string.endsWith(char) ? string.substr(0, string.length - 1) : string;
}
