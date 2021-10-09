import React from 'react';
import { Waku, WakuMessage } from 'js-waku';

const WakuComponent = () => {
    const waku = await Waku.create({ bootstrap: true });

    waku.relay.addObserver((msg) => {
        console.log("Message received:", msg.payloadAsUtf8)
    }, ["/my-cool-app/1/my-use-case/proto"]);

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
