import axios from 'axios'
export const Helpers = (function(){
  
  // function to convert string into a hyphenated link
  const _formatTextToUrl = (text) => {
    if(text === undefined) return 
    const t = text.toLowerCase()
    return t.split(' ').join('-')
  }

  // this function get the day in number and return
  // a object of link
  const _getDay = (days) => {
    const day = new Date().getDay()
    return days[day]
  }

  // function that will split the array into parts
  const _splitArray = (data) => {
    // find length of screen
    const length = _findLength()
    
    // create a fresh array based on the length
    const result =  createArray(length)
    let counter = 0
  
    // split the array
    for (let i = 0; i < data.length; i++) {
      // push the array into each array list
      result[counter].push(data[i])
      // increment the counter
      i%length === 0 ? counter = 0 : counter++
    }

    // return the new array
    return result
  }
  
  
  // this array will combine two groups of array
  const _combineArray = (photos, videos) => {
    // initiate an array and counter
    let arr = []
    let counter = 0

    // loop into the array
    for (let i = 0; i < photos.length; i++) {
      // if array index is % 0
      if (i % 3 === 0) {
        arr.push(videos[counter])
        counter++
      }
      // push array
      arr.push(photos[i])
    }
    // return new splits of array
    return arr
  }


  // function to return a number if the 
  // width is screen width is within a certain width
  const _findLength = () => {
    const w = window.innerWidth
    if (w < 568) {
      return 1
    } else if (w < 868) {
      return 2
    } else {
      return 3
    }
  }


  // function to run when the screen is resized
  // and return true if the parameters are met
  const _resize = (screen) => {
    const width = window.innerWidth
    if (screen <= 568) {
      if (width > 568) return true
    } else if (screen > 568 && screen < 868) {
      if (width > 868) {
        return true
      } else if (width < 568) {
        return true
      }
    } else if (screen >= 868) {
      if (width < 868) return true
    }
  }

  // get data from localstorage
  const _getFromStorage = () => {
    // get data from storage
    const d = _getStorage('samples')

    // separate data
    let photos = checkIfEmpty('photos', d.data)
    let videos = checkIfEmpty('videos', d.data)

    let dataFiles;
    if (photos && !videos) {
      dataFiles = photos
    } else if (!photos && videos) {
      dataFiles = videos
    } else {
      dataFiles = _combineArray(photos, videos)
    }

    // combine  
    return {
      dataFiles,
      page: d.page
    }
  }

  // get data from localstorage
  const _checkFromStorage = () => {
    let dataFiles;
    // get data from storage
    const d = _getStorage('samples')

    const photos = d.data.photos.photos
    const videos = d.data.videos

    if(videos.total_results < 6) {
      dataFiles = d.data.photos.photos
    } else {
      dataFiles = _combineArray(photos, videos.videos)
    }

    // combine  
    return {
      dataFiles,
      page: d.page
    }
  }

  // to check if the list of data set contains the needed
  // data likeif photos or videos
  const checkIfEmpty = (arr, data) => {
    let media
    if(arr === 'photos') {
      media = data.photos ? data.photos.photos : null
    } else {
      media = data.videos ? data.videos.videos : null
    }
    return media
  }


  // function to check if the query params 
  // is listed on the collection of photos
  const _checkIfExists = (query, lists) => {
    return lists.some(list => {
        return _setName(list) === _setName(query)
    })
  }

  // format the text and covert it to a spaced text
  const _setName = (name) => {
    let a = name.split('-')
    let b = a.map(a1 => {
      let c = a1.split('')
      let f = c.map((d, i) => {
        if (i === 0) {
          return d.toUpperCase()
        } else {
          return d
        }
      })
      return f.join('')
    })
    return b.join(' ')
  }


  // this function will extract the query string and use
  // it to pass as a text to highlight the navlinks
  const _formatText = (text) =>{
    const query = text.split('-')
    const x = query.map(y => {
      let z = y.split('')
      z[0] = z[0].toLocaleUpperCase()
      return z.join('')
    })
    return x.join(' ')
  }

  // function to sort the list of videos
  // files and return the only list that has 
  // the smallest file size 'sd'
  const _findSmallVideos = (videos) => {
    let video = videos.filter(vid => {
      return vid.quality === 'sd'
    })
    return video[0].link
  }

  // download the file
  const _download = (l, title, page) => {
    axios({
      url: l, //your url
      method: 'GET',
      responseType: 'blob', // important
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${title}.${page === 'photos' ? 'jpg' : 'mp4'}`); //or any other extension
      document.body.appendChild(link);
      link.click();
    });
  }

  // get data from storage
  const _getStorage = (name) => {
    // get data from storage
    const items = localStorage.getItem(name)
    // parse items and return 
    return JSON.parse(items)
  }


  return {
    formatTextToUrl(text) {
      return _formatTextToUrl(text)
    },
    setName(text) {
      return _setName(text)
    }, 
    getDay (days) {
      return _getDay(days)
    },
    splitArray(data) {
      return _splitArray(data)
    },
    combineArray(photos, videos){
      return _combineArray(photos, videos)
    },
    findLength(){
      return _findLength()
    },
    resize(screen){
      return _resize(screen)
    },
    getFromStorage() {
      return _getFromStorage()
    },
    checkIfExists(query, lists){
      return _checkIfExists(query, lists)
    },
    formatText (text) {
      return _formatText(text)
    },
    findSmallVideos(videos) {
      return _findSmallVideos(videos)
    },
    checkFromStorage() {
      return _checkFromStorage()
    },
    download(link, title, page){
      return _download(link, title, page)
    },
    getStorage(text) {
      return _getStorage(text)
    }
  }
})()


// create a new fresh set of array
const createArray = (length) => {
  let arr = []
  for (let x = 0; x < length; x++) {
    arr.push([])
  }
  return arr
}


