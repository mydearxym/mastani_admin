import R from 'ramda'
import { useEffect } from 'react'

import { PAGE_SIZE } from '@config'
import { EVENT, ERR, TYPE } from '@constant'

import {
  asyncSuit,
  buildLog,
  scrollIntoEle,
  countWords,
  send,
  extractMentions,
} from '@utils'

import S from './schema'

/* eslint-disable no-unused-vars */
const log = buildLog('L:Comments')
/* eslint-enable no-unused-vars */

const { SR71, asyncRes, asyncErr, $solver } = asyncSuit
const sr71$ = new SR71()

let sub$ = null
let store = null

/* DESC_INSERTED, ASC_INSERTED */
const defaultArgs = {
  fresh: false,
  filter: { page: 1, size: PAGE_SIZE.D, sort: TYPE.ASC_INSERTED },
}

export const loadComents = (args = {}) => {
  // log('loadComents passed in: ', args)
  args = R.mergeDeepRight(defaultArgs, args)
  args.id = store.viewingData.id
  args.userHasLogin = store.isLogin
  args.thread = store.activeThread

  markLoading(args.fresh)
  store.mark({ filterType: args.filter.sort })

  log('pagedComments args: ', args)
  sr71$.query(S.pagedComments, args)
}

const markLoading = fresh => {
  if (fresh) {
    return store.mark({ loadingFresh: true })
  }
  return store.mark({ loading: true })
}

/* eslint-disable-next-line */
export const createComment = R.curry((cb, e) => {
  if (!store.validator('create')) return false

  store.mark({ creating: true })
  const args = {
    id: store.viewingData.id,
    body: store.editContent,
    thread: store.activeThread,
    community: store.communityRaw,
    mentionUsers: R.map(user => ({ id: user.id }), store.referUsersData),
  }

  log('createComment args: ', args)
  sr71$.mutate(S.createComment, args)
  cb()
})

export function createCommentPreview() {
  store.mark({
    showInputEditor: false,
    showInputPreview: true,
  })
}

export function backToEditor() {
  store.mark({
    showInputEditor: true,
    showInputPreview: false,
  })
}

export function previewReply(data) {
  log('previewReply --> : ', data)
}

export function openInputBox() {
  if (!store.isLogin) return store.authWarning({ hideToast: true })

  store.mark({
    showInputBox: true,
    showInputEditor: true,
  })
}

export function openCommentEditor() {
  store.mark({
    showInputEditor: true,
  })
}

export function onCommentInputBlur() {
  store.mark({
    showInputBox: false,
    showInputPreview: false,
    showInputEditor: false,
  })
}

export function createReplyComment() {
  if (!store.validator('reply')) return false

  sr71$.mutate(S.replyComment, {
    id: store.replyToComment.id,
    body: store.replyContent,
  })
}

export function onCommentInputChange(editContent) {
  store.mark({
    countCurrent: countWords(editContent),
    extractMentions: extractMentions(editContent),
    editContent,
  })
}
export function onReplyInputChange(replyContent) {
  store.mark({
    countCurrent: countWords(replyContent),
    extractMentions: extractMentions(replyContent),
    replyContent,
  })
}

export function openReplyEditor(data) {
  store.mark({
    showReplyBox: true,
    showReplyEditor: true,
    showReplyPreview: false,
    replyToComment: data,
  })
}

export function replyCommentPreview() {
  log('replyCommentPreview')

  store.mark({
    showReplyEditor: false,
    showReplyPreview: true,
  })
}

export function replyBackToEditor() {
  store.mark({
    showReplyEditor: true,
    showReplyPreview: false,
  })
}

export function closeReplyBox() {
  store.mark({
    showReplyBox: false,
    showReplyEditor: false,
    showReplyPreview: false,
  })
}

export function onFilterChange(filterType) {
  store.mark({ filterType })
  loadComents({ filter: { page: 1, sort: filterType } })
}

export function toggleLikeComment(comment) {
  // TODO: check login first
  log('likeComment: ', comment)
  if (comment.viewerHasLiked) {
    return sr71$.mutate(S.undoLikeComment, {
      id: comment.id,
    })
  }
  return sr71$.mutate(S.likeComment, {
    id: comment.id,
  })
}

