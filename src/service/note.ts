import { http } from '@/utils/http'
import Taro from '@tarojs/taro'

export const getNotesPage = (data: NoteQuery) => {
  return http<NotePageVO>({
    method: 'GET',
    url: '/content/api/note/page',
    data,
    header: {
      Authorization: Taro.getStorageSync('token'),
    },
  })
}

export const getNotesCategory = (categoryId: number, data: NoteQuery) => {
  return http<NotePageVO>({
    method: 'GET',
    url: `/content/api/note/category?categoryId=${categoryId}`,
    data,
  })
}

export const getNoteDetail = (id: number) => {
  return http<NoteDetailVO>({
    method: 'GET',
    url: `/content/api/note/${id}`,
  })
}

export const publishNote = (data: NoteDTO) => {
  return http<boolean>({
    method: 'POST',
    url: '/content/api/note/publish',
    data,
  })
}
