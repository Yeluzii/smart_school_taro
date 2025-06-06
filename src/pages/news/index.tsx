import { View, Text, RichText, Image } from '@tarojs/components'
import { useEffect, useState } from 'react'
import { fetchNewsDetails } from '@/service/news'
import Taro from '@tarojs/taro'
import { AtIcon, AtActivityIndicator } from 'taro-ui'
import './index.scss'

interface NewsVO {
  id: number
  title: string
  content: string
  cover: string
  createTime: string
}

export default function NewsDetailPage() {
  const [news, setNews] = useState<NewsVO | null>(null)
  const [loading, setLoading] = useState(true)
  const id = parseInt(Taro.getCurrentInstance().router?.params.id || '0', 10)

  useEffect(() => {
    setLoading(true)
    fetchNewsDetails(id)
      .then(res => {
        if (res.code === 0) {
          setNews(res.data)
        } else {
          Taro.showToast({
            title: '新闻加载失败',
            icon: 'none',
          })
        }
      })
      .finally(() => setLoading(false))
  }, [id])

  const handleBack = () => {
    Taro.navigateBack()
  }

  if (loading) {
    return (
      <View className="loading-container">
        <AtActivityIndicator size={64} color="#6190E8" content="加载中..." />
      </View>
    )
  }

  if (!news) {
    return (
      <View className="error-container">
        <AtIcon value="close-circle" size={80} color="#F56C6C" />
        <Text className="error-text">新闻内容加载失败</Text>
        <View className="back-button" onClick={handleBack}>
          <AtIcon value="chevron-left" size={24} color="#fff" />
          <Text>返回首页</Text>
        </View>
      </View>
    )
  }

  return (
    <View className="news-detail-container">
      {/* 头部背景图 */}

      {/* 返回按钮 */}
      <View className="back-button" onClick={handleBack}>
        <AtIcon value="chevron-left" size={24} color="#fff" />
      </View>

      {/* 内容卡片 */}
      <View className="content-card">
        <View className="title-section">
          <Text className="title">{news.title}</Text>
          <View className="meta">
            <Text className="date">{formatDate(news.createTime)}</Text>
          </View>
        </View>

        {/* 富文本内容区域 */}
        <View className="rich-content">
          <RichText nodes={news.content} />
        </View>
      </View>
    </View>
  )
}

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')

  return `${year}年${month}月${day}日 ${hours}:${minutes}`
}
