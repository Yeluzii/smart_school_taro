export interface NewsVO {
  id: number
  title: string
  content: string
  cover: string
  createTime: string
}

export interface NewsListResult {
  code: number
  msg: string
  data: NewsVO[]
}

export interface NewsDetailResult {
  code: number
  msg: string
  data: NewsVO
}
