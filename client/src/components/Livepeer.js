import React, { useEffect, useState } from 'react';
import SECRETS from '../secrets.js';

const Livepeer = () => {
    const Livepeer = require("livepeer-nodejs");
    const apiKey = SECRETS.api;
    const livepeerObject = new Livepeer(apiKey);
    const [data, setData] = useState(null);
    const [streamUrl, setStreamUrl] = useState(null);
    const [showButton, setShowButton] = useState(false);

    const content = {
        "name": "test_stream", 
        "profiles": [
            {
                "name": "720p",
                "bitrate": 2000000,
                "fps": 30,
                "width": 1280,
                "height": 720
            },
            {
                "name": "480p",
                "bitrate": 1000000,
                "fps": 30,
                "width": 854,
                "height": 480
            },
            {
                "name": "360p",
                "bitrate": 500000,
                "fps": 30,
                "width": 640,
                "height": 360
            },
        ],
        "record": true
    };

    const startStream = () => {
        livepeerObject.Stream.create(content).then((res) => {
            console.log(res);
            setData(res);
            setShowButton(true);
        });
    };

    const getStreamUrl = async () => {
        const url = `https://livepeer.com/api/session?limit=20&parentId=${data.id}`;

        const listOfAllStreams = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${apiKey}`,
            },
        });

        if (listOfAllStreams.data.length === 0) {
            alert("No stream detected");
            return;
        }

        setStreamUrl(listOfAllStreams.data[0].mp4Url);
        console.log(listOfAllStreams.data[0].mp4Url);

        if (streamUrl === "") alert("stream is currently processing");
    };

    return (
        <div>
            <button onClick={startStream}>Record Goal</button>
            {data ? <p>stream key: {data.streamKey} (plug into streaming sofrware)</p> : null}
            {showButton ? <button>Play Stream</button> : null}
            {streamUrl ? <ShakaPlayer src={streamUrl} /> : null}
        </div>
    );
}

export default Livepeer;
