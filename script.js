document.addEventListener('DOMContentLoaded', function () {
  // const allWords = [
  //   'cat', 'dog', 'bird', 'fish', 'horse', 'cow', 'sheep', 'goat',
  //   'duck', 'chicken', 'rabbit', 'pig', 'elephant', 'tiger', 'lion',
  //   'bear', 'monkey', 'kangaroo', 'penguin', 'giraffe', 'zebra', 'deer'
  // ];

  const allWords = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  // Định nghĩa mảng với các giá trị start và end tương ứng cho từng chữ cái
  const wordRanges = [
    { letter: 'A', start: 2.337652, end: 4.393173 },
    { letter: 'B', start: 4.393173, end: 6.166564 },
    { letter: 'C', start: 6.166564, end: 7.899651 },
    { letter: 'D', start: 7.899651, end: 9.914868 },
    { letter: 'E', start: 9.914868, end: 11.567346 },
    { letter: 'F', start: 11.567346, end: 13.74378 },
    { letter: 'G', start: 13.74378, end: 15.87991 },
    { letter: 'H', start: 15.87991, end: 17.653301 },
    { letter: 'I', start: 17.653301, end: 19.789431 },
    { letter: 'J', start: 19.789431, end: 21.401605 },
    { letter: 'K', start: 21.401605, end: 23.255604 },
    { letter: 'L', start: 23.255604, end: 24.988691 },
    { letter: 'M', start: 24.988691, end: 26.963604 },
    { letter: 'N', start: 26.963604, end: 28.575777 },
    { letter: 'O', start: 28.575777, end: 30.711907 },
    { letter: 'P', start: 30.711907, end: 32.727124 },
    { letter: 'Q', start: 32.727124, end: 34.742341 },
    { letter: 'R', start: 34.742341, end: 36.636645 },
    { letter: 'S', start: 36.636645, end: 38.530949 },
    { letter: 'T', start: 38.530949, end: 40.143123 },
    { letter: 'U', start: 40.143123, end: 42.077731 },
    { letter: 'V', start: 42.077731, end: 44.133253 },
    { letter: 'W', start: 44.133253, end: 46.229078 },
    { letter: 'X', start: 46.229078, end: 48.203991 },
    { letter: 'Y', start: 48.203991, end: 50.178904 },
    { letter: 'Z', start: 50.178904, end: 52.27473 },
    
  ];

  const numWordsToShow = allWords.length/3;
  let remainingWords = [...allWords];
  let currentWord = '';

    // Hàm để chọn từ ngẫu nhiên từ danh sách lớn và thêm vào canvas
    function getRandomWords() {
      const shuffled = allWords.sort(() => 0.5 - Math.random());
      return shuffled.slice(0, numWordsToShow);
    }

  // Thiết lập Konva stage và layer
  const stage = new Konva.Stage({
    container: 'container',
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const layer = new Konva.Layer();
  stage.add(layer);

  // Thêm một layer cho thông báo
  const messageLayer = new Konva.Layer();
  stage.add(messageLayer);

  // Hàm để thêm từ vào canvas với vị trí ngẫu nhiên
  function addWordsToCanvas() {
    layer.destroyChildren(); // Xóa tất cả các từ hiện có trên canvas
    remainingWords = getRandomWords();
    
    remainingWords.forEach((word) => {
      const text = new Konva.Text({
        x: Math.random() * (stage.width() - 100), // Vị trí ngẫu nhiên
        y: Math.random() * (stage.height() - 30), // Vị trí ngẫu nhiên
        text: word,
        fontSize: 66,
        fontFamily: 'Calibri',
        fill: 'black',
        draggable: true,
        id: word
      });

      text.on('mouseover', () => {
        document.body.style.cursor = 'pointer';
        text.fill('green');
        layer.draw();
      });

      text.on('mouseout', () => {
        document.body.style.cursor = 'default';
        text.fill('black');
        layer.draw();
      });

      function handleWordClick() {
        if (currentWord === word) {
          createCorrectMessage(text.x() + text.width() / 2, text.y() + text.height() / 2);
          createExplosion(text.x() + text.width() / 2, text.y() + text.height() / 2);

          // Hiệu ứng mờ dần và xóa từ
          text.to({
            scaleX: 1.5,
            scaleY: 1.5,
            opacity: 0,
            duration: 0.5,
            onFinish: () => {
              text.destroy(); // Xóa từ khỏi layer
              layer.draw();
              remainingWords = remainingWords.filter(w => w !== word); // Cập nhật danh sách từ còn lại
              if (remainingWords.length > 0) {
                setTimeout(() => {
                  playSound();
                }, 1000); // Phát âm từ mới sau khi thông báo
              } else {
                setTimeout(() => {
                  showFireworks();
                  remainingWords = [...allWords]; // Đặt lại danh sách từ còn lại
                  addWordsToCanvas();
                  playSound();
                }, 1000);
              }
            }
          });
        } else {
          createWrongMessage(text.x() + text.width() / 2, text.y() + text.height() / 2);
        }
      }


      text.on('click', handleWordClick);
      text.on('tap', handleWordClick);

      layer.add(text);
    });

    layer.draw();
  }

  function getFemaleVoice() {
    const voices = speechSynthesis.getVoices();
    return voices.find(voice => voice.name.toLowerCase().includes('female'));
  }

  function playAudioFromTo(startTime, endTime) {
    const audio = new Audio('ocpd_01_the_alphabet.mp3');
    audio.currentTime = startTime;
    audio.playbackRate = 0.65;

    audio.play().then(() => {
        const stopPlayback = () => {
            if (audio.currentTime >= endTime) {
                audio.pause();
                audio.removeEventListener('timeupdate', stopPlayback);
            }
        };

        audio.addEventListener('timeupdate', stopPlayback);
    }).catch(error => {
        console.error("Failed to play audio:", error);
    });
}


  // Phát âm thanh bằng speechSynthesis
  function playSound() {
    const randomWord = remainingWords[Math.floor(Math.random() * remainingWords.length)];
    currentWord = randomWord;

    const aRange = wordRanges.find(range => range.letter === currentWord);
    console.log(aRange.letter); // { letter: 'A', start: 0, end: 10 }
    console.log(aRange.start); // 0
    console.log(aRange.end); // 10

    playAudioFromTo(aRange.start, aRange.end);
    /*
    const utterance = new SpeechSynthesisUtterance(randomWord);
    utterance.lang = "en-US";
    const femaleVoice = getFemaleVoice();
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }
    utterance.rate = 0.75;
    speechSynthesis.speak(utterance);
    */
  }

  // Phát lại âm thanh hiện tại
  function replaySound() {
    const aRange = wordRanges.find(range => range.letter === currentWord);
    console.log(aRange.letter); // { letter: 'A', start: 0, end: 10 }
    console.log(aRange.start); // 0
    console.log(aRange.end); // 10

    playAudioFromTo(aRange.start, aRange.end);
    /*
    const utterance = new SpeechSynthesisUtterance(currentWord);
    utterance.lang = "en-US";
    const femaleVoice = getFemaleVoice();
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }
    utterance.rate = 0.75;
    speechSynthesis.speak(utterance);
    */
  }

  // Tạo thông báo "Correct!" trên canvas
  function createCorrectMessage(x, y) {
    const correctMessage = new Konva.Text({
      x: x,
      y: y,
      text: 'Correct!',
      fontSize: 36,
      fontFamily: 'Calibri',
      fill: 'green',
      opacity: 0,
      listening: false
    });

    messageLayer.add(correctMessage);
    correctMessage.to({
      opacity: 1,
      scaleX: 1.2,
      scaleY: 1.2,
      duration: 0.5,
      onFinish: () => {
        correctMessage.to({
          opacity: 0,
          scaleX: 1,
          scaleY: 1,
          duration: 0.5,
          onFinish: () => {
            correctMessage.destroy();
            messageLayer.draw();
          }
        });
      }
    });
  }

  // Tạo thông báo "Try again!" trên canvas
  function createWrongMessage(x, y) {
    const wrongMessage = new Konva.Text({
      x: x,
      y: y,
      text: 'Try again!',
      fontSize: 36,
      fontFamily: 'Calibri',
      fill: 'red',
      opacity: 0,
      listening: false
    });

    messageLayer.add(wrongMessage);
    wrongMessage.to({
      opacity: 1,
      scaleX: 1.2,
      scaleY: 1.2,
      duration: 0.5,
      onFinish: () => {
        wrongMessage.to({
          opacity: 0,
          scaleX: 1,
          scaleY: 1,
          duration: 0.5,
          onFinish: () => {
            wrongMessage.destroy();
            messageLayer.draw();
          }
        });
      }
    });

    replaySound();
  }

  // Tạo hiệu ứng nổ khi chọn đúng từ
  function createExplosion(x, y) {
    const explosionLayer = new Konva.Layer();
    stage.add(explosionLayer);

    for (let i = 0; i < 20; i++) {
      const circle = new Konva.Circle({
        x: x,
        y: y,
        radius: Math.random() * 5 + 2,
        fill: Konva.Util.getRandomColor(),
        opacity: 1
      });

      explosionLayer.add(circle);
      circle.to({
        x: x + Math.random() * 50 - 25,
        y: y + Math.random() * 50 - 25,
        radius: 0,
        duration: 0.5,
        onFinish: () => {
          circle.destroy();
        }
      });
    }

    explosionLayer.draw();
    setTimeout(() => {
      explosionLayer.destroy();
    }, 1000);
  }


  const showFireworks = () => {
    const fireworksLayer = new Konva.Layer();
    stage.add(fireworksLayer);
  
    const createExplosion = (x, y) => {
      const particles = [];
      const numParticles = 50;
  
      for (let i = 0; i < numParticles; i++) {
        const angle = (Math.PI * 2 * i) / numParticles;
        const speed = Math.random() * 2 + 2;
        const particle = new Konva.Circle({
          x: x,
          y: y,
          radius: Math.random() * 3 + 2,
          fill: `hsl(${Math.random() * 360}, 100%, 50%)`,
          opacity: 1,
        });
        fireworksLayer.add(particle);
        particles.push({ particle, angle, speed });
      }
  
      const anim = new Konva.Animation((frame) => {
        particles.forEach(({ particle, angle, speed }) => {
          const velocityX = Math.cos(angle) * speed;
          const velocityY = Math.sin(angle) * speed;
          particle.x(particle.x() + velocityX);
          particle.y(particle.y() + velocityY);
          particle.opacity(particle.opacity() - 0.02);
          if (particle.opacity() <= 0) {
            particle.destroy();
          }
        });
        fireworksLayer.batchDraw();
      }, fireworksLayer);
  
      anim.start();
  
      setTimeout(() => {
        anim.stop();
        particles.forEach(({ particle }) => particle.destroy());
        fireworksLayer.draw();
      }, 1000);
    };
  
    const numFireworks = 10;
    for (let i = 0; i < numFireworks; i++) {
      setTimeout(() => {
        const x = Math.random() * stage.width();
        const y = Math.random() * stage.height();
        createExplosion(x, y);
      }, i * 200);
    }
  

  };

  // Phát âm thanh tự động khi trang tải và khi từ đúng được chọn
  addWordsToCanvas();
  playSound();

  // Thêm sự kiện cho nút "Play Sound Again"
  document.getElementById('playSoundAgainBtn').addEventListener('click', replaySound);

  // Đảm bảo canvas phản hồi khi thay đổi kích thước cửa sổ
  window.addEventListener('resize', () => {
    stage.width(window.innerWidth);
    stage.height(window.innerHeight);
    layer.destroyChildren();
    messageLayer.destroyChildren();
    addWordsToCanvas();
  });
});