export function toggleDislikeComment(comment) {
  // TODO: check login first
  if (comment.viewerHasDisliked) {
    return sr71$.mutate(S.undoDislikeComment, {
      id: comment.id,
    })
  }
  return sr71$.mutate(S.dislikeComment, {
    id: comment.id,
  })
}

export function onUploadImageDone(url) {
  send(EVENT.DRAFT_INSERT_SNIPPET, { data: `![](${url})` })
}

export function insertQuote() {
  const data = '> '

  send(EVENT.DRAFT_INSERT_SNIPPET, { data })
}

export function insertCode() {
  const communityRaw = store.curCommunity.raw
  const data = `\`\`\`${communityRaw}\n\n\`\`\``

  send(EVENT.DRAFT_INSERT_SNIPPET, { data })
}

export function onMention(user) {
  log('onMention: ', user)
  store.addReferUser(user)
}

export function deleteComment() {
  sr71$.mutate(S.deleteComment, {
    id: store.tobeDeleteId,
  })
}

// show delete confirm
export function onDelete(comment) {
  store.mark({
    tobeDeleteId: comment.id,
  })
}

export function cancleDelete() {
  store.mark({
    tobeDeleteId: null,
  })
}

export function pageOnChange(page = 1) {
  scrollIntoEle('lists-info')
  loadComents({ filter: { page, sort: store.filterType } })
}

const cancelLoading = () => {
  store.mark({ loading: false, loadingFresh: false, creating: false })
}

// ###############################
// Data & Error handlers
// ###############################
const DataSolver = [
  {
    match: asyncRes('pagedComments'),
    action: ({ pagedComments }) => {
      cancelLoading()
      store.mark({ pagedComments })
    },
  },
  {
    match: asyncRes('createComment'),
    action: () => {
      store.mark({
        showInputBox: false,
        showInputEditor: false,
        editContent: '',
        creating: false,
        loading: false,
      })
      loadComents({
        filter: { page: 1, sort: TYPE.DESC_INSERTED },
        fresh: true,
      })
    },
  },
  {
    match: asyncRes('replyComment'),
    action: ({ replyComment }) => {
      log('replyComment', replyComment)
      store.mark({
        showReplyBox: false,
        replyToComment: null,
      })
      scrollIntoEle('lists-info')
      loadComents({ filter: { page: 1 }, fresh: true })
    },
  },
  {
    match: asyncRes('likeComment'),
    action: ({ likeComment }) =>
      store.updateOneComment(likeComment.id, likeComment),
  },
  {
    match: asyncRes('undoLikeComment'),
    action: ({ undoLikeComment }) =>
      store.updateOneComment(undoLikeComment.id, undoLikeComment),
  },
  {
    match: asyncRes('dislikeComment'),
    action: ({ dislikeComment }) =>
      store.updateOneComment(dislikeComment.id, dislikeComment),
  },
  {
    match: asyncRes('undoDislikeComment'),
    action: ({ undoDislikeComment }) =>
      store.updateOneComment(undoDislikeComment.id, undoDislikeComment),
  },
  {
    match: asyncRes('deleteComment'),
    action: ({ deleteComment }) => {
      log('deleteComment', deleteComment)
      store.mark({ tobeDeleteId: null })
      scrollIntoEle('lists-info')
      loadComents({ filter: { page: 1 }, fresh: true })
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
export const useInit = (_store, ssr) => {
  useEffect(
    () => {
      // log('effect init')
      store = _store
      if (!sub$) {
        sub$ = sr71$.data().subscribe($solver(DataSolver, ErrSolver))
        if (!ssr) loadComents({ filter: { sort: TYPE.DESC_INSERTED } })
      }

      return () => {
        // log('effect uninit')
        if (store.loading || store.loadingFresh || !sub$) return false

        sr71$.stop()
        sub$.unsubscribe()
        sub$ = null
      }
    },
    [_store, ssr]
  )
}
