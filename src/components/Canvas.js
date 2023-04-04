
import React, { useRef, useEffect, createRef, useState } from 'react'





class CanvasScene extends React.Component {
    constructor(props) {
        super(props);
        this.myRef = React.createRef();
        this.readMouseLocation = this.readMouseLocation.bind(this);
        this.timer = null;
        this.ballFrictionY = 0.99 //was 0.99
        this.ballFrictionX = 0.99 //was 0.995
        this.radius = 15
        this.radiusOfMap = window.innerHeight / 2.5
        this.massOfBall = 0.1

        this.gravityVal = 0.1

        this.numbersOfBalls = 15
        this.spawnSpreadVal = 200
        this.centerX = window.innerWidth / 2
        this.centerY = window.innerHeight / 2

        this.state = {
            x: 0,
            y: 0,
            context: null,
            canvas: null,

            tabOfBalls: []
        }

    }
    randomColor() {
        return "#" + Math.floor(Math.random() * 16777215).toString(16);
    }

    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    async componentDidMount() {
        let canvas = this.myRef.current
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight

        let context = canvas.getContext("2d")

        await this.setState({
            canvas: canvas,
            context: context
        })

        this.createBalls(this.numbersOfBalls);
        this.drawMap()

        this.startInterval()
    }




    componentWillUnmount() {
        clearInterval(this.timer)
    }
    startInterval() {
        console.log('działa')
        this.timer = setInterval(() => {
            this.gravity()
        }, 25)
    }

    async createBalls(howMuch) {
        let arrayOfBalls = []
        let that = this

        for (let i = 0; i < howMuch; i++) {
            let ObjBall = {
                x: that.getRandomInt(this.centerX - this.spawnSpreadVal, this.centerX + this.spawnSpreadVal),
                y: that.getRandomInt(this.centerY - this.spawnSpreadVal, this.centerY + this.spawnSpreadVal),
                color: that.randomColor(),
                velosityY: this.getRandomInt(1, 5),
                velosityX: this.getRandomInt(-2, 2),
                mass: this.massOfBall
            }

            if (i != 0) {
                let overlap = false
                for (let j = 0; j < arrayOfBalls.length; j++) {
                    let newBall = arrayOfBalls[j]

                    if (this.getDistance(ObjBall, newBall) < 2 * this.radius) {
                        i--
                        overlap = true
                        break
                    }
                }
                if (!overlap) {
                    arrayOfBalls.push(ObjBall)
                }

            } else {
                arrayOfBalls.push(ObjBall)
            }



        }
        await this.setState({
            tabOfBalls: arrayOfBalls
        })

    }



    drawMap() {

        this.state.context.beginPath();
        this.state.context.arc(window.innerWidth / 2, window.innerHeight / 2, this.radiusOfMap, 0, 2 * Math.PI);
        this.state.context.fillStyle = 'rgba(20, 159, 184, 0.2)';
        this.state.context.lineWidth = 10;
        this.state.context.strokeStyle = '#149fb8'
        this.state.context.stroke();
        this.state.context.fill();
    }

    getDistance(Ball1, Ball2) {
        return Math.sqrt((Ball1.x - Ball2.x) ** 2 + (Ball1.y - Ball2.y) ** 2)
    }

    rotateVector(Ball, angle) {
        const rotatedVel = {
            x: Ball.velosityX * Math.cos(angle) - Ball.velosityY * Math.sin(angle),
            y: Ball.velosityX * Math.sin(angle) + Ball.velosityY * Math.cos(angle)
        };

        return rotatedVel;
    }

    getAngle(Ball1, Ball2) {
        return Math.atan2(Ball1.x - Ball2.x, Ball1.y - Ball2.y)
    }


    calcCollision(Ball1, Ball2) {
        let velocityXDiff = Ball1.velosityX - Ball2.velosityX;
        let VelocityYDiff = Ball1.velosityY - Ball2.velosityY;

        let xDist = Ball2.x - Ball1.x;
        let yDist = Ball2.y - Ball1.y;
        if (velocityXDiff * xDist + VelocityYDiff * yDist >= 0) {

            const angle = -this.getAngle(Ball1, Ball2)

            const m1 = Ball1.mass;
            const m2 = Ball2.mass;

            let u1 = this.rotateVector(Ball1, angle);
            let u2 = this.rotateVector(Ball2, angle);

            let v1 = { velosityX: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), velosityY: u1.y };
            let v2 = { velosityX: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), velosityY: u2.y };

