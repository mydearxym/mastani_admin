import React from 'react'

import { ICON_ASSETS } from '../../config'
import * as logic from './logic'
import { Tag, Popover } from '../../components'

import {
  BannerContentWrapper,
  Result,
  ResultTop,
  ResultBottom,
  ResultNumber,
  ResultText,
  Operation,
  OperationItem,
  OperationDivider,
  OperationTitle,
  FilterTags,
  OperationIcon,
  OperationIconChart,
} from './styles/community_banner'

class IndexBanner extends React.Component {
  componentWillMount() {
    logic.loadCommunities()
  }
  render() {
    const { curCount, totalCount } = this.props
    return (
      <BannerContentWrapper>
        <Result>
          <ResultTop>社区总数总数为 {totalCount} 个</ResultTop>
          <ResultBottom>
            <ResultText>社区共</ResultText>
            <ResultNumber>{curCount}个</ResultNumber>
            <ResultText>项结果符合过滤条件</ResultText>
          </ResultBottom>
        </Result>
        <Operation>
          <OperationItem>
            <OperationIcon path={`${ICON_ASSETS}/cmd/filter2.svg`} />
            <Popover
              content={<div>兼容各个页面的 Filter 菜单</div>}
              trigger="hover"
            >
              <OperationTitle>过滤</OperationTitle>
            </Popover>
            <FilterTags>
              <Tag closable>最多xx</Tag>
              <Tag closable>最少..</Tag>
            </FilterTags>
          </OperationItem>
          <OperationDivider />
          <OperationItem onClick={logic.onAdd}>
            <OperationIconChart path={`${ICON_ASSETS}/cmd/plus.svg`} />
            添加
          </OperationItem>
          <OperationDivider />
          <OperationItem>
            <OperationIcon path={`${ICON_ASSETS}/cmd/chart.svg`} />
            {/* <OperationIconChart path={`${ICON_ASSETS}/cmd/list.svg`} /> */}
            统计
          </OperationItem>
        </Operation>
      </BannerContentWrapper>
    )
  }
}

export default IndexBanner