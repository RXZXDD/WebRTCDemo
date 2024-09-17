
let peerConnection;
let localStream;
let remoteStream;

let servers = {
    iceServers:[
        {
            urls:['stun:stun1.1.google.com:19302', 'stun:stun2.1.google.com:19302']
        }
    ]
}

//host
let init = async () =>{
    localStream = await navigator.mediaDevices.getUserMedia({video:true, audio:false})
    document.getElementById('user-1').srcOjbect = localStream
}

//host && client
let createPeerConnection = async(sdpTy) => {
    peerConnection = new RTCPeerConnection(servers);

    remoteStream = new MediaStream();
    document.getElementById('user-2').srcOjbect = remoteStream;

    localStream.getTrack().forEach((track) => {
        peerConnection.addTrack(track, localStream);
    });


    peerConnection.ontrack = async (event) => {
        event.streams[0].getTracks.forEach((track) => {
            remoteStream.addTrack(track);
        });
    };

    peerConnection.onicecandidate = async (event) => {
        if (event.candidate) {
            document.getElementById(sdpTy).value = JSON.stringify(peerConnection.localDescription);
        }
    };
}

//host
let createOffer = async() => {
    createPeerConnection('offer-sdp')

    let offer = await peerConnection.createOffer()
    await peerConnection.setLocalDescription(offer)

    document.getElementById('offer-sdp').value = JSON.stringify(offer)
}

//client
let createAnswer = async() => {

    createPeerConnection('answer-sdp')

    let offer = document.getElementById('offer-sdp').value
    if(!offer) return alert('Retrieve offer from peer first')

    offer = JSON.parse(offer)
    await peerConnection.setRemoteDescription(offer)

    let answer = await peerConnection.createAnswer()
    await peerConnection.setLocalDescription(answer)

    document.getElementById('answer-sdp').value = JSON.stringify(answer)
}

//host
let addAnswer = async () => {
    let answer = document.getElementById('add-answer').value
    if(!answer) return alert('Retrieve answer from peer first')

    answer = JSON.parse(answer)

    if(!peerConnection.currentRemoteDescription){
        peerConnection.setRemoteDescription(answer)
    }
}
init()

document.getElementById('create-offer').addEventListener('click', createOffer)
document.getElementById('create-answer').addEventListener('click', createAnswer)
document.getElementById('add-answer').addEventListener('click', addAnswer)

