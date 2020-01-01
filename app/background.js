'use strict'

function moveTabsToWindow() {
  chrome.tabs.query({ highlighted: true, currentWindow: true }, tabs => {
    let tabIds = tabs.map(tab => tab.id)
    const incognito = tabs.some(tab => tab.incognito) // if any tabs are incognito play it safe.
    const tabId = tabIds.shift() // use first tab to create new window w/o a empty tab in it
    const createData = { tabId, incognito, state: 'maximized' }

    chrome.windows.create(createData, win => chrome.tabs.move(tabIds, { windowId: win.id, index: -1 }))
  })
}

chrome.browserAction.onClicked.addListener(moveTabsToWindow)
chrome.commands.onCommand.addListener(moveTabsToWindow)

chrome.tabs.onHighlighted.addListener(({ tabIds }) => {
  const text = tabIds.length > 1 ? `${tabIds.length}` : '' // setBadgeText needs a string
  chrome.browserAction.setBadgeText({ text })
})
