// Solar System Simulation Controls
document.addEventListener('DOMContentLoaded', () => {
    // Speed control
    let speed = 1;
    const orbits = document.querySelectorAll('.orbit');
    
    // Function to update animation speed
    function updateSpeed() {
        orbits.forEach(orbit => {
            const computedStyle = window.getComputedStyle(orbit);
            const currentAnimation = computedStyle.animation;
            if (currentAnimation && currentAnimation !== 'none') {
                // Extract the original duration from the animation
                const durationMatch = currentAnimation.match(/([\d.]+)(s|ms)/);
                if (durationMatch) {
                    const originalDuration = parseFloat(durationMatch[1]);
                    const unit = durationMatch[2];
                    const newDuration = originalDuration / speed;
                    
                    // Apply new duration to the animation
                    orbit.style.animationDuration = newDuration + unit;
                }
            }
        });
    }
    
    // Add speed controls to the page
    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'controls';
    controlsDiv.innerHTML = `
        <button id="speedUp">加速</button>
        <button id="speedDown">减速</button>
        <button id="pauseResume">暂停/继续</button>
        <div>速度: <span id="speedValue">1x</span></div>
    `;
    document.body.appendChild(controlsDiv);
    
    // Add CSS for controls
    const style = document.createElement('style');
    style.innerHTML = `
        .controls {
            position: absolute;
            top: 20px;
            left: 20px;
            z-index: 100;
            background: rgba(0, 0, 0, 0.7);
            padding: 15px;
            border-radius: 10px;
            color: white;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        
        .controls button {
            padding: 8px 15px;
            background: #444;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
        
        .controls button:hover {
            background: #666;
        }
    `;
    document.head.appendChild(style);
    
    // Add event listeners to buttons
    document.getElementById('speedUp').addEventListener('click', () => {
        speed = Math.min(speed + 0.5, 10);
        document.getElementById('speedValue').textContent = speed + 'x';
        updateSpeed();
    });
    
    document.getElementById('speedDown').addEventListener('click', () => {
        speed = Math.max(speed - 0.5, 0.5);
        document.getElementById('speedValue').textContent = speed + 'x';
        updateSpeed();
    });
    
    let isPaused = false;
    const pauseResumeBtn = document.getElementById('pauseResume');
    pauseResumeBtn.addEventListener('click', () => {
        isPaused = !isPaused;
        orbits.forEach(orbit => {
            if (isPaused) {
                orbit.style.animationPlayState = 'paused';
            } else {
                orbit.style.animationPlayState = 'running';
            }
        });
        pauseResumeBtn.textContent = isPaused ? '继续' : '暂停';
    });
    
    // Initialize speeds
    updateSpeed();
    
    // Add information panel
    const infoDiv = document.createElement('div');
    infoDiv.className = 'info-panel';
    infoDiv.innerHTML = `
        <h3>太阳系行星信息</h3>
        <p><strong>水星 (Mercury)</strong>: 最接近太阳的行星，表面温度变化极大</p>
        <p><strong>金星 (Venus)</strong>: 被称为"晨星"或"昏星"，拥有浓厚的大气层</p>
        <p><strong>地球 (Earth)</strong>: 我们的家园，目前宇宙中唯一已知存在生命的星球</p>
        <p><strong>火星 (Mars)</strong>: 被称为"红色星球"，拥有太阳系最大的火山</p>
        <p><strong>木星 (Jupiter)</strong>: 太阳系中最大的行星，是一颗气态巨行星</p>
        <p><strong>土星 (Saturn)</strong>: 以其壮观的环系统而闻名</p>
        <p><strong>天王星 (Uranus)</strong>: 几乎是"躺着"绕太阳公转的冰巨行星</p>
        <p><strong>海王星 (Neptune)</strong>: 太阳系中最远的行星，风速极高</p>
    `;
    document.body.appendChild(infoDiv);
    
    // Add CSS for info panel
    const infoStyle = document.createElement('style');
    infoStyle.innerHTML = `
        .info-panel {
            position: absolute;
            bottom: 20px;
            left: 20px;
            z-index: 100;
            background: rgba(0, 0, 0, 0.7);
            padding: 15px;
            border-radius: 10px;
            color: white;
            max-width: 300px;
            font-size: 14px;
            line-height: 1.5;
        }
        
        .info-panel h3 {
            margin-top: 0;
            color: #ffd700;
        }
        
        .info-panel p {
            margin: 8px 0;
        }
    `;
    document.head.appendChild(infoStyle);
});