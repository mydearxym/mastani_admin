/*
 *
 * Sidebar
 *
 */
import React from 'react'
import shortid from 'shortid'
import { inject, observer } from 'mobx-react'

import { makeDebugger, storePlug } from '../../utils'
import { ICON_ASSETS } from '../../config'

import CommunityMenuItem from './CommunityMenuItem'
import CommunitiesRootMenuItem from './CommunitiesRootMenuItem'
import UsersRootMenuItem from './UsersRootMenuItem'

import {
  Sidebar,
  Banner,
  Footer,
  BannerLogo,
  BannerTitle,
  SearchLogo,
} from './styles'

import { MenuItem } from './styles/menu'
import * as logic from './logic'

/* eslint-disable no-unused-vars */
const debug = makeDebugger('C:Sidebar:index')
/* eslint-enable no-unused-vars */

const MenuList = ({ items, activeRaw, activePart }) => {
  const listItems = (
    <div>
      <CommunitiesRootMenuItem activeRaw={activeRaw} activePart={activePart} />
      <UsersRootMenuItem activeRaw={activeRaw} activePart={activePart} />

      {items.map(item => (
        <CommunityMenuItem
          key={shortid.generate()}
          item={item}
          activeRaw={activeRaw}
          activePart={activePart}
        />
      ))}
    </div>
  )
  return <MenuItem>{listItems}</MenuItem>
}

class SidebarContainer extends React.Component {
  componentDidMount() {
    logic.init(this.props.sidebar)
  }

  render() {
    const { sidebar } = this.props
    const { curPath, subscribedCommunities, activeRaw, activePart } = sidebar
    //    onMouseLeave={logic.leaveSidebar}
    // onMouseLeave is not unreliable in chrome: https://github.com/facebook/react/issues/4492

    return (
      <Sidebar>
        <Banner>
          <BannerLogo path={`${ICON_ASSETS}/cmd/rainbow_logo.svg`} />
          <BannerTitle onClick={logic.loadCommunities}>
            CPS 管理后台 @2018
          </BannerTitle>
        </Banner>
        <MenuList
          items={subscribedCommunities}
          curPath={curPath}
          activeRaw={activeRaw}
          activePart={activePart}
        />
        <Footer>
          <SearchLogo path={`${ICON_ASSETS}/cmd/search2.svg`} />
          <BannerTitle>综合搜索等</BannerTitle>
        </Footer>
      </Sidebar>
    )
  }
}

export default inject(storePlug('sidebar'))(observer(SidebarContainer))
