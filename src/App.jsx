import { useState, useEffect } from 'react'
import {nanoid} from "nanoid"
import Confetti from "react-confetti"
import Die from "./Die"
import Stats from "./Stats"

export default function App() {
    // localStorage.removeItem("records")
    const [dice, setDice] = useState(allNewDice())
    const [tenzies, setTenzies] = useState(false)
    const [rollCount, setRollCount] = useState(0)
    const [time, setTime] = useState(0)
    const [isTrackingTime, setIsTrackingTime] = useState(false)
    const [records, setRecords] = useState(JSON.parse(localStorage.getItem("records")) || [])
    
    // Seconds calculation
    const seconds = Math.floor((time / 1000) % 60);

    // // Milliseconds calculation
    const milliseconds = (time / 10) % 100;

    useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstValue)
        if (allHeld && allSameValue) {
            setTenzies(true)
            setIsTrackingTime(false)
        }
    }, [dice])

    // track time
    useEffect(() => {
        let intervalId;
        if (isTrackingTime) {
            // setting time from 0 to 1 every 10 milisecond using javascript setInterval method
            intervalId = setInterval(() => setTime(time => time + 10), 10);
            }

        return () => {
            return clearInterval(intervalId)
        };
    }, [isTrackingTime]);

    // store record to browser's local storage
    useEffect(() => {
        if (tenzies) {
            setRecords(prevRecords => {
                const newRecords = [{
                    id: nanoid(),
                    seconds,
                    milliseconds,
                    rollCount
                },
                ...prevRecords]
                localStorage.setItem("records", JSON.stringify(newRecords))
                return newRecords
            })
        }
    }, [tenzies])

    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }
    }

    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie())
        }
        return newDice
    }

    function rollDice() {
        if (!isTrackingTime && rollCount == 0) {
            setIsTrackingTime(prevVal => !prevVal)
        }

        if(!tenzies) {
            setDice(oldDice => oldDice.map(die => {
                return die.isHeld ? 
                    die :
                    generateNewDie()
            }))
            setRollCount(oldVal => oldVal + 1)
        } else {
            setIsTrackingTime(false)
            setTime(0)
            setTenzies(false)
            setDice(allNewDice())
            setRollCount(0)
        }
    }

    function holdDice(id) {
        // the moment the first die gets clicked, the timer should start
        if (dice.every(die => !die.isHeld)) setIsTrackingTime(true)

        setDice(oldDice => oldDice.map(die => {
            return die.id === id ? 
                {...die, isHeld: !die.isHeld} :
                die
        }))
    }

    function reset() {
        if (rollCount > 0) {
            setIsTrackingTime(false)
            setTime(0)
            setTenzies(false)
            setDice(allNewDice())
            setRollCount(0)
        }
    }

    const diceElements = dice.map(die => (
        <Die 
            key={die.id} 
            value={die.value} 
            isHeld={die.isHeld} 
            holdDice={() => holdDice(die.id)}
        />
        
    ))

    return (
        <div className="container">
            {tenzies && <Confetti width={window.innerwidth}/>}
            <div className="row">
                <main className="
                        col-lg-8 
                        container-fluid 
                        d-flex 
                        flex-column 
                        justify-content-center 
                        align-items-center"
                >
                    <h1 className="title">Tenzies</h1>
                    <p className="instructions">Roll until all dice are the same. 
                    Click each die to freeze it at its current value between rolls.</p>
                    <div className="dice-container">
                        {diceElements}
                    </div>
                    <button 
                        className="roll-dice" 
                        onClick={rollDice}
                    >
                        {tenzies ? "New Game" : "Roll"}
                    </button>
                    <div className="
                            container 
                            d-flex 
                            flex-row 
                            justify-content-evenly 
                            align-items-center
                            p-2"
                    >
                        <div className="timer-text">
                            Time: {seconds.toString().padStart(2, "0")}:
                            {milliseconds.toString().padStart(2, "0")}
                        </div>
                        <div className="roll-count">
                            Rolls: {rollCount}
                        </div>
                    </div>
                    <button className="reset-btn" onClick={reset}>
                        Reset
                    </button>
                </main>
                <div className="col-lg-4 mt-2 d-flex justify-content-center">
                    <Stats records={records}/>
                </div>
            </div>
        </div>
    )
}