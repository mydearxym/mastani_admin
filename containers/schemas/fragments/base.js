export const community = `
  id
  title
  raw
  index
  desc
  logo
`
export const post = `
  id
  title
  insertedAt
  updatedAt
  views
`
export const job = `
  id
  title
  desc
  company
  companyLogo
  views
  linkAddr
  copyRight

  salary
  education
  exp
  finance
  field
  scale

  insertedAt
  updatedAt
`
export const video = `
  id
  title
  poster
  desc
  duration
  source
  views
  originalAuthor
  originalAuthorLink
  publishAt
  insertedAt
  updatedAt
`
export const repo = `
  id
  views
  title
  ownerName
  desc
  insertedAt
  prsCount
  forkCount
  starCount
  license
  primaryLanguage {
    color
    name
  }
  contributors {
    avatar
    htmlUrl
    nickname
  }
`
export const tag = `
  id
  title
  color
  thread
  topic {
    id
    raw
  }
`
export const author = `
  id
  login
  nickname
  avatar
`
export const userSocial = `
  qq
  weibo
  weichat
  github
  zhihu
  douban
  twitter
  facebook
  dribble
  instagram
  pinterest
  huaban
`
export const user = `
  ${author}
  sex
  bio
  location
  social {
    ${userSocial}
  }
  followersCount
  followingsCount
`
export const c11n = `
  bannerLayout
  contentsLayout
  contentDivider
  markViewed
  displayDensity
`
export const achievement = `
  reputation
  contentsStaredCount
  contentsFavoritedCount
  donateMember
  seniorMember
  sponsorMember
`
export const userBackgrounds = `
  workBackgrounds {
    company
    title
  }
  educationBackgrounds {
    school
    major
  }
`
export const userContributes = `
  records {
    count
    date
  }
  startDate
  endDate
  totalCount
`

// comment
export const comment = `
  id
  body
  floor
  author {
    ${author}
  }
  likesCount
  dislikesCount
  insertedAt
  updatedAt
`
export const commentParent = `
  id
  title
  commentsCount
  author {
    ${author}
  }
  communities {
    id
    title
    logo
    raw
  }
`
export const pagedCounts = `
  totalPages
  totalCount
  pageSize
  pageNumber
`
