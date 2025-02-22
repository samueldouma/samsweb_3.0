// Module aliases from Matter.js
const { Engine, Render, Runner, Bodies, Composite, Mouse, MouseConstraint, Events } = Matter;

// Create engine and renderer
const engine = Engine.create();
const canvas = document.getElementById("canvas");
const render = Render.create({
  canvas: canvas,
  engine: engine,
  options: {
    width: window.innerWidth,
    height: window.innerHeight,
    background: "#000",
    wireframes: false,
    pixelRatio: window.devicePixelRatio
  }
});

// Create boundaries to keep objects in view
function createBoundaries() {
  const thickness = 50;
  const width = window.innerWidth;
  const height = window.innerHeight;
  const boundaries = [
    Bodies.rectangle(width / 2, -thickness / 2, width, thickness, { isStatic: true }),
    Bodies.rectangle(width / 2, height + thickness / 2, width, thickness, { isStatic: true }),
    Bodies.rectangle(-thickness / 2, height / 2, thickness, height, { isStatic: true }),
    Bodies.rectangle(width + thickness / 2, height / 2, thickness, height, { isStatic: true })
  ];
  Composite.add(engine.world, boundaries);
}
createBoundaries();

// Create an invisible static body at the center for collisions.
// Its dimensions roughly match the overlay text area.
const centerX = window.innerWidth / 2;
const centerY = window.innerHeight / 2;
const centerWidth = 400; // adjust as needed
const centerHeight = 100; // adjust as needed
const centerBody = Bodies.rectangle(centerX, centerY, centerWidth, centerHeight, {
  isStatic: true,
  render: { visible: false }
});
Composite.add(engine.world, centerBody);

// Directory buttons (bouncing circles) with labels and page links
const directories = [
  { label: "Audio", link: "audio.html" },
  { label: "Video", link: "video.html" },
  { label: "Disco", link: "disco.html" },
  { label: "Dico", link: "dico.html" },
  { label: "Cogito", link: "cogito.html" },
  { label: "Lego", link: "lego.html" },
  { label: "Scribo", link: "scribo.html" }
];

const circles = [];
const circleRadius = 80;
directories.forEach((dir) => {
  const circle = Bodies.circle(
    Math.random() * (window.innerWidth - 2 * circleRadius) + circleRadius,
    Math.random() * (window.innerHeight - 2 * circleRadius) + circleRadius,
    circleRadius,
    {
      restitution: 0.9,
      friction: 0.005,
      render: {
        fillStyle: "#fff",
        strokeStyle: "#fff",
        lineWidth: 2
      }
    }
  );
  circle.directory = dir;
  circles.push(circle);
});
Composite.add(engine.world, circles);

// Add mouse control for dragging circles
const mouse = Mouse.create(render.canvas);
const mouseConstraint = MouseConstraint.create(engine, {
  mouse: mouse,
  constraint: { stiffness: 0.2, render: { visible: false } }
});
Composite.add(engine.world, mouseConstraint);
render.mouse = mouse;

// On canvas click, check if the click was inside any circle and navigate accordingly.
render.canvas.addEventListener("click", () => {
  const mousePos = mouse.position;
  for (let circle of circles) {
    const dx = mousePos.x - circle.position.x;
    const dy = mousePos.y - circle.position.y;
    if (Math.sqrt(dx * dx + dy * dy) <= circleRadius) {
      window.location.href = circle.directory.link;
      break;
    }
  }
});

// Draw labels on the circles after rendering
Events.on(render, "afterRender", () => {
  const context = render.context;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = "20px 'Helvetica Neue'";
  circles.forEach((circle) => {
    context.fillStyle = "#000";
    context.fillText(circle.directory.label, circle.position.x, circle.position.y);
  });
});

Render.run(render);
Runner.run(Runner.create(), engine);

window.addEventListener("resize", () => {
  render.canvas.width = window.innerWidth;
  render.canvas.height = window.innerHeight;
});

