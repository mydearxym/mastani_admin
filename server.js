const dev = process.env.NODE_ENV !== 'production'
// const goal = process.env.GOAL

const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const mobxReact = require('mobx-react')
const pathMatch = require('path-match')
const { basename } = require('path')
const accepts = require('accepts')
const glob = require('glob')

const app = next({ dev })
const handle = app.getRequestHandler()
const route = pathMatch()

// const moduleAlias = require('module-alias')
// For the development version, we'll use React.
// Because, it support react hot loading and so on.
/*
   if (!dev) {
   moduleAlias.addAlias('react', 'preact-compat')
   moduleAlias.addAlias('react-dom', 'preact-compat')
   }
 */

// const langMatch = route('/lang/:name')
mobxReact.useStaticRendering(true)

const supportLanguages = glob
  .sync('./lang/*.json')
  .map(f => basename(f, '.json'))

const messageCache = new Map()
const getMessages = locale => {
  if (!messageCache.has(locale)) {
    /* eslint-disable import/no-dynamic-require */
    /* eslint-disable global-require */
    let langData = {}

    try {
      langData = require(`./lang/${locale}.json`)
      messageCache.set(locale, langData)
    } catch (e) {
      return { error: 'this lang is not supported' }
    }
  }
  return messageCache.get(locale)
}

// communities view for root
const communitiesQuery = route('/communities')
const communitiesSubQuery = route('/communities/:sub')
// users view for root
const usersQuery = route('/users')
const usersSubQuery = route('/users/:sub')
// const communityQuery = route('/:main')
const communityQuery = route('/:main')
const communitySubQuery = route('/:main/:sub')
const localeQuery = route('/locale/:lang')

app.prepare().then(() => {
  createServer((req, res) => {
    const { pathname } = parse(req.url)
    /* console.log('---------> server parse(req.url): ', parse(req.url)) */
    // const homeMatch = homeQuery(pathname)
    /* const communitiesMatch = communitiesQuery(pathname) */
    /* const communitiesSubMatch = communitiesSubQuery(pathname) */
    /* const usersMatch = usersQuery(pathname) */
    /* const usersSubMatch = usersSubQuery(pathname) */
    /* const localeMatch = localeQuery(pathname) */

    const communityMatch = communityQuery(pathname)
    const communitySubMatch = communitySubQuery(pathname)

    const accept = accepts(req)
    const locale = accept.language(supportLanguages) // 'zh'

    if (localeQuery(pathname)) {
      res.setHeader('Content-Type', 'application/json;charset=utf-8')
      return res.end(JSON.stringify(getMessages(localeQuery(pathname).lang)))
    } else if (communitiesQuery(pathname) || communitiesSubQuery(pathname)) {
      return app.render(req, res, '/communities')
    } else if (usersQuery(pathname) || usersSubQuery(pathname)) {
      return app.render(req, res, '/users')
    } else if (communityMatch) {
      return app.render(req, res, '/', communityMatch)
    } else if (communitySubMatch) {
      return app.render(req, res, '/', communitySubMatch)
    }
    /*
  } else if (communityMatch) {
    return app.render(req, res, '/', communityMatch)
  } else if (communitySubMatch) {
    return app.render(req, res, '/', communitySubMatch)
  }
    */

    /*
       if (homeMatch) {
       return app.render(req, res, '/', homeMatch)
       }
     */
    // now index page go this way
    req.locale = locale
    req.messages = getMessages(locale)

    return handle(req, res)
  }).listen(3001, err => {
    if (err) throw err
    console.log('> Ready on http://localhost:3001')
  })
})
