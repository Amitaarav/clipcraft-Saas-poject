"use client"
import React,{useState, useEffect, useCallback} from 'react'
import { CldImage } from 'next-cloudinary';
import axios from 'axios'
import { video } from '@/types'
import VideoCard from '@/components/videoCard';
function Home() {
  const [videos, setVideos] = useState<video[]>([])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVideos = useCallback(async () => {
    try {
      const response = await axios.get('/api/videos');
      if(Array.isArray(response.data)){
        setVideos(response.data)
        setLoading(false)
      }
      else{
        throw new Error('unexpected response format')
      }
      
    } catch (error) {
      console.log(error)
      setError("failed to fetch videos")
    }
    finally{
      setLoading(false)
    }
    
  },[])

  useEffect(() => {
    fetchVideos()
  },[fetchVideos])

  const handleDownload = useCallback((url:string,title:string)=>{
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(`download`,`${title}.mp4`);
    link.setAttribute(`target`, `_blank`);
    link.click();
    document.body.removeChild(link);
  },[])

  if(loading){
    return <div>Loading...</div>
  }
  return (

    <div className = "container mx-auto p-4">
      <h1 className = "text-2xl font-bold mb-4">Videos</h1>
      {videos.length === 0? (<div className = "text-center text-lg text-grey-500">
        No videos available
      </div>) : (
        <div>
          {
            videos.map((video) => (
              <VideoCard 
              key = {video.publicId} 
              video = { video}
              onDownload = {handleDownload}/>
            ))
          }
        </div>
      )}
    </div>
  )
}


export default Home;
