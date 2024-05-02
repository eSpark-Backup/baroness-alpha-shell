import { checkManagePermission, requestManagePermission } from 'manage-external-storage'
import React, { useContext, useEffect, useState } from 'react'
import { ActivityIndicator, Alert, Button, Image, NativeModules, StatusBar, StyleSheet, Text, View } from 'react-native'
import RNFS from 'react-native-fs'

//@ts-ignore
import { AppInstalledChecker } from 'react-native-check-app-installed'

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

const { InstallationModule } = NativeModules

const Home = () => {
  const dispatch = useDispatch()
  const [packageChanged, setPackageChanged] = useState<PackageChange>(packageChangedInitialValue)
  const { searchInputRef } = useContext(SearchContext)

  useEffect(() => {
    if (packageChanged.isRemoved && packageChanged.packageName !== initialLoadPackageName) {
      dispatch(appRemovedAction(packageChanged.packageName))
    }
    // checkAllFilesAccess()
    dispatch(getAppsListAction())
  }, [packageChanged])

  useBackHandler(() => {
    dispatch(setDisplayAllApps(false))
    if (searchInputRef?.current?.isFocused()) searchInputRef?.current?.blur()

    // TODO: Read more about the return here: https://github.com/react-native-community/hooks#usebackhandler
    return true
  })

  async function checkAllFilesAccess() {
    checkManagePermission()
      .then(isManagePermitted => {
        console.log('check status', isManagePermitted)
      })
      .catch(e => {
        console.log('error', e)
      })
  }

  async function requestAllFilesAccess() {
    requestManagePermission()
      .then(isManagePermitted => {
        console.log('request status', isManagePermitted)
      })
      .catch(e => {
        console.log('error', e)
      })
  }

  usePackageChange((packageChange: PackageChange) => setPackageChanged(packageChange))

  const installApk = async () => {
    const path = RNFS.ExternalStorageDirectoryPath + '/Documents/apkFile'
    const dir = await RNFS.readDir(path)
    console.log('pah', dir[0].path)

    try {
      const result = await InstallationModule.installApk(
        '/storage/emulated/0/Documents/apkFile/app-arm64-v8a-release.apk'
      )
      console.log(result) // Log the installation result
      if (result) {
        checker()
      }
    } catch (error) {
      console.error('Installation failed:', error)
      Alert.alert('Installation Failed', 'Failed to install the APK.')
    }
  }

  function checker() {
    AppInstalledChecker.isAppInstalledAndroid('com.baroness_alpha_android').then((isInstalled: boolean) => {
      if (isInstalled) {
        console.log('hogaya')
      }
      // isInstalled is true if the app is installed or false if not
    })
  }

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
      <Button title='Press Me' onPress={installApk} />
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
