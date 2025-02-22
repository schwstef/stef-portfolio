const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = 800;
canvas.height = 600;

// Ball class
class Ball {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.dx = (Math.random() - 0.5) * 8; // Random horizontal velocity
        this.dy = (Math.random() - 0.5) * 8; // Random vertical velocity
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    update() {
        // Bounce off walls
        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
            this.dx = -this.dx;
        }
        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
            this.dy = -this.dy;
        }

        // Check collisions with other balls
        balls.forEach(otherBall => {
            if (this === otherBall) return; // Skip self

            const dx = this.x - otherBall.x;
            const dy = this.y - otherBall.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.radius + otherBall.radius) {
                // Collision detected - calculate new velocities
                const angle = Math.atan2(dy, dx);
                const sin = Math.sin(angle);
                const cos = Math.cos(angle);

                // Rotate velocities
                const vx1 = this.dx * cos + this.dy * sin;
                const vy1 = this.dy * cos - this.dx * sin;
                const vx2 = otherBall.dx * cos + otherBall.dy * sin;
                const vy2 = otherBall.dy * cos - otherBall.dx * sin;

                // Swap the velocities
                this.dx = vx2 * cos - vy1 * sin;
                this.dy = vy1 * cos + vx2 * sin;
                otherBall.dx = vx1 * cos - vy2 * sin;
                otherBall.dy = vy2 * cos + vx1 * sin;

                // Move balls apart to prevent sticking
                const overlap = (this.radius + otherBall.radius - distance) / 2;
                this.x += overlap * cos;
                this.y += overlap * sin;
                otherBall.x -= overlap * cos;
                otherBall.y -= overlap * sin;
            }
        });

        // Update position
        this.x += this.dx;
        this.y += this.dy;

        this.draw();
    }
}

// Create balls
const balls = [
    new Ball(400, 300, 20, 'red'),
    new Ball(200, 200, 20, 'blue'),
    new Ball(600, 400, 20, 'green'),
    new Ball(300, 500, 20, 'purple'),
    new Ball(500, 100, 20, 'white'),
    // Adding 4 more green balls at different starting positions
    new Ball(150, 150, 20, 'green'),
    new Ball(450, 250, 20, 'green'),
    new Ball(350, 400, 20, 'green'),
    new Ball(550, 300, 20, 'green')
];

// Animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    balls.forEach(ball => {
        ball.update();
    });

    requestAnimationFrame(animate);
}

// Start animation
animate(); 