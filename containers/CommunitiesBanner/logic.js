// import R from 'ramda'
// import Router from 'next/router'
import { useEffect } from 'react'

import { EVENT, ERR, TYPE } from '@constant'
import { asyncSuit, buildLog, send } from '@utils'

import S from './schema'

/* eslint-disable no-unused-vars */
const log = buildLog('L:communitiesBanner')
/* eslint-enable no-unused-vars */

const { SR71, asyncRes, asyncErr, $solver } = asyncSuit
const sr71$ = new SR71({
  recieve: [EVENT.PREVIEW_CLOSE],
})

let store = null
let sub$ = null

export function loadCommunities() {
  sr71$.query(S.pagedCommunities, { filter: {}, userHasLogin: false })
}

export function loadTags() {
  sr71$.query(S.pagedTags, { filter: {} })
}

export function loadThreads() {
  sr71$.query(S.pagedThreads, { filter: {} })
}

export function loadPosts() {
  sr71$.query(S.pagedPosts, { filter: {} })
}

export function loadJobs() {
  sr71$.query(S.pagedJobs, { filter: {} })
}

export const loadCategories = () =>
  sr71$.query(S.pagedCategories, { filter: {} })

export const onSearch = () => {
  log('TODO:  onSearch')
}

export function onAdd(thread) {
  switch (thread) {
    case 'tags': {
      return send(EVENT.NAV_CREATE_TAG, {
        type: TYPE.PREVIEW_CREATE_TAG,
      })
    }
    case 'categories': {
      return send(EVENT.NAV_CREATE_CATEGORY, {
        type: TYPE.PREVIEW_CREATE_CATEGORY,
      })
    }
    case 'threads': {
      return send(EVENT.NAV_CREATE_THREAD, {
        type: TYPE.PREVIEW_CREATE_THREAD,
      })
    }
    default: {
      log('onAdd default: ', thread)
      return send(EVENT.NAV_CREATE_COMMUNITY, {
        type: TYPE.PREVIEW_CREATE_COMMUNITY,
      })
    }
  }
}

const DataSolver = [
  {
    match: asyncRes('pagedCommunities'),
    action: ({ pagedCommunities: { totalCount } }) =>
      store.mark({ totalCount }),
  },
  {
    match: asyncRes('pagedTags'),
    action: ({ pagedTags: { totalCount } }) =>
      store.mark({ tagsTotalCount: totalCount }),
  },
  {
    match: asyncRes('pagedThreads'),
    action: ({ pagedThreads: { totalCount } }) =>
      store.mark({ threadsTotalCount: totalCount }),
  },
  {
    match: asyncRes('pagedCategories'),
    action: ({ pagedCategories: { totalCount } }) => {
      log('get pagedCategories: ', totalCount)
      store.mark({ categoriesTotalCount: totalCount })
    },
  },
  {
    match: asyncRes('pagedPosts'),
    action: ({ pagedPosts: { totalCount: postsTotalCount } }) =>
      store.mark({ postsTotalCount }),
  },
  {
    match: asyncRes('pagedJobs'),
    action: ({ pagedJobs: { totalCount: jobsTotalCount } }) =>
      store.mark({ jobsTotalCount }),
  },
  {
    match: asyncRes(EVENT.PREVIEW_CLOSE),
    action: res => {
      const closeType = res[EVENT.PREVIEW_CLOSE].type
      switch (closeType) {
        case TYPE.COMMUNITIES_REFRESH: {
          return loadCommunities()
        }
        case TYPE.TAGS_REFRESH: {
          return loadTags()
        }
        case TYPE.GATEGORIES_REFRESH: {
          return loadCategories()
        }
        default: {
          log('unknow event: ', closeType)
          /* return loadPosts() */
        }
      }
    },
  },
]

const ErrSolver = [
  {
    match: asyncErr(ERR.CRAPHQL),
    action: ({ details }) => {
      log('ERR.CRAPHQL -->', details)
    },
  },
  {
    match: asyncErr(ERR.TIMEOUT),
    action: ({ details }) => {
      log('ERR.TIMEOUT -->', details)
    },
  },
  {
    match: asyncErr(ERR.NETWORK),
    action: ({ details }) => {
      log('ERR.NETWORK -->', details)
    },
  },
]

// ###############################
// init & uninit
// ###############################
export const useInit = _store => {
  useEffect(
    () => {
      store = _store
      if (sub$) return false // loadCommunities() // loadCategories()
      sr71$.data().subscribe($solver(DataSolver, ErrSolver))

      return () => {
        if (!sub$) return false
        log('===== do uninit')
        sub$.unsubscribe()
        sub$ = null
      }
    },
    [_store]
  )
}
