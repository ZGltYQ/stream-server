const ffmpeg            = require('fluent-ffmpeg');
const wrtc              = require('wrtc');
const SimplePeerWrapper = require('simple-peer-wrapper');
const { PassThrough }   = require('stream');
const robot             = require("robotjs");
const MAX_BUFFER_SIZE   = 70000

const stream = new PassThrough();

const screen = robot.getScreenSize();

ffmpeg.setFfmpegPath('ffmpeg');

const command = ffmpeg()
  .input('desktop')
  .inputFormat('gdigrab')
  .videoCodec('mpeg1video')
  .videoFilters(`scale=${screen.width}:${screen.height}`)
  .outputOptions('-bf 0')
  .outputOptions('-preset ultrafast')
  .outputOptions('-tune zerolatency')
  .outputOptions('-pix_fmt yuv420p')
  .outputOptions('-f mpegts')
  .on('start', () => console.log('Screen recording started.'))
  .on('error', (err) => console.log('An error occurred: ' + err.message))
  .on('end', () =>  console.log('Screen recording finished.'));

const spw = new SimplePeerWrapper({
  serverUrl: 'http://212.111.203.181:8081',
  debug: true,
  simplePeerOptions: { 
    wrtc,
    config : { iceServers: [
      { urls: 'stun:hisokajenkins.space:5349' }, 
      { urls: 'stun:stun2.l.google.com:19302' },
      { urls: 'stun:stun3.l.google.com:19302' },
      { urls: 'stun:stun4.l.google.com:19302' }
    ] }
  }
});

command.pipe(stream);

spw.on('data', ({ data }) => {
  const actions = {
    'move'  : (data) => robot.moveMouseSmooth(data?.x, data?.y, 2),
    'click' : () => robot.mouseClick(),
    'tap'   : (data) => robot.keyTap(data?.key)
  }

  return actions[data?.type](data)
});

spw.on('connect', () => {
  command.run();
  stream.on('data', (data) => {
    if (data?.length > MAX_BUFFER_SIZE) {
      let parts = 2;
      let prev = 0;
      while (data?.length / parts > MAX_BUFFER_SIZE) parts++;
      while (parts > 1) {
        spw.send(data.slice(prev, data?.length / parts))
        prev = data?.length / parts;
        parts--;
      }
    } else spw.send(data)
  })
});

// Start the FFmpeg recording

// docker run --name Stun-Turn-Server -d \
// 	-p 5349:5349 -p 5349:5349/udp \
// 	--env 'PORT=5349' \
// 	--env 'REALM=hisokajenkins.space' \
// 	--env 'DISPLAY_SECRETS=true' \
// 	--env 'CA_COUNTRY=US' \
// 	--env 'TOTAL_QUOTA=100' \
// 	--env 'MAX_BPS=0' \
// 	--env 'CERT_LENGTH=2048' \
// 	--env 'CERT_VALID_DAYS=3650' \
// 	--env 'DH_LENGTH=2048' \
// 	--env 'LISTENING_IP=0.0.0.0' \
// 	--env 'UID=99' \
// 	--env 'GID=100' \
// 	--env 'UMASK=0000' \
// 	--env 'DATA_PERMS=770' \
// 	--volume /path/to/stun-turn:/stun-turn \
// 	ich777/stun-turn-server