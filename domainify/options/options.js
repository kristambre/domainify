function saveOptions(e) {
  let color = document.querySelector("#colour").value;
  browser.storage.sync.set({
    colour: color
  });

  document.querySelector("#current-color").innerText = color;
  window.location.reload();

  e.preventDefault();
}

function restoreOptions() {
  var gettingItem = browser.storage.sync.get('colour');
  gettingItem.then((res) => {
    document.querySelector("#current-colour").innerText = res.colour || 'none';
  });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);