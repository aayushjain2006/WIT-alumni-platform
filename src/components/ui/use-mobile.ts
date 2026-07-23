import { useState, useEffect } from 'react'

export function useMobile() {
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [screenWidth, setScreenWidth] = useState(0)
  const [isLandscape, setIsLandscape] = useState(false)

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      
      setScreenWidth(width)
      setIsMobile(width < 768)
      setIsTablet(width >= 768 && width < 1024)
      setIsLandscape(width > height)
    }

    checkDevice()
    window.addEventListener('resize', checkDevice)
    window.addEventListener('orientationchange', checkDevice)

    return () => {
      window.removeEventListener('resize', checkDevice)
      window.removeEventListener('orientationchange', checkDevice)
    }
  }, [])

  const isTouchDevice = () => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0
  }

  const isIOS = () => {
    return /iPad|iPhone|iPod/.test(navigator.userAgent)
  }

  const isAndroid = () => {
    return /Android/.test(navigator.userAgent)
  }

  const getDeviceType = () => {
    if (isMobile) return 'mobile'
    if (isTablet) return 'tablet'
    return 'desktop'
  }

  const isSmallScreen = screenWidth < 380
  const isMediumScreen = screenWidth >= 380 && screenWidth < 430
  const isLargeScreen = screenWidth >= 430

  return {
    isMobile,
    isTablet,
    isDesktop: !isMobile && !isTablet,
    screenWidth,
    isLandscape,
    isTouchDevice: isTouchDevice(),
    isIOS: isIOS(),
    isAndroid: isAndroid(),
    deviceType: getDeviceType(),
    isSmallScreen,
    isMediumScreen,
    isLargeScreen
  }
}