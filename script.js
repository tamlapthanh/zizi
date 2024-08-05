document.addEventListener('DOMContentLoaded', function () {
  const allWords = [
    'cat', 'dog', 'bird', 'fish', 'horse', 'cow', 'sheep', 'goat',
    'duck', 'chicken', 'rabbit', 'pig', 'elephant', 'tiger', 'lion',
    'bear', 'monkey', 'kangaroo', 'penguin', 'giraffe', 'zebra', 'deer'
  ];
  const numWordsToShow = 6;
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
        fontSize: 46,
        fontFamily: 'Calibri',
        fill: 'black',
        draggable: true,
        id: word
      });

      text.on('mouseover', () => {
        document.body.style.cursor = 'pointer';
      });

      text.on('mouseout', () => {
        document.body.style.cursor = 'default';
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

  

  // Phát âm thanh bằng speechSynthesis
  function playSound() {
    const randomWord = remainingWords[Math.floor(Math.random() * remainingWords.length)];
    currentWord = randomWord;

    const utterance = new SpeechSynthesisUtterance(randomWord);
    utterance.lang = "en-US";
    const femaleVoice = getFemaleVoice();
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }
    speechSynthesis.speak(utterance);
  }

  // Phát lại âm thanh hiện tại
  function replaySound() {
    const utterance = new SpeechSynthesisUtterance(currentWord);
    utterance.lang = "en-US";
    const femaleVoice = getFemaleVoice();
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }
    speechSynthesis.speak(utterance);
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
  
    // Reset the game after the fireworks effect
    setTimeout(() => {
      const selectedCategory = document.getElementById('vocabSelect').value;
      const selectedNum = document.getElementById('vocabNum').value;
  
      createObjects(); // Reset with the same category
    }, 3000); // Wait for fireworks to finish before resetting
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
