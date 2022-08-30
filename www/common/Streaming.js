
class Streaming {
    streamName = '<Stream name>';
    streamAccountId = '<account id>';
    tokenID = '<token id>';
    publishingToken = '<publisher token>';
    subscribeToken = '<subscriber token>';

    video = null;
    autoReconnect = false;
    stream = null;

    video = null;
    autoReconnect = false;
    stream = null;

// Future feature set from URL Query string
/*
    //Get our url
 href = new URL(window.location.href);

 streamName = !!this.href.searchParams.get("streamName")
    ? this.href.searchParams.get("streamName")
    : this.streamNameDefault
 streamAccountId = !!this.href.searchParams.get("streamAccountId")
    ? this.href.searchParams.get("streamAccountId")
    : this.streamAccountIdDefault

 tokenID = !!this.href.searchParams.get("tokenID")
    ? this.href.searchParams.get("tokenID")
    : this.tokenIDDefault
*/


        constructor() {    
                    
        }

    beginReceiving = async (videoTexture) => {

        this.video = videoTexture.video  // For testing add video element and use document.querySelector("video");

        const addStream = (stream) => {
            if (this.video.srcObject) {
                console.log("srcObject exists")
                this.video.srcObject = stream;
                this.stream = stream;
                // already connected but we'll replace it anyway
            } else {
                console.log("new stream")
                this.video.srcObject = stream;
                this.stream = stream;
            }
        }

        // Future feature set from URL Query string
/*
        if (history.pushState) {
            var newurl = window.location.origin + window.location.pathname + '?streamAccountId=' + this.streamAccountId + '&=tokenID=' + this.tokenID + '&streamName=' + this.streamName + '&subscriberToken=' + this.subscribeToken
            window.history.pushState({ path: newurl }, '', newurl);
        }
*/

        // MillicastView object
        var millicastView = null;

        const newViewer = async (streamName, streamAccountId, subscribeToken) => {

            const tokenGenerator = () => window.millicast.Director.getSubscriber(streamName, streamAccountId, subscribeToken);

            const millicastView = new window.millicast.View(this.streamName, tokenGenerator, this.video, this.autoReconnect)


            millicastView.on("broadcastEvent", (event) => {
                if (!this.autoReconnect) return;

                let layers = event.data["layers"] !== null ? event.data["layers"] : {};
                if (event.name === "layers" && Object.keys(layers).length <= 0) {
                }
            });
            millicastView.on("track", (event) => {
                addStream(event.streams[0]);
            });
            return millicastView
        }
        
        millicastView = await newViewer(this.streamName, this.streamAccountId, this.subscribeToken)

     
        //Start connection to publisher
        try {

            await millicastView.connect()  // peer connection and recieve the stream attach to video ele
        } catch (e) {
            console.log('Connection failed, handle error', e)
            this.millicastView.reconnect()
        }
    }


}