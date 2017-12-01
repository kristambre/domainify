debug("Path loaded.");

let paths = new Map();
let splitter = "/";

//EXAMPLE: we are at https://developer.mozilla.org/en-US/docs/Web/API/Location/
//let p = new Path("/en-US/docs/Web/API/Location/");
//assuming that "up" from that location would be "/en-US/docs/Web/API/" or 1 directory towards the root
//assuming that "down" from the previous location would be back to "/en-US/docs/Web/API/Location/" or 1 directory away from the root
//the last slash is removed
//initially you can only go "up", or 1 directory towards the root.
//in case user tries to go "down" anyway, we set the "down" folder for the original URL as the original URL itself
//now we create a new Path for 1 directory "up" (/en-US/docs/Web/API/)
//the new path "up" will have its' "down" value as the current path
//for URL root, javascript always returns "/" as the path, even if it explicitly doesn't exist
//paths consisting only of the forward slash will be empty based on the removal of the last character
//for this reason, we check the current length. if it's empty, we are at the root
//you cannot go "up" from the root, so we set the root's "up" as the root itself
function Path(path) {
    debug(path);
    path = removeLastCharacterIfNeeded(splitter, path);
    this.value = path;
    this.down = this;
    this.params = ""; //query params

    let p = path.length > 0 ? new Path(path.substr(0, path.lastIndexOf(splitter))) : this;
    p.down = this;
    this.up = p;

    paths.set(this.value, false);
}

function detectRedirection() {
    let responsesGotten = 0;
    debug("Detecting redirection...");

    for (let [p, value] of paths) {
        let url = root.concat(p);
        let xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function() {
            if(xhr.readyState == 4) {
                paths.set(p, url != removeLastCharacterIfNeeded(splitter, xhr.responseURL) || xhr.status != 200);
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
