/*
 *
 * BannerCountBrief
 *
 */

import React from 'react'
import T from 'prop-types'

import { buildLog, toPercentNum } from '@utils'

import {
  Result,
  ResultTop,
  ResultBottom,
  ResultNumber,
  ResultText,
} from './styles'

/* eslint-disable no-unused-vars */
const log = buildLog('c:BannerCountBrief:index')
/* eslint-enable no-unused-vars */

const CountBrief = ({ filteredCount, totalCount, thread, unit }) => {
  if (filteredCount === null || totalCount === filteredCount) {
    return (
      <Result>
        <ResultBottom>
          <ResultText>
            当前共有
            {thread}
          </ResultText>
          <ResultNumber>{totalCount} </ResultNumber>
          <ResultText>{unit}</ResultText>
        </ResultBottom>
      </Result>
    )
  }
  if (filteredCount < 0 && totalCount === 0) {
    return <Result>正在加载, 请稍后...</Result>
  }
  return (
    <Result>
      <ResultTop>
        {thread}
        总数为 {totalCount} {unit}
      </ResultTop>
      <ResultBottom>
        <ResultText>
          符合当前条件的
          {thread}
        </ResultText>
        <ResultNumber>{filteredCount} </ResultNumber>
        <ResultText>
          {unit}, 占比 {toPercentNum(filteredCount, totalCount)}
        </ResultText>
      </ResultBottom>
    </Result>
  )
}

const BannerCountBrief = ({ filteredCount, totalCount, thread, unit }) => (
  <CountBrief
    filteredCount={filteredCount}
    totalCount={totalCount}
    thread={thread}
    unit={unit}
  />
)

BannerCountBrief.propTypes = {
  filteredCount: T.number,
  totalCount: T.number.isRequired,
  unit: T.string,
  thread: T.string,
}

BannerCountBrief.defaultProps = {
  filteredCount: null,
  thread: '帖子',
  unit: '篇',
}

export default BannerCountBrief
