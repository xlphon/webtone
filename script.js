// 初始基频
const initialFrequency = 220; // 假设初始基频为220Hz
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let oscillator = null;
let gainNode = null;

// 试验数据变量
let adjustmentCount = 0;
let startTime = null;
let lastFrequency = null;

const slider = document.getElementById('audio-slider');

// 播放初始音频（i 音）
document.getElementById('play-initial').addEventListener('click', () => {
    playVowelTone(initialFrequency, 1); // 播放初始音频1秒
    startTrial(); // 开始新试验
});

// 开始试验
function startTrial() {
    adjustmentCount = 0;
    startTime = new Date().getTime(); // 记录开始时间
    lastFrequency = null;
    console.log("Trial started");
}

// 播放指定频率的“i”音
function playVowelTone(frequency, duration) {
    if (oscillator) {
        oscillator.stop(); // 停止当前音调
    }

    // 创建主振荡器作为基频
    oscillator = audioContext.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);

    // 使用增益节点控制音量
    gainNode = audioContext.createGain();
    gainNode.gain.value = 0.5; // 控制音量

    // 创建带通滤波器，模拟“i”音的音色特征
    const formantFilter1 = audioContext.createBiquadFilter();
    formantFilter1.type = 'bandpass';
    formantFilter1.frequency.setValueAtTime(300, audioContext.currentTime); // 第一个共振峰

    const formantFilter2 = audioContext.createBiquadFilter();
    formantFilter2.type = 'bandpass';
    formantFilter2.frequency.setValueAtTime(2200, audioContext.currentTime); // 第二个共振峰

    // 将振荡器连接到滤波器和增益节点
    oscillator.connect(formantFilter1);
    formantFilter1.connect(formantFilter2);
    formantFilter2.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // 启动振荡器
    oscillator.start();

    // 停止音调
    setTimeout(() => {
        oscillator.stop();
    }, duration * 1000);
}

// 根据滑块值映射到基频
function getFrequencyFromSlider(value) {
    const minFrequency = 180;
    const maxFrequency = 300;
    return minFrequency + (maxFrequency - minFrequency) * (value - 1) / 9;
}

// 滑块事件监听
slider.addEventListener('input', () => {
    const sliderValue = slider.value;

    // 记录调整次数
    adjustmentCount += 1;

    // 获取滑块对应的频率
    const frequency = getFrequencyFromSlider(sliderValue);

    // 播放生成的“i”音调
    playVowelTone(frequency, 0.5); // 播放0.5秒
    lastFrequency = frequency;
});

// 结束试验并记录数据
function endTrial() {
    const endTime = new Date().getTime(); // 记录结束时间
    const totalAdjustmentTime = (endTime - startTime) / 1000; // 计算调整总时间（秒）

    // 计算最终差异度（以频率差值表示）
    const frequencyDifference = Math.abs(initialFrequency - lastFrequency);

    // 输出试验结果
    console.log("Trial ended");
    console.log("调整次数:", adjustmentCount);
    console.log("总调整时间 (秒):", totalAdjustmentTime);
    console.log("最终频率差异:", frequencyDifference);
}
