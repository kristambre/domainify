function save(e) {
    browser.storage.sync.set({
        auto_enter: document.querySelector("#auto_enter").checked
    }).then(res => {
        document.querySelector("#message").innerText = "Saved!";
    });

    browser.runtime.sendMessage({message: "update-options"});

    e.preventDefault();
}

function restoreOptions() {
    let autoEnter = browser.storage.sync.get();
    autoEnter.then(result => {
        document.querySelector("#auto_enter").checked = result.auto_enter ? result.auto_enter : false;
    })
}

document.querySelector("#options_form").addEventListener("submit", save);
document.addEventListener("DOMContentLoaded", restoreOptions);
