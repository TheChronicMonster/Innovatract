import React, { useEffect, useState } from 'react';
import SECRETS from '../secrets.js';

const Livepeer = () => {
    const Livepeer = require("livepeer-nodejs");
    const apiKey = SECRETS.api;
    const livepeerObject = new Livepeer(apiKey);
    const [data, setData] = useState(null);
    const [streamUrl, setStreamUrl] = useState(null);

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
        });
    };

    return (
        <div>
            <button onClick={startStream}>Record Goal</button>
            {data ? <p>stream key: {data.streamKey}</p> : null}
        </div>
    );
}

export default Livepeer;
