import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CreatePost from '../../components/CreatePost'

const Announcements = () => {
  return (
    <>
      <CreatePost isAnnouncement={true} />
    </>
  )
}

export default Announcements

const styles = StyleSheet.create({})