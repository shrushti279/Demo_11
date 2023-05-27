import React, {useEffect} from 'react'
import Svg from '../Svg/index'
import MediaFiles from './components/Media'

function Media(props) {
  
  const media = props.medias.map((media, i) => {
    return (
      <MediaFiles key={i}
        toPlay={props.toPlay}
        autoplayvid={props.autoplayvid}
        medias={media}/>
    )
  })

  return (
    <div className='content-center photo-wrapper'>

      <div className="content-center media-header">
        <h3 className='text-1 ts-2'>
          {props.title}
          {props.keywords ? 
            <span className='text-1 ts-8 search-words'>
              {props.keywords}</span> : null }
        </h3>
        <span className='text-2 ts-8'>
          {!props.toPlay ? '* hover your mouse to play the video.' : ''}
        </span>

        {/* <h3 className='text-1 ts-2'>Search photo: 
          <span className='text-1 ts-8 search-words'>man on the gray</span></h3>
        <span className='text-2 ts-6 search-results'>10,000 results</span> */}
      </div>

      {/* <div className="content-center search-labels">
        <button className='content-center ts-8'>
          <Svg svg='photo'/> Photos</button>
        <button className='content-center ts-8'>
          <Svg svg='video'/> Video</button>
      </div> */}

      <div className="media-outer-wrapper">
        {media}
      </div>
      <div className="fade-div">
        <div className="fade-element"></div>
      </div>

      <div className="content-center load-wrapper">
        {props.noAddMedia ? null : 
          <button className='text-2 ts-7'
          // onClick={()=>samp()}>Load More</button>
            onClick={props.addMedia}>Load More</button>}
      </div>

    </div>
  )
}

export default Media
