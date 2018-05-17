// import R from 'ramda'

import { makeDebugger, $solver } from '../../utils'
import SR71 from '../../utils/network/sr71'

const sr71$ = new SR71()
let sub$ = null

/* eslint-disable no-unused-vars */
const debug = makeDebugger('L:CommunityBanner')
/* eslint-enable no-unused-vars */

let communityBanner = null

export function onAdd() {}

// ###############################
// Data & Error handlers
// ###############################

const DataSolver = []
const ErrSolver = []

export function init(selectedStore) {
  communityBanner = selectedStore
  debug(communityBanner)
  if (sub$) sub$.unsubscribe()
  sub$ = sr71$.data().subscribe($solver(DataSolver, ErrSolver))
}
