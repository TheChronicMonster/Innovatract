import React from 'react';
import { Waku } from 'js-waku';
import { WakuMessage } from 'js-waku';

const WakuComponent = () => {
    const [waku, setWaku] = React.useState(null);

    const loadWaku = async () => {
        const waku = await Waku.create({ bootstrap: true });
        setWaku(waku);

        waku.relay.addObserver((msg) => {
            console.log("Message received:", msg.payloadAsUtf8)
        }, ["/my-cool-app/1/my-use-case/proto"]);
    }
    
    const sendMessage = async (rawMessage) => {
        const msg = await WakuMessage.fromUtf8String(rawMessage, "/my-cool-app/1/my-use-case/proto");
        await waku.relay.send(msg);
    }

    const viewMessages = async () => {
        const messages = await waku.store.queryHistory(['/my-cool-app/1/my-use-case/proto']);
        messages.forEach((msg) => {
            console.log('Message retrieved:', msg.payloadAsUtf8);
        });
    }

    return (
        <div>
            <h1>Waku</h1>
        </div>
    )
}

export default WakuComponent;
