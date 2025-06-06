import { http } from '@/utils/http'
import { NewsDetailResult, NewsListResult } from '../../types/news'

// 获取轮播图新闻
export const fetchBannerNews = () => {
  return http<NewsListResult>({
    url: '/new/news/banners',
    method: 'GET',
  })
}

// 获取公告列表
export const fetchAnnouncement = () => {
  return http<NewsListResult>({
    url: '/new/news/announcement',
    method: 'GET',
  })
}

// 获取校园资讯
export const fetchCampusNews = () => {
  return http<NewsListResult>({
    url: '/new/news/campus',
    method: 'GET',
  })
}

// 获取新闻详情
export const fetchNewsDetails = (id: number) => {
  return http<NewsDetailResult>({
    url: `/new/news/details?id=${id}`,
    method: 'GET',
  })
}
