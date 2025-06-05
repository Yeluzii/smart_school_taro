import { Image, View, Text, RadioGroup, Label, Radio, Button, Input } from '@tarojs/components'
import { useEffect, useState } from 'react'
import { AtIcon, AtModal } from 'taro-ui'
import Taro from '@tarojs/taro'
import { useAppDispatch, useAppSelector } from '@/store'
import { setUserInfo } from '@/store/user'
import './index.scss'
import { updateUser } from '@/service/user'

const UserInfo = () => {
  const userInfo = useAppSelector(state => state.user.userInfo)
  const [myUserInfo, setMyUserInfo] = useState({
    id: userInfo.id,
    nickname: '',
    avatar: '',
    gender: 0,
  })

  useEffect(() => {
    setMyUserInfo({
      ...myUserInfo,
      nickname: userInfo.nickname || '',
      avatar: userInfo.avatar || '',
      gender: userInfo.gender || 0,
    })
  }, [userInfo])

  const [isNicknameOpen, setIsNicknameOpen] = useState(false)
  const [nickname, setNickname] = useState('')

  const onNicknameChange = () => {
    setNickname(myUserInfo.nickname)
    setIsNicknameOpen(true)
  }

  const closePopup = () => setIsNicknameOpen(false)

  const onGenderChange = e => {
    const { value } = e.detail
    setMyUserInfo(prev => ({ ...prev, gender: value }))
  }

  const dispatch = useAppDispatch()

  const onAvatarChange = () => {
    Taro.chooseMedia({
      count: 1,
      mediaType: ['image'],
      success: res => {
        const { tempFiles } = res
        const tempFilePath = tempFiles[0].tempFilePath
        Taro.uploadFile({
          url: 'http://localhost:8080/content/api/file/upload',
          filePath: tempFilePath,
          name: 'file',
          header: {
            Authorization: Taro.getStorageSync('token'),
          },
          success: fileRes => {
            console.log(fileRes)
            const url = JSON.parse(fileRes.data).data
            setMyUserInfo(prev => ({ ...prev, avatar: url }))
            dispatch(setUserInfo({ ...userInfo, avatar: url }))
            Taro.showToast({
              title: '上传成功',
              icon: 'success',
              duration: 2000,
            })
          },
          fail: err => {
            console.log(err)
            Taro.showToast({
              title: '上传失败',
              icon: 'error',
              duration: 2000,
            })
          },
        })
      },
    })
  }

  const submitNickname = () => {
    setMyUserInfo(prev => ({ ...prev, nickname }))
    setIsNicknameOpen(false)
  }

  const handleSubmit = async () => {
    const res = await updateUser(myUserInfo)
    if (res.code === 0) {
      Taro.showToast({ title: '修改成功' })
      dispatch(setUserInfo(res.data))
      setTimeout(() => {
        Taro.navigateBack({ delta: 1 })
      }, 2000)
    } else {
      Taro.showToast({ title: '修改失败' })
    }
  }

  return (
    <View className="userInfoPage">
      <View className="user-info">
        <View className="avatar">
          <View className="row">
            <View className="left">头像</View>
            <View className="right" onClick={onAvatarChange}>
              <View className="img">
                <Image src={myUserInfo.avatar} mode="aspectFill" />
              </View>
              <View className="icon">
                <AtIcon value="chevron-right" size="20" color="#b9b9b9" />
              </View>
            </View>
          </View>
        </View>
        <View className="nickname">
          <View className="row">
            <View className="left">昵称</View>
            <View className="right">
              <Text className="txt">{myUserInfo.nickname}</Text>
              <View className="icon" onClick={onNicknameChange}>
                <AtIcon value="chevron-right" size="20" color="#b9b9b9" />
              </View>
            </View>
          </View>
        </View>
        <View className="gender">
          <View className="row">
            <View className="left">性别</View>
            <View className="right">
              <RadioGroup onChange={onGenderChange}>
                <Label className="radio">
                  <Radio value="0" color="#1296db" checked={myUserInfo.gender === 0} />
                  男
                </Label>
                <Label className="radio">
                  <Radio value="1" color="#1296db" checked={myUserInfo.gender === 1} />
                  女
                </Label>
              </RadioGroup>
            </View>
          </View>
        </View>
      </View>
      <Button className="button" onClick={handleSubmit}>
        保存
      </Button>
      <AtModal className="nicknamePopup" isOpened={isNicknameOpen}>
        <View className="container">
          <View className="popHeader">
            <View className="title">修改用户昵称</View>
            <View className="close" onClick={closePopup}>
              <AtIcon value="close" size="20" color="#999" />
            </View>
          </View>
          <View className="content">
            <Input
              className="input"
              type="text"
              placeholder="请输入昵称"
              value={nickname}
              onInput={e => setNickname(e.detail.value)}
            />
          </View>
          <View className="footer">
            <Button className="submit-btn" onClick={submitNickname} size="mini">
              确认修改昵称
            </Button>
          </View>
        </View>
      </AtModal>
    </View>
  )
}

export default UserInfo
