"use client"
import React, { useState, useEffect, useRef} from 'react'
import { CldImage } from 'next-cloudinary';

// object for instagram post format
const socialFormats = {
    "Instagram Square (1:1)": {
        width: 1080,
        height: 1080,
        aspectRatio: "1:1",
        crop: "fill"
    },
    "Instagram Portrait (4:5)": {
        width: 1080,
        height: 1350,
        aspectRatio: "4:5",
        crop: "fill"
    },
    "Instagram Landscape (5:4)": {
        width: 1080,
        height: 864,
        aspectRatio: "5:4",
        crop: "fill"
    },
    "Twitter post (16:9)": {
        width: 1200,
        height:675,
        aspectRatio: "16:9",
        crop: "fill"
    },
    "Twitter Header (3:1)": {
        width: 1500,
        height: 500,
        aspectRatio: "3:1",
    },
    "Facebook cover (205:78)": {
        width: 2050,
        height: 780,
        aspectRatio: "205:78",
    },
    "Facebook post (1:1)": {
        width: 1200,
        height: 1200,
        aspectRatio: "1:1",
    },
    "Facebook post (16:9)": {
        width: 1200,
        height: 675,
        aspectRatio: "16:9",
    },
    "Facebook post (9:16)": {
        width: 1200,
        height: 1920,
        aspectRatio: "9:16",
    },
    "Facebook post (4:5)": {
        width: 1200,
        height: 1500,
        aspectRatio: "4:5",
    }
};

type SocialFormat = keyof typeof socialFormats;
export default function SocialShare() {
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [selectedFormat, setSelectedFormat] = useState<SocialFormat>("Instagram Square (1:1)");
    const [isUploading, setIsUploading] = useState(false);
    const [isTransForming, setIsTransForming] = useState(false);
    const imageRef = useRef<HTMLImageElement>(null);

    useEffect (()=>{
        if(uploadedImage){
            //if image is uploaded then transform
            setIsTransForming(true);
        }
    },[selectedFormat, uploadedImage]);


    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if(!file) return;
        setIsUploading(true);
        const formData = new FormData();
        formData.append("image", file); //taking the file from the input

        try {
            const response = await fetch("/api/image-upload", {
                method: "POST",
                body:formData
            })
            if(!response.ok) throw new Error("Failed to upload image");
            const data = await response.json();
            setUploadedImage(data.publicId);
        } catch (error) {
            console.log(error);
            alert("Failed to upload image");
        }finally{
            setIsUploading(false);
        }
    };

    //download part
    const handleDownload = () => {
        if(!imageRef.current) return;
        //controlling blob
        // fetch trying 
        fetch(imageRef.current.src).then(res => res.blob()).then(blob => {
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `${selectedFormat.replace(/\s/g,"_").toLowerCase()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            document.body.removeChild(link);
            })
        }   
    
    return (
        <div className="container mx-auto p-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 text-center">
            Social Media Image Creator
        </h1>

        <div className="card">
            <div className="card-body">
            <h2 className="card-title mb-4">Upload an Image</h2>
            <div className="form-control">
                <label className="label">
                <span className="label-text">Choose an image file</span>
                </label>
                <input
                type="file"
                onChange={handleImageUpload}
                className="file-input file-input-bordered file-input-primary w-full"
                />
            </div>

            {isUploading && (
                <div className="mt-4">
                <progress className="progress progress-primary w-full"></progress>
                </div>
            )}

            {uploadedImage && (
                <div className="mt-6">
                <h2 className="card-title mb-4">Select Social Media Format</h2>
                <div className="form-control">
                    <select
                    className="select select-bordered w-full"
                    value={selectedFormat}
                    onChange={(e) =>
                        setSelectedFormat(e.target.value as SocialFormat)
                    }
                    >
                    {Object.keys(socialFormats).map((format) => (
                        <option key={format} value={format}>
                        {format}
                        </option>
                    ))}
                    </select>
                </div>

                <div className="mt-6 relative">
                    <h3 className="text-lg font-semibold mb-2">Preview:</h3>
                    <div className="flex justify-center">
                    {isTransForming && (
                        <div className="absolute inset-0 flex items-center justify-center bg-base-100 bg-opacity-50 z-10">
                        <span className="loading loading-spinner loading-lg"></span>
                        </div>
                    )}
                    <CldImage
                        width={socialFormats[selectedFormat].width}
                        height={socialFormats[selectedFormat].height}
                        src={uploadedImage}
                        sizes="100vw"
                        alt="transformed image"
                        crop="fill"
                        aspectRatio={socialFormats[selectedFormat].aspectRatio}
                        gravity='auto'
                        ref={imageRef}
                        onLoad={() => setIsTransForming(false)}
                        />
                    </div>
                </div>

                <div className="card-actions justify-end mt-6">
                    <button className="btn btn-primary" onClick={handleDownload}>
                    Download for {selectedFormat}
                    </button>
                </div>
                </div>
            )}
            </div>
        </div>
        </div>
    );
    
}
