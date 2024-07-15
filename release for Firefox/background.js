listenPopupMessages();

//////////////// functions

async function getExtensionEnabled() {
  let extensionEnabled = await getStorageData("extensionEnabled");
  if (extensionEnabled === undefined) {
    extensionEnabled = true;
  }
  return extensionEnabled;
}

function setExtensionEnabled(value) {
  browser.storage.local.set({ extensionEnabled: value }, function () {
    console.log("data saved");
  });
}

function listenPopupMessages() {
  browser.runtime.onMessage.addListener(function (
    request,
    sender,
    sendResponse
  ) {
    // console.log("request", request);
    if (request === "get-extension-enabled") {
      (async () => {
        const extensionEnabled = await getExtensionEnabled();
        sendResponse(extensionEnabled);
      })();
    } else if (request.hasOwnProperty("extensionEnabled")) {
      setExtensionEnabled(request.extensionEnabled);
    }
    // prevents lastError, this function cannot be async
    return true;
  });
}

function getStorageData(sKey) {
  return new Promise(function (resolve, reject) {
    browser.storage.local.get(sKey, function (items) {
      if (browser.runtime.lastError) {
        console.error(browser.runtime.lastError.message);
        reject(browser.runtime.lastError.message);
      } else {
        resolve(items[sKey]);
      }
    });
  });
}