            let v1Res = this.rotateVector(v1, -angle);
            let v2Res = this.rotateVector(v2, -angle);

            Ball1.velosityX = v1Res.x;
            Ball1.velosityY = v1Res.y;

            Ball1.x = Ball1.x + Ball1.velosityX
            Ball1.y = Ball1.y + Ball1.velosityY

            Ball2.velosityX = v2Res.x;
            Ball2.velosityY = v2Res.y;

            Ball2.x = Ball2.x + Ball2.velosityX
            Ball2.y = Ball2.y + Ball2.velosityY
        }
    }

    collisionDetection(tabOfBalls) {
        let newTabOfBalls = []
        let collision = false
        for (let i = 0; i < tabOfBalls.length; i++) {
            let Ball1 = tabOfBalls[i]
            for (let j = 0; j < tabOfBalls.length; j++) {
                let Ball2 = tabOfBalls[j]
                if (j != i && this.getDistance(Ball1, Ball2) <= 2 * this.radius && this.getDistance({ x: this.centerX, y: this.centerY }, Ball1) < this.radiusOfMap - this.radius) {

                    this.calcCollision(Ball1, Ball2)
                    collision = true
                    break
                }

            }
        }
        return [tabOfBalls, collision]
    }

    reflectFromBorder(Ball) {
        let center = { x: this.centerX, y: this.centerY }
        let angle = this.getAngle(center, Ball)

        let len = Math.sqrt(Ball.velosityX ** 2 + Ball.velosityY ** 2)

        Ball.velosityX = Math.cos(angle) * len
        Ball.velosityY = Math.sin(angle) * len

        if (Ball.x - this.centerX < 0) {
            Ball.velosityX = - Ball.velosityX
            Ball.velosityY = - Ball.velosityY
        }

        if (Ball.y - this.centerY < 0) {
            Ball.velosityX = - Ball.velosityX
            Ball.velosityY = - Ball.velosityY
        }

        if (Math.floor(Math.abs(angle) * 10) / 10 == 3.1) {
            Ball.velosityY = this.getRandomInt(-15, -10)
            Ball.velosityX = this.getRandomInt(-5, 5)
        }

        if (Math.floor(Math.abs(angle * 10)) / 10 == 1.5) {
            if (Ball.x - this.centerX < 0) {
                Ball.velosityX = 3
            } else {
                Ball.velosityX = -3
            }
        }
        Ball.x = Ball.x + Ball.velosityX
        Ball.y = Ball.y + Ball.velosityY

        return Ball
    }

    async gravity() {
        this.state.context.clearRect(0, 0, this.state.canvas.width, this.state.canvas.height)
        this.drawMap()

        let arrayOfBalls = this.collisionDetection(this.state.tabOfBalls)[0]
        let newArrayOfBalls = []
        for (let i = 0; i < arrayOfBalls.length; i++) {
            let Ball = arrayOfBalls[i]


            Ball.y = Ball.y + Ball.velosityY
            Ball.velosityY = Ball.velosityY * this.ballFrictionY

            Ball.x = Ball.x + Ball.velosityX
            Ball.velosityX = Ball.velosityX * this.ballFrictionX


            //deflect from circle
            if ((Ball.x - this.centerX) ** 2 + (Ball.y - this.centerY) ** 2 >= (this.radiusOfMap - this.radius) ** 2) {
                Ball = this.reflectFromBorder(Ball)
            } else {
                Ball.velosityY += this.gravityVal
            }


            newArrayOfBalls.push(Ball)

            this.drawBall(Ball.x, Ball.y, Ball.color)

        }

        await this.setState(
            {
                tabOfBalls: newArrayOfBalls
            }
        )


    }

    drawBall(x, y, color) {
        this.state.context.beginPath();
        this.state.context.arc(x, y, this.radius, 0, 2 * Math.PI);
        this.state.context.fillStyle = color;
        this.state.context.lineWidth = 1;
        this.state.context.strokeStyle = "#42a1f5";
        this.state.context.stroke();
        this.state.context.fill();

    }

    readMouseLocation(event) {
        let NewX = event.clientX;
        let NewY = event.clientY;
        this.setState({
            x: NewX,
            y: NewY
        })
        console.log("x: " + NewX + " y: " + NewY)
    }



    render() {
        return (

            <canvas ref={this.myRef} onClick={this.readMouseLocation} />

        )
    }
}
export default CanvasScene
