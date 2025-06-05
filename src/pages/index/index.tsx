import { View,ScrollView,Text } from '@tarojs/components'
import { useEffect, useState } from 'react'
import { getCategories } from '@/service/category'
import NotebookGrid from '@/components/NotebookGrid'
import { getNotesPage } from '@/service/note'
import "./index.scss"
import Taro from '@tarojs/taro'

const Note: React.FC = () => {
  // 上拉加载更多
  Taro.useReachBottom(() => {
    if (hasMore && !loading) {
      setNoteQuery(prev => ({...prev, page: prev.page + 1}));
    }
  });
  const [loading, setLoading] = useState(false);
  const [noteQuery, setNoteQuery] = useState<NoteQuery>({
    page: 1,
    limit: 6,
    title: '',
  })
  const [hasMore, setHasMore] = useState(true);
  const [notes, setNotes] = useState<NoteVO[]>([]);
  const [refresherTriggered, setRefresherTriggered] = useState(false);
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getNotesPage(noteQuery)
      if (res.code === 0) {
        setNotes([...notes, ...res.data.list])
        setHasMore(res.data.total > notes.length + res.data.list.length );
      }
    }catch (error) {
      console.error('Error fetching data:', error);
    }finally {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  }

    // 处理下拉刷新
    const handleRefresh = () => {
      setRefresherTriggered(true);
      setNoteQuery({
        page: 1,
        limit: 6,
        title: '',
      })
      setNotes([]);
      fetchData().finally(() => setRefresherTriggered(false));
    };

  useEffect(() => {
    fetchData()
  },[noteQuery])

  const [categoryList, setCategoryList] = useState<CategoryVO[]>([])
  const getCategoriesData = async () => {
    const res = await getCategories()
    if (res.code === 0) {
      setCategoryList(res.data)
    }
  }

  const handleLoadMore = () => {
    if (loading || !hasMore) return;
    setNoteQuery(prevQuery => ({
      ...prevQuery,
      page: prevQuery.page + 1,
    }));
  };

  useEffect(() => {
    getCategoriesData()
  }, [])
  return (
    <>
      <View className="index">
        <NotebookGrid data={categoryList} />
        <View>
        笔记列表
        </View>
        <ScrollView
          scrollY
          scrollWithAnimation
          refresherEnabled={true}
          refresherTriggered={refresherTriggered}
          onRefresherRefresh={handleRefresh}
          onScrollToLower={handleLoadMore}
          className='notes-list'
        >
          {notes.map((item, id) => (
            <View key={id} className='line'>
              <Text>
                {item.title}
              </Text>
            </View>
          ))}
          {/* 加载状态提示 */}
          {loading && <View style={{color: 'blue'}}>加载中...</View>}
          {!hasMore && <View >没有更多数据了</View>}
        </ScrollView>
      </View>
    </>
  )
}

export default Note
