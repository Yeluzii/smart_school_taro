import Taro from '@tarojs/taro'
import { useEffect, useState } from 'react'
import { Swiper, SwiperItem, ScrollView, View, Image, Text } from '@tarojs/components'
import { AtIcon, AtNoticebar } from 'taro-ui' // 引入Taro UI组件
import { fetchBannerNews, fetchAnnouncement, fetchCampusNews } from '@/service/news'
import './index.scss'

interface NewsVO {
  id: number
  title: string
  content: string
  cover: string
  createTime: string
}

export default function NewsHomePage() {
  const [banners, setBanners] = useState<NewsVO[]>([])
  const [announcements, setAnnouncements] = useState<NewsVO[]>([])
  const [campusNews, setCampusNews] = useState<NewsVO[]>([])

  // 加载数据
  const fetchData = async () => {
    const [bannerRes, announcementRes, campusRes] = await Promise.all([
      fetchBannerNews(),
      fetchAnnouncement(),
      fetchCampusNews(),
    ])

    if (bannerRes.code === 0) setBanners(bannerRes.data)
    if (announcementRes.code === 0) setAnnouncements(announcementRes.data)
    if (campusRes.code === 0) setCampusNews(campusRes.data)
  }

  useEffect(() => {
    fetchData()
  }, [])

  // 跳转详情
  const goToDetail = (id: number) => {
    Taro.navigateTo({ url: `/pages/news/index?id=${id}` })
  }

  return (
    <View className="news-container">
      {/* 顶部轮播图 - 现代卡片式设计 */}
      <View className="banner-wrapper">
        <Swiper
          className="modern-banner"
          indicatorDots
          indicatorColor="rgba(255,255,255,0.4)"
          indicatorActiveColor="#fff"
          circular
          autoplay
          interval={5000}
        >
          {banners.map(item => (
            <SwiperItem key={item.id} onClick={() => goToDetail(item.id)}>
              <View className="banner-item">
                <Image className="banner-image" src={item.cover} mode="aspectFill" />
                <View className="banner-overlay">
                  <Text className="banner-title">{item.title}</Text>
                </View>
              </View>
            </SwiperItem>
          ))}
        </Swiper>
      </View>

      {/* 公告区域 - 使用Taro UI的Noticebar */}
      <View className="section">
        <View className="section-header">
          <AtIcon value="bell" size="18" color="#6190E8"></AtIcon>
          <Text className="section-title">最新公告</Text>
        </View>
        <AtNoticebar className="modern-noticebar" icon="bell" marquee single>
          {announcements.map(item => (
            <Text key={item.id} className="notice-item" onClick={() => goToDetail(item.id)}>
              {item.content}
            </Text>
          ))}
        </AtNoticebar>
      </View>

      {/* 校园新闻 - 卡片式布局 */}
      <View className="section">
        <View className="section-header">
          <AtIcon value="file-generic" size="18" color="#6190E8"></AtIcon>
          <Text className="section-title">校园新闻</Text>
        </View>

        <View className="news-grid">
          {campusNews.map(item => (
            <View key={item.id} className="news-card" onClick={() => goToDetail(item.id)}>
              <Image className="news-cover" src={item.cover} mode="aspectFill" />
              <View className="news-content">
                <Text className="news-title">{item.title}</Text>
                <Text className="news-excerpt">{getExcerpt(item.content, 60)}</Text>
                <View className="news-footer">
                  <AtIcon value="clock" size="12" color="#999"></AtIcon>
                  <Text className="news-time">{formatDate(item.createTime)}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  )
}

// 提取富文本中的纯文本
const getExcerpt = (html: string, maxLength: number = 80) => {
  const regex = /<[^>]+>/g
  const text = html.replace(regex, '')
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + '...'
  }
  return text
}

const formatDate = (dateString: string) => {
  // 替换空格为"T"，或者用 "/" 替换 "-" 使其符合支持格式
  const safeDateString = dateString.replace(' ', 'T') // 格式： "2025-06-05T20:33:31"
  const date = new Date(safeDateString)
  return `${date.getMonth() + 1}-${date.getDate()}`
}
