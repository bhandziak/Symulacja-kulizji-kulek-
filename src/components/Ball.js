class Ball {
    constructor(x, y, color, context) {
        this.x = x
        this.y = y
        this.color = color
        this.context = context
    }
    drawBall() {
        console.log(this.context)
        this.context.beginPath();
        this.context.arc(this.x, this.y, 50, 0, 2 * Math.PI);
        this.context.fillStyle = this.color
        this.context.fill();
    }

}

export default Ball