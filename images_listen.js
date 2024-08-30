document.addEventListener('DOMContentLoaded', function () {
 // Định nghĩa mảng với các giá trị start và end tương ứng cho từng chữ cái
  const WORD_LIST = [
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
    { letter: 'Z', start: 50.178904, end: 52.27473 }
  ];

  let remainingWords;
  let currentWord;
  let WORD_NUMBER = 12;
  let addedImage = [];
 


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

  function playAudioFromTo(word) {
    if (word) {
      console.log("playAudioFromTo::" + word.letter);
      const audio = new Audio('assets/ocpd_01_the_alphabet.mp3');
      audio.playbackRate = 0.65;
      // Cài đặt thời gian bắt đầu
      audio.currentTime = word.start;

      // Phát âm thanh
      audio.play();

      // Theo dõi thời gian và dừng âm thanh khi đạt đến thời gian kết thúc
      audio.addEventListener('timeupdate', () => {
        if (audio.currentTime >= word.end) {
          audio.pause();
        }
      });
    }

}

  // Phát âm thanh bằng speechSynthesis
  function playSound() {
    currentWord= remainingWords[Math.floor(Math.random() * remainingWords.length)];
    playAudioFromTo(currentWord);
  }

  // Phát lại âm thanh hiện tại
  function replaySound() {
    playAudioFromTo(currentWord);
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


      // Hàm kiểm tra nếu hai hình ảnh bị chồng lên nhau
      function isOverlapping(x, y, padding, imageSize, images) {
        for (let img of images) {
            if (x < img.x + imageSize + padding && x + imageSize > img.x - padding &&
                y < img.y + imageSize + padding && y + imageSize > img.y - padding) {
                return true;
            }
        }
        return false;
    }

  // Hàm để tải hình ảnh vào canvas
    function addImagesToCanvas(resize=false) {
      if (resize==false) {
        remainingWords = getRandomSubset(WORD_LIST, WORD_NUMBER);
      }
      layer.destroyChildren(); // Xóa tất cả các từ hiện có trên canvas
      const imageSize = 50; // Kích thước của hình ảnh (giả định tất cả hình ảnh có cùng kích thước)
      const padding = 5; // Khoảng cách tối thiểu giữa các hình ảnh

      remainingWords.forEach((word) => {

            // let x = Math.random() * (stage.width() - imageSize);
            // let y = Math.random() * (stage.height() - imageSize);

          let x, y;
          do {
              x = Math.random() * (stage.width() - imageSize);
              y = Math.random() * (stage.height() - imageSize);
          } while (isOverlapping(x, y, padding, imageSize,  addedImage));

            addedImage.push({x:x, y:y});
          let path = `assets/image/${word.letter}.webp`;

          const imageObj = new Image();
          imageObj.onload = function() {
            //console.log('Image loaded:', imageObj.src); // Kiểm tra xem hình ảnh có được tải không

              const image = new Konva.Image({
                  x: x, // Sử dụng tọa độ đã tính toán
                  y: y, // Sử dụng tọa độ đã tính toán
                  image: imageObj,
                  width: imageSize,
                  height: imageSize,
                  draggable: true,
                  id: path // Sử dụng đường dẫn hình ảnh làm ID
              });

              // Thêm hình ảnh vào layer và vẽ lại canvas
              layer.add(image);
            // layer.draw();

              image.on('mouseover', () => {
                  document.body.style.cursor = 'pointer';
                  image.width(imageSize * 2);
                  image.height(imageSize * 2);
                  layer.draw();
              });

              image.on('mouseout', () => {
                  document.body.style.cursor = 'default';
                  image.width(imageSize);
                  image.height(imageSize);
                  layer.draw();
              });

              image.on('click', () => {
                  handleImageClick(image, word);
              });

              image.on('tap', () => {
              
                  handleImageClick(image, word);
              });

              function handleImageClick(image, word) {
                  if (word.letter === currentWord.letter) {
                      // image.destroy();
                      // layer.draw();
                      shrinkAndDisappear(image);
                      remainingWords = remainingWords.filter(w => w !== word);             
                      if (remainingWords.length > 0) {
                          setTimeout(() => {
                              playSound();
                          }, 1000 / 2); // Phát âm từ mới sau khi thông báo
                      } else {
                          setTimeout(() => {
                              showFireworks();
                            
                              addImagesToCanvas();
                              playSound();
                          }, 1000 / 2);
                      }
                  } else {
                      replaySound();
                      shakeImage(image);
                  }
              }

              // Thêm hình ảnh vào layer và vẽ lại canvas
              // layer.add(image);
              // layer.draw();

              // Điều chỉnh vị trí của hình ảnh sau khi tất cả đã được thêm vào
            //  setTimeout(() => adjustPositionForOverlapping(), 1000);

          };
          imageObj.src = path;
      });

      layer.draw();
  }

  // Function to apply the shrinking and disappearing effect
  // Function to apply the shrinking and disappearing effect
  function shrinkAndDisappear(imageNode) {
    console.log("shrinkAndDisappear");
    const anim = new Konva.Animation((frame) => {
      const scale = imageNode.scaleX() - frame.timeDiff / 500; // Tính tỷ lệ thu nhỏ
      if (scale <= 0) {
        imageNode.scale({ x: 0, y: 0 });
        imageNode.opacity(0);
        anim.stop();
        imageNode.destroy(); // Xóa hình ảnh khỏi lớp
        layer.batchDraw(); // Vẽ lại lớp
      } else {
        imageNode.scale({ x: scale, y: scale });
        imageNode.opacity(scale);
        layer.batchDraw(); // Vẽ lại lớp
      }
    }, layer);
    anim.start();
  }
  

function shakeImage(image) {
  const amplitude = 10; // Tăng biên độ rung
  const duration = 0.1; // Thời gian rung (tăng có thể tạo hiệu ứng mạnh hơn)

  const originalX = image.x();
  const originalY = image.y();

  // Tạo tween di chuyển sang phải
  const tweenRight = new Konva.Tween({
      node: image,
      duration: duration,
      x: originalX + amplitude,
      y: originalY,
      easing: Konva.Easings.EaseInOut,
      onFinish: () => {
          // Tạo tween di chuyển sang trái
          const tweenLeft = new Konva.Tween({
              node: image,
              duration: duration,
              x: originalX - amplitude,
              y: originalY,
              easing: Konva.Easings.EaseInOut,
              onFinish: () => {
                  // Tạo tween quay lại vị trí ban đầu
                  const tweenBack = new Konva.Tween({
                      node: image,
                      duration: duration,
                      x: originalX,
                      y: originalY,
                      easing: Konva.Easings.EaseInOut,
                  });
                  tweenBack.play();
              },
          });
          tweenLeft.play();
      },
  });

  tweenRight.play();
}

  function startMesssage() {
    var modalCenter = new bootstrap.Modal(document.getElementById('modalCenter'));
    modalCenter.show();
  }

  function getRandomSubset(array, numItems) {
    const shuffled = array.slice(0); // Tạo bản sao của array
    let i = array.length, temp, index;
    
    // Shuffling array
    while (i--) {
      index = Math.floor((i + 1) * Math.random());
      temp = shuffled[index];
      shuffled[index] = shuffled[i];
      shuffled[i] = temp;
    }
    
    // Lấy một số lượng phần tử
    return shuffled.slice(0, numItems);
  }

  function restartGame () {
    addImagesToCanvas();
    playSound();
  }

  document.getElementById('refreshBtn').addEventListener('click', function() {
    var button = this;
    button.disabled = true; // Disable the button
    button.classList.add('btn-warning');
    restartGame () ;
    // Simulate an action with a timeout (e.g., AJAX request)
    setTimeout(function() {
      button.disabled = false; // Enable the button after 3 seconds (for demo purposes)
      button.classList.remove('btn-warning');
    }, 1000);
  });


  document.getElementById('playSoundAgainBtn').addEventListener('click', function() {
    var button = this;
    button.disabled = true; // Disable the button
    replaySound () ;
    button.classList.add('btn-warning');
    // Simulate an action with a timeout (e.g., AJAX request)
    setTimeout(function() {
      button.disabled = false; // Enable the button after 3 seconds (for demo purposes)
      button.classList.remove('btn-warning');
    }, 1000);
  });

  // Thêm sự kiện cho nút "Play Sound Again"
  // document.getElementById('playSoundAgainBtn').addEventListener('click', replaySound);
  //document.getElementById('refreshBtn').addEventListener('click', restartGame);
  document.getElementById('startBtn').addEventListener('click', restartGame);
  
  // Đảm bảo canvas phản hồi khi thay đổi kích thước cửa sổ
  window.addEventListener('resize', () => {
    stage.width(window.innerWidth);
    stage.height(window.innerHeight);
    layer.destroyChildren();
    messageLayer.destroyChildren();
    addImagesToCanvas(true);
  });

  // Phát âm thanh tự động khi trang tải và khi từ đúng được chọn
  //restartGame ();
  startMesssage();

});
