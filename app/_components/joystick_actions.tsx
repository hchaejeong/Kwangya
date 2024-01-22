'use client'

import { Joystick } from "react-joystick-component"

export interface JoystickStatus {
    beingUsed: boolean
    direction: Direction
}

interface Direction {
    left: boolean,
    right: boolean,
    up: boolean,
    down: boolean,
}

//joystick이 움직일때 모션 반영하기
interface Movement {
    onDirectionChange: (arg: JoystickStatus) => void
}

const joystickDirection = (angle: number): Direction => {
    //normalize angle from 0 to 360
    angle = (angle + 360) % 360
    
    //정확한 direction을 기준으로 플러스 마이너스 22.5도로 각 direction을 설정
    //starting from 0 degrees which is the motion directly to the right
    const leftRange = [180 - 22.5, 180 + 22.5]
    const rightRange = [360 - 22.5, 22.5]
    const upRange = [90 - 22.5, 90 + 22.5]
    const downRange = [270 - 22.5, 270 + 22.5]

    const joystickDirection: Direction = {
        left: false,
        right: false,
        up: false,
        down: false,
    }

    if (leftRange[0] < angle && angle <= leftRange[1]) {
        joystickDirection.left = true
    } else if (rightRange[0] < angle && angle <= rightRange[1]) {
        joystickDirection.right = true
    } else if (upRange[0] < angle && angle <= upRange[1]) {
        joystickDirection.up = true
    } else if (downRange[0] < angle && angle <= downRange[1]) {
        joystickDirection.down = true
    } else if (angle <= leftRange[0] && angle > upRange[1]) {
        joystickDirection.up = true
        joystickDirection.left = true
    } else if (angle <= upRange[0] && angle > rightRange[1]) {
        joystickDirection.up = true
        joystickDirection.right = true
    } else if (angle <= rightRange[0] && angle > downRange[1]) {
        joystickDirection.right = true
        joystickDirection.down = true
    } else if (angle <= downRange[0] && angle > leftRange[1]) {
        joystickDirection.down = true
        joystickDirection.left = true
    }

    return joystickDirection;
}

//실제 조이스틱 움직임을 반영
const JoystickItem = (movement: Movement) => {
    return (
        <Joystick 
            size={100} 
            baseColor="#4b4b70"
            stickColor="#6ec49f"
            stop={() => {
                movement.onDirectionChange({
                    beingUsed: false,
                    direction: {
                        left: false,
                        right: false,
                        up: false,
                        down: false,
                    },
                })
            }}
            move={(event) => {
                const x_initial = 0
                const y_initial = event.y ?? 0
                const x_final = event.x ?? 0
                const y_final = 0
                var changeInX = x_final - x_initial
                var changeInY = y_final - y_initial
                //find the angle of the joystick using tan(y/x)
                var radians = Math.atan2(changeInY, changeInX)
                var degrees = (radians * 180) / Math.PI
                var direction = joystickDirection(degrees)
                movement.onDirectionChange({
                    beingUsed: true,
                    direction
                })
            }}
        />
    )
}

export default JoystickItem