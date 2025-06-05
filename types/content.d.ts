type CategoryVO = {
  id: number
  name: string
  cover: string
  createTime: string
}
type NoteVO = {
  id: number
  userId: number
  title: string
  content: string
  tags: string[]
  createTime: string
}

type NoteDetailVO = {
  id: number
  userId: number
  title: string
  content: string
  tags: string[]
  createTime: string
  nickname: string
  avatar: string
}

type PageParams = {
  page?: number
  limit?: number
}

type NotePageVO = {
  list: NoteVO[]
  total: number
}

type NoteQuery = {
  title?: string
  page: number
  limit: number
}

type NoteDTO = {
  userId: number
  categoryId: number
  title: string
  content: string
  tags: string[]
}
