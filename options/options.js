function save(e) {
    browser.storage.sync.set({
        auto_enter: document.querySelector("#auto_enter").checked,
        skip_redirect: document.querySelector("#skip_redirect").checked
    }).then(res => {
        document.querySelector("#message").innerText = "Saved!";
    });

    browser.runtime.sendMessage({message: "update-options"});

    e.preventDefault();
}

function restoreOptions() {
    let options = browser.storage.sync.get();
    options.then(result => {
        document.querySelector("#auto_enter").checked = result.auto_enter ? result.auto_enter : false;
        document.querySelector("#skip_redirect").checked = result.skip_redirect ? result.skip_redirect : false;
    })
}

document.querySelector("#options_form").addEventListener("submit", save);
document.addEventListener("DOMContentLoaded", restoreOptions);
