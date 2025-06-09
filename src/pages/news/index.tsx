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
          // 处理富文本内容中的图片和表格显示问题
          const processedContent = processRichText(res.data.content)
          setNews({ ...res.data, content: processedContent })
        } else {
          Taro.showToast({
            title: '新闻加载失败',
            icon: 'none',
          })
        }
      })
      .finally(() => setLoading(false))
  }, [id])

  // 处理富文本中的图片和表格
  const processRichText = (content: string) => {
    // 1. 处理图片
    let processed = content.replace(/<img\s+([^>]*?)\/?>/g, (match, attrs) => {
      // 提取 src
      const srcMatch = attrs.match(/src=["']([^"']+)["']/)
      const src = srcMatch ? srcMatch[1] : ''
      // 提取 alt
      const altMatch = attrs.match(/alt=["']([^"']*)["']/)
      const alt = altMatch ? altMatch[1] : ''

      // 移除原有样式
      const cleanAttrs = attrs
        .replace(/\sstyle\s*=\s*(["'])[^"']*\1/gi, '')
        .replace(/\swidth\s*=\s*(["'])[^"']*\1/gi, '')
        .replace(/\sheight\s*=\s*(["'])[^"']*\1/gi, '')

      return `<img ${cleanAttrs} src="${src}" alt="${alt}" style="max-width:100%!important;height:auto!important;display:block;margin:20px auto;max-height:300rpx!important;" />`
    })

    // 2. 处理表格
    processed = processed.replace(/<table\s*([^>]*)>/gi, (match, attrs) => {
      // 移除原有样式和宽度设置
      const cleanAttrs = attrs
        .replace(/\sstyle\s*=\s*(["'])[^"']*\1/gi, '')
        .replace(/\swidth\s*=\s*(["'])[^"']*\1/gi, '')

      return `<table style="width:100%!important;border-collapse:collapse;margin:20px 0;${cleanAttrs}" >`
    })

    // 3. 处理表格单元格
    processed = processed.replace(/<(th|td)\s*([^>]*)>/gi, (match, tag, attrs) => {
      // 移除原有样式和宽度设置
      const cleanAttrs = attrs
        .replace(/\sstyle\s*=\s*(["'])[^"']*\1/gi, '')
        .replace(/\swidth\s*=\s*(["'])[^"']*\1/gi, '')
        .replace(/\scolspan\s*=\s*(["'])[^"']*\1/gi, '')
        .replace(/\srowspan\s*=\s*(["'])[^"']*\1/gi, '')

      return `<${tag} style="border:1px solid #ddd;padding:10px;text-align:left;${cleanAttrs}" >`
    })

    // 4. 处理表格标题单元格
    processed = processed.replace(/<th\s*([^>]*)>/gi, (match, attrs) => {
      // 移除原有样式和宽度设置
      const cleanAttrs = attrs
        .replace(/\sstyle\s*=\s*(["'])[^"']*\1/gi, '')
        .replace(/\swidth\s*=\s*(["'])[^"']*\1/gi, '')

      return `<th style="border:1px solid #ddd;padding:10px;text-align:left;background:#f8f8f8;font-weight:bold;${cleanAttrs}" >`
    })

    return processed
  }

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
      {/* 封面图片 */}
      {news.cover && <Image src={news.cover} className="cover-image" mode="aspectFill" />}

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
          <RichText nodes={news.content} className="rich-text-content" />
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
