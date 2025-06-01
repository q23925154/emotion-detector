let model, webcam, labelContainer, maxPredictions;
let intervalId;

// Teachable Machine 預訓練模型網址
const modelURL = "model/model.json";
const metadataURL = "model/metadata.json";

// 預載模型
async function init() {
  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();

  webcam = new tmImage.Webcam(200, 200, true); // width, height, flip
  await webcam.setup();
  await webcam.play();
  window.requestAnimationFrame(loop);

  document.getElementById("webcam").appendChild(webcam.canvas);
}

// 偵測主迴圈
async function loop() {
  webcam.update();
  window.requestAnimationFrame(loop);
}

// 辨識一次
async function predict() {
  const prediction = await model.predict(webcam.canvas);
  prediction.sort((a, b) => b.probability - a.probability);

  const best = prediction[0];
  document.getElementById("label").innerText = best.className;
  document.getElementById("confidence").innerText = `信心度：${(best.probability * 100).toFixed(2)}%`;
}

// 開始辨識
document.getElementById("start-btn").addEventListener("click", async () => {
  if (!model) {
    await init();
  }

  intervalId = setInterval(predict, 1000);
});

// 停止辨識
document.getElementById("stop-btn").addEventListener("click", () => {
  clearInterval(intervalId);
  document.getElementById("label").innerText = "已停止";
  document.getElementById("confidence").innerText = "";
});

