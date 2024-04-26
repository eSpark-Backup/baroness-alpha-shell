import React, { useContext, useEffect, useState } from 'react'
import { ActivityIndicator, Image, StatusBar, StyleSheet, Text, View } from 'react-native'
import { useDispatch } from 'react-redux'
import SearchContext from './contexts/SearchContext'
import { useBackHandler } from './hooks/useBackHandler'
import { usePackageChange } from './hooks/usePackageChange'
import { PackageChange } from './models/event'
import { appRemovedAction, getAppsListAction } from './slices/appsList'
import { setDisplayAllApps } from './slices/appState'

const initialLoadPackageName = 'INITIAL_LOAD'
const packageChangedInitialValue = {
  packageName: initialLoadPackageName,
  isRemoved: false,
}

const Home = () => {
  const dispatch = useDispatch()
  const [packageChanged, setPackageChanged] = useState<PackageChange>(packageChangedInitialValue)
  const { searchInputRef } = useContext(SearchContext)

  useEffect(() => {
    if (packageChanged.isRemoved && packageChanged.packageName !== initialLoadPackageName) {
      dispatch(appRemovedAction(packageChanged.packageName))
    }

    dispatch(getAppsListAction())
  }, [packageChanged])

  useBackHandler(() => {
    dispatch(setDisplayAllApps(false))
    if (searchInputRef?.current?.isFocused()) searchInputRef?.current?.blur()

    // TODO: Read more about the return here: https://github.com/react-native-community/hooks#usebackhandler
    return true
  })

  usePackageChange((packageChange: PackageChange) => setPackageChanged(packageChange))

  //! old Rootview
  // return (
  //   <View style={styles.wrapper}>
  //     {/* <TopContainer />
  //     <BottomContainer /> */}
  //   </View>
  // )

  //!? new RootView
  return (
    <View style={styles.wrapper}>
      <StatusBar hidden />
      <Image source={require('./assets/images/logo.png')} style={{ height: 150, width: 150 }} resizeMode='contain' />
      <ActivityIndicator size={40} color={'#d84222'} />
      <Text style={styles.text}>Installing Application, Please wait...</Text>
      {/* <TopContainer />
      <BottomContainer /> */}
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    padding: 5,
    gap: 20,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1d1b20',
    // marginTop: StatusBar.currentHeight,
  },
  text: {
    fontSize: 16,
    color: '#d84222',
    letterSpacing: 2,
  },
})

export default Home
