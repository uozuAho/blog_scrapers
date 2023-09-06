import { remote } from 'webdriverio'

const browser = await remote({
    capabilities: {
        browserName: 'chrome',
        'goog:chromeOptions': {
            args: process.env.CI ? ['headless', 'disable-gpu'] : []
        }
    }
})

await browser.fullscreenWindow()
await browser.url('https://webdriver.io')

await browser.fullscreenWindow()
const apiLink = await browser.$('=API')
await apiLink.click()

await browser.saveScreenshot('./screenshot.png')
await browser.deleteSession()
