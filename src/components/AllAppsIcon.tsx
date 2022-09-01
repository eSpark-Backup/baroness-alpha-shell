// React
import React, { useContext } from 'react'
// React Native
import { StyleSheet, View } from 'react-native'
// Contexts
import GlobalContext from '../contexts/GlobalContext'
// Icon
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

const AllAppsIcon = () => {
  const { toggleDisplayAllApps } = useContext(GlobalContext)

  return (
    <View style={styles.wrapper}>
      <Icon style={styles.icon} name='dots-hexagon' size={35} color='#000' onPress={toggleDisplayAllApps} />
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  icon: {
    margin: 5,
  },
})

export default AllAppsIcon
