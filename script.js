const musicContainer = document.getElementById('music-container');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const audio = document.getElementById('audio');
const progress = document.getElementById('progress');
const progressContainer = document.getElementById('progress-container');
const title = document.getElementById('title');
const cover = document.getElementById('cover');
const canvas = document.getElementById('effectCanvas');
const ctx = canvas.getContext('2d');
let hasTypedMessage = false; // Kiểm soát hiệu ứng gõ chữ


canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Danh sách bài hát và hiệu ứng tương ứng
const songs = [
  { title: 'safe_and_sound', background: 'black', effect: 'snow' },
  { title: 'Roi_ta_se_ngam_phao_hoa...', background: 'images/city.jpg', effect: 'snow' },
  { title: 'Ong_troi_lam_toi_em_chua', background: 'images/night.jpg', effect: 'rain' },
  { title: 'Doi_hoa_mat_troi', background: 'images/sun_flower2.jpg', effect: 'flowers' },
  { title: 'Que_toi', background: 'images/que_toi.jpg', effect: 'none' },

];

let songIndex = 0;
let animationFrame;

// Tải thông tin bài hát ban đầu
loadSong(songs[songIndex]);

function loadSong(song) {
  title.innerText = song.title;
  audio.src = `music/${song.title}.mp3`;
  cover.src = `images/img7.jpg`;

  // Cập nhật nền và hiệu ứng
  document.body.style.backgroundImage = `url('${song.background}')`;
  document.body.style.backgroundSize = 'cover';
  document.body.style.backgroundPosition = 'center';

  // Kiểm tra bài hát để hiển thị chữ
  if (songIndex === 0 || songIndex === 1) {
    document.getElementById("typing-message").classList.remove("hidden");

    // Nếu là bài 2 thì giữ nguyên chữ, không chạy lại hiệu ứng gõ
    if (songIndex === 1) {
      document.getElementById("typing-message").innerHTML = "Don't know who are you, nhưng dù thế nào... hãy cố lên !!";
    }
  } else {
    document.getElementById("typing-message").classList.add("hidden");
  }

  // Bắt đầu hiệu ứng nền
  startEffect(song.effect);
}






function playSong() {
  musicContainer.classList.add('play');
  playBtn.querySelector('i.fas').classList.remove('fa-play');
  playBtn.querySelector('i.fas').classList.add('fa-pause');
  audio.play();

  // Nếu đang phát bài đầu tiên và chưa chạy hiệu ứng gõ chữ, thì chạy
  if (songIndex === 0 && !hasTypedMessage) {
    hasTypedMessage = true; // Đánh dấu đã chạy hiệu ứng
    typeWriterEffect("Don't know who are you, nhưng dù thế nào... hãy cố lên !!", "typing-message");
  }
}


function pauseSong() {
  musicContainer.classList.remove('play');
  playBtn.querySelector('i.fas').classList.add('fa-play');
  playBtn.querySelector('i.fas').classList.remove('fa-pause');
  audio.pause();
}

function prevSong() {
  songIndex = (songIndex - 1 + songs.length) % songs.length;
  loadSong(songs[songIndex]);
  playSong();
}

function nextSong() {
  songIndex = (songIndex + 1) % songs.length;
  loadSong(songs[songIndex]);
  playSong();
}

function updateProgress(e) {
  const { duration, currentTime } = e.srcElement;
  const progressPercent = (currentTime / duration) * 100;
  progress.style.width = `${progressPercent}%`;
}

function setProgress(e) {
  const width = progressContainer.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;

  audio.currentTime = (clickX / width) * duration;
}

// Bắt đầu hiệu ứng nền
function startEffect(effect) {
  cancelAnimationFrame(animationFrame);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  switch (effect) {
    case 'snow':
      startSnowEffect();
      break;
    case 'rain':
      startRainEffect();
      break;
    case 'flowers':
      startFlowerEffect();
      break;
    default:
      break;
  }
}

// Hiệu ứng tuyết rơi
function startSnowEffect() {
  const snowflakes = Array.from({ length: 300 }, () => ({   // 300: so luong hat tuyet hien thi
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 2 + 0.1,  
    speedY: Math.random() * 1 + 0.5,
    opacity: Math.random() * 0.7 + 0.3,
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    snowflakes.forEach((flake) => {
      ctx.beginPath();
      ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`;
      ctx.fill();

      flake.y += flake.speedY;
      if (flake.y > canvas.height) flake.y = 0;
    });
    animationFrame = requestAnimationFrame(draw);
  }

  draw();
}

// Hiệu ứng mưa
function startRainEffect() {
  const raindrops = Array.from({ length: 100 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    speedY: Math.random() * 4 + 4,
    length: Math.random() * 15 + 10,
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    raindrops.forEach((drop) => {
      ctx.beginPath();
      ctx.moveTo(drop.x, drop.y);
      ctx.lineTo(drop.x, drop.y + drop.length);
      ctx.strokeStyle = 'rgba(174, 194, 224, 0.5)';
      ctx.lineWidth = 1;
      ctx.stroke();

      drop.y += drop.speedY;
      if (drop.y > canvas.height) drop.y = 0;
    });
    animationFrame = requestAnimationFrame(draw);
  }

  draw();
}

// Hiệu ứng hoa rơi
function startFlowerEffect() {
  const flowers = Array.from({ length: 200 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 2 + 2,
    speedY: Math.random() * 1 + 0.5,
    opacity: Math.random() * 0.5 + 0.5,
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    flowers.forEach((flower) => {
      ctx.beginPath();
      ctx.arc(flower.x, flower.y, flower.size / 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 0, ${flower.opacity})`;
      ctx.fill();

      flower.y += flower.speedY;
      if (flower.y > canvas.height) flower.y = 0;
    });
    animationFrame = requestAnimationFrame(draw);
  }

  draw();
}

// Event listeners
playBtn.addEventListener('click', () => {
  const isPlaying = musicContainer.classList.contains('play');
  isPlaying ? pauseSong() : playSong();
});

prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);
audio.addEventListener('timeupdate', updateProgress);
progressContainer.addEventListener('click', setProgress);

// Khi bài hát kết thúc, tự động chuyển sang bài tiếp theo
audio.addEventListener('ended', nextSong);

document.getElementById('welcome-btn').addEventListener('click', function () {
  document.getElementById('welcome-screen').style.display = 'none';
  playSong(); // Gọi hàm phát nhạc tự động
});


function typeWriterEffect(text, elementId, speed = 130) {
  let i = 0;
  const element = document.getElementById(elementId);
  element.classList.remove("hidden");
  element.innerHTML = "";

  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, speed);
    } else {
      element.style.borderRight = "none";
    }
  }
  type();
}

document.getElementById('welcome-btn').addEventListener('click', function () {
  document.getElementById('welcome-screen').style.display = 'none';
  playSong(); // Bắt đầu phát nhạc

});


//////////////////////////////////////// để tuyết, mưa,... sẽ được căn chỉnh lại khi kích thước màn hình thay đổi
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  startEffect(songs[songIndex].effect);
}

// Lắng nghe sự kiện thay đổi kích thước màn hình
window.addEventListener('resize', resizeCanvas);

//////////////////////////////////////////////////