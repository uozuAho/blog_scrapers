/**
 * Scrape all blog links from 8thlight.com/insights
 *
 * Node runs out of memory before all posts are loaded. Dunno why. It gets
 * slower as more posts are loaded, perhaps because the DOM is getting bigger
 * and bigger. It manages to load 300 posts, that'll do for now.
 *
 * Maybe:
 * - manually make requests to load more blogs instead of clicking the button
 */


import fs from 'fs'

async function startBrowser() {
    const remote = require('webdriverio').remote;
    return await remote({
        capabilities: {
            browserName: 'chrome',
            'goog:chromeOptions': {}
        },
        logLevel: 'warn'
    })
}

async function getAllBlogLinks(browser: WebdriverIO.Browser): Promise<Set<string>> {
    const links = await browser.$$('a')
    const linkStrings = await Promise.all(links.map((x: any) => x.getAttribute('href')))
    const blogLinks = linkStrings.filter(isBlogPost)
    return new Set(blogLinks)
}

/**
 * @param {WebdriverIO.Browser} browser
 */
async function clickLoadButton(browser: WebdriverIO.Browser) {
    const loadBtn = await browser.$('=LOAD MORE')
    await loadBtn.waitForClickable()
    await loadBtn.click()
}

function isBlogPost(link: string) {
    return link.startsWith('https://8thlight.com/insights/')
}

/**
 * Returns setA - setB
 * @param {Set} setA
 * @param {Set} setB
 */
function difference(setA: Set<string>, setB: Set<string>) {
    const _difference = new Set(setA)
    for (const elem of setB) {
        _difference.delete(elem);
      }
    return _difference;
}

function appendToFile(links: Set<string>, path: string) {
    fs.appendFileSync(path, [...links].join('\n') + '\n')
}

async function main() {
    const browser = await startBrowser()
    const existingLinks: Set<string> = new Set()
    await browser.url('https://8thlight.com/insights')

    let diff;
    do {
        const allLinks = await getAllBlogLinks(browser)
        diff = difference(allLinks, existingLinks)
        console.log(diff.size)
        appendToFile(diff, 'links.txt')
        for (const d of diff) {
            existingLinks.add(d)
        }
        await clickLoadButton(browser)
        await browser.pause(1000)
    } while (diff.size > 0)

    await browser.deleteSession()
}

main().then(() => console.log('done'));
