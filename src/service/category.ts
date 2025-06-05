import { http } from '@/utils/http'
export const getCategories = () => {
  return http<CategoryVO[]>({
    method: 'GET',
    url: '/content/api/category/list',
  })
}

export const getCategoriyPage = () => {
  return http<CategoryVO[]>({
    method: 'GET',
    url: '/content/api/category/list',
  })
}
