import { remote } from 'webdriverio'
import fs from 'fs'

async function startBrowser() {
    return await remote({
        capabilities: {
            browserName: 'chrome',
            'goog:chromeOptions': {}
        },
        logLevel: 'warn'
    })
}

/**
 * @param {WebdriverIO.Browser} browser
 * @returns {Promise<Set<string>>}
 */
async function getAllBlogLinks(browser) {
    const links = await browser.$$('a')
    const linkStrings = await Promise.all(links.map(x => x.getAttribute('href')))
    const blogLinks = linkStrings.filter(isBlogPost)
    return new Set(blogLinks)
}

/**
 * @param {WebdriverIO.Browser} browser
 */
async function clickLoadButton(browser) {
    const loadBtn = await browser.$('=LOAD MORE')
    await loadBtn.waitForClickable()
    await loadBtn.click()
}

function isBlogPost(link) {
    return link.startsWith('https://8thlight.com/insights/')
}

/**
 * Returns setA - setB
 * @param {Set} setA
 * @param {Set} setB
 */
function difference(setA, setB) {
    const _difference = new Set(setA)
    for (const elem of setB) {
        _difference.delete(elem);
      }
    return _difference;
}

function appendToFile(linkSet, path) {
    fs.appendFileSync(path, [...linkSet].join('\n'))
}

async function main() {
    const browser = await startBrowser()
    const existingLinks = new Set()
    await browser.url('https://8thlight.com/insights')

    let diff;
    do {
        const allLinks = await getAllBlogLinks(browser)
        diff = difference(allLinks, existingLinks)
        console.log(diff.size)
        appendToFile(diff, 'links.txt')
        existingLinks.add(...diff)
        await clickLoadButton(browser)
        await browser.pause(1000)
    } while (diff.size > 0)

    await browser.deleteSession()
}

await main()
