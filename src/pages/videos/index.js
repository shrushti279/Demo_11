import React, {useEffect, useState} from 'react'
import Head from 'next/head'
import Header from '../../components/Header/Header'
import Media from '../../components/Media/Media'
import Footer from '../../components/Footer/Footer'
import {APIRequest} from '../../utils/apis/api'
import headImgCover from '../../utils/data/pagecover.json'
import {Helpers} from '../../utils/helpers/common'
import Error from '../../components/Error/Error'

export default function Videos({data}) {  

  const [mediafiles, setMedia] = useState({
    isSet: false,
    screen: 0,
    active: '',
    consumedFiles: {},
    media: {},
  })

  useEffect(() => {
    if(!mediafiles.isSet) {
      if(data.videos.error){
        setMedia({
          active: 'Videos',
          screen: window.innerWidth,
          isSet: true,
          error: true
        })
      } else {
        (async function (){
          const consumedFiles = Helpers.splitArray(data.videos.videos)
          setMedia({ 
            isSet: true, 
            active: 'Videos',
            screen: window.innerWidth, 
            consumedFiles: consumedFiles,
            media: data.videos.videos,
          })
          
          // add data
          APIRequest.addData('video', 2)
        })()
      }
    }
    window.addEventListener('resize', resizeScreen)
    
    return function cleanupListener () {
      window.removeEventListener('resize', resizeScreen)
    }
  })
  
  // update the state when the resizing 
  // width mets requirement for change
  function updateState (newState) {
    setMedia({
      ...mediafiles,
      ...newState
    })
  }
  
  // update columns whenever the screen is resized
  function resizeScreen () {
    const width = window.innerWidth
    // check if resized
    if(Helpers.resize(mediafiles.screen)) {
      updateState({
        screen: width,
        consumedFiles: Helpers.splitArray(mediafiles.media)
      })
    }
  }

  async function addMedia () {
    const data = Helpers.getFromStorage()
    const newFiles = mediafiles.media.concat(data.dataFiles)
    const newconsumed = Helpers.splitArray(newFiles)
    
    // update state
    updateState({
      consumedFiles: newconsumed,
      media: newFiles,
    })
    // request new data
    APIRequest.addData('video', data.page + 1)
  }

  return (
    <div className='container'>
      <Head>
        <title>Foto Pics | Videos</title>
        <link rel="icon" href="/images/logo.ico"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
      </Head>

      <Header 
        midheader='midheader'
        cover='videos'
        active={mediafiles.active}
        src={Helpers.getDay(headImgCover.videos)}/>

      <main className='content-center media-container'>
        {mediafiles.isSet ? mediafiles.error ? 
          <Error /> :
            <Media medias={mediafiles.consumedFiles}
              top={mediafiles.top}
              addMedia={addMedia}
              toPlay={false}
              title='Curated Videos'
              autoplayvid={true}/> : null}
      </main>
      <Footer 
        active={mediafiles.active}/>
    </div>
  )
}


Videos.getInitialProps = async () => {
  const data = await APIRequest.getVideos(1)
  return {data}
}






