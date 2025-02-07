/***** Bouncing and Draggable Balls *****/
const balls = document.querySelectorAll('.ball');
const splash = document.getElementById('splash');
const directory = document.getElementById('directory');
const backButton = document.querySelector('.back-button');
const content = document.getElementById('content');
const centerObject = document.getElementById('center-object');

const ballData = [];

// Initialize ball properties
balls.forEach(ball => {
  const rect = ball.getBoundingClientRect();
  ballData.push({
    el: ball,
    x: rect.left,
    y: rect.top,
    vx: (Math.random() * 2 + 1) * (Math.random() < 0.5 ? 1 : -1),
    vy: (Math.random() * 2 + 1) * (Math.random() < 0.5 ? 1 : -1),
    dragging: false,
    offsetX: 0,
    offsetY: 0
  });
});

// Utility: Clamp function
function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

// Animation loop to update positions and handle collisions
function animate() {
  // Get bounding rectangle for the stationary center object each frame
  let centerRect = centerObject.getBoundingClientRect();
  
  ballData.forEach(data => {
    if (!data.dragging) {
      // Update ball position
      data.x += data.vx;
      data.y += data.vy;
      
      // Bounce off window edges
      if (data.x <= 0 || data.x + 100 >= window.innerWidth) data.vx *= -1;
      if (data.y <= 0 || data.y + 100 >= window.innerHeight) data.vy *= -1;
      
      // Collision detection with center object (circle-rectangle collision)
      let ballCenterX = data.x + 50;
      let ballCenterY = data.y + 50;
      let closestX = clamp(ballCenterX, centerRect.left, centerRect.right);
      let closestY = clamp(ballCenterY, centerRect.top, centerRect.bottom);
      let dx = ballCenterX - closestX;
      let dy = ballCenterY - closestY;
      let distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 50) { // 50 = ball radius
        // Avoid divide-by-zero; choose an arbitrary normal if needed.
        if (distance === 0) {
          dx = 1;
          dy = 0;
          distance = 1;
        }
        // Calculate normalized collision vector
        let nx = dx / distance;
        let ny = dy / distance;
        // Reflect velocity using v' = v - 2*(v dot n)*n
        let dot = data.vx * nx + data.vy * ny;
        data.vx = data.vx - 2 * dot * nx;
        data.vy = data.vy - 2 * dot * ny;
        // Push ball out of collision
        let overlap = 50 - distance;
        data.x += nx * overlap;
        data.y += ny * overlap;
      }
      
      // Apply new position to the element
      data.el.style.left = data.x + 'px';
      data.el.style.top = data.y + 'px';
    }
  });
  
  requestAnimationFrame(animate);
}
animate();

// Dragging events for balls
balls.forEach((ball, index) => {
  ball.addEventListener('mousedown', (e) => {
    ballData[index].dragging = true;
    ballData[index].offsetX = e.clientX - ballData[index].x;
    ballData[index].offsetY = e.clientY - ballData[index].y;
  });
});
document.addEventListener('mousemove', (e) => {
  ballData.forEach(data => {
    if (data.dragging) {
      data.x = e.clientX - data.offsetX;
      data.y = e.clientY - data.offsetY;
      data.el.style.left = data.x + 'px';
      data.el.style.top = data.y + 'px';
    }
  });
});
document.addEventListener('mouseup', () => {
  ballData.forEach(data => data.dragging = false);
});

// On click, open the corresponding directory (ignoring drag events)
balls.forEach(ball => {
  ball.addEventListener('click', (e) => {
    openDirectory(ball.getAttribute('data-target'));
  });
});

/***** Directory Content Loading *****/
function openDirectory(category) {
  splash.style.display = 'none';
  directory.style.display = 'block';
  content.innerHTML = ''; // Clear previous content
  
  // Sample directory structure. Update with your actual project files.
  const sections = {
    audio: {
      title: "Audio – I hear",
      projects: [
        "Sound meditation part 1#03 mergedsoundmeditationharshsick.wav",
        "Record #05",
        "Palm_Reading_Brighton_beach.wav",
        "Audio Ergo Sum Archive/Whitepaper",
        "Virgin Panhandle E.P. (virginpanhandle.m4a)",
        "Hammock Album"
      ]
    },
    video: {
      title: "Video – I see",
      projects: [
        "Floor Papers/Street Literature ebook",
        "Oscilloscope",
        "Additional archival materials",
        "Aphorisms revised",
        "Soft Ukrainaian Wood",
        "Camera shed",
        "Website Walkthrough Sped up version"
      ]
    },
    disco: {
      title: "Disco – I learn",
      projects: [
        "Bino rivalry film and infrastructure",
        "Consciousness studies",
        "Neuroscience/AI stuff",
        "Internet running document/interactive bibliography"
      ]
    },
    dico: {
      title: "Dico – I say/speak",
      projects: [
        "Project examples..."
      ]
    },
    cogito: {
      title: "Cogito – I think",
      projects: [
        "Mindmaps",
        "Algorithm stuff",
        "GUI pipeline proposals",
        "Longplayer",
        "samsweb working prototype",
        "Pupillopmetry code?",
        "Cad Models?"
      ]
    },
    lego: {
      title: "Lego – I read/gather",
      projects: [
        "References/Bibliographic materials",
        "Curation photographs/Table spread bitmaps/Sacred Objects",
        "Bulk Miscellaneous Archives"
      ]
    },
    scribo: {
      title: "Scribo – I write",
      projects: [
        "Gesso",
        "Drugs/sobriety (running document)",
        "Running Text Block (Patreon Subscription)",
        "Etymological development of linguistic and conceptual pseudo-temporal-multi-modal gui frameworks in Bloodborne collaborative article"
      ]
    }
  };
  
  if (sections[category]) {
    const section = sections[category];
    const sectionDiv = document.createElement('div');
    sectionDiv.className = 'project-section';
    const h2 = document.createElement('h2');
    h2.textContent = section.title;
    sectionDiv.appendChild(h2);
    
    const ul = document.createElement('ul');
    section.projects.forEach(proj => {
      const li = document.createElement('li');
      li.textContent = proj;
      ul.appendChild(li);
    });
    sectionDiv.appendChild(ul);
    content.appendChild(sectionDiv);
  } else {
    content.textContent = "No content available for this category.";
  }
}

// Back button returns to splash page
backButton.addEventListener('click', () => {
  directory.style.display = 'none';
  splash.style.display = 'block';
});

/***** Video Controls (Example) *****/
const playPauseBtn = document.getElementById('playPauseBtn');
const muteUnmuteBtn = document.getElementById('muteUnmuteBtn');
const fullscreenVideo = document.getElementById('fullscreenVideo');

if (fullscreenVideo) {
  playPauseBtn.addEventListener('click', () => {
    if (fullscreenVideo.paused) {
      fullscreenVideo.play();
      playPauseBtn.textContent = 'Pause';
    } else {
      fullscreenVideo.pause();
      playPauseBtn.textContent = 'Play';
    }
  });
  
  muteUnmuteBtn.addEventListener('click', () => {
    fullscreenVideo.muted = !fullscreenVideo.muted;
    muteUnmuteBtn.textContent = fullscreenVideo.muted ? 'Unmute' : 'Mute';
  });
}
