import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";
import Die from "../Die";
import Stats from "../Stats";
import { AuthData } from "../../auth/AuthWrapper";
import Header from "../Header";
import axios from "axios";

export default function Home() {
	const [dice, setDice] = useState(allNewDice());
	const [tenzies, setTenzies] = useState(false);
	const [rollCount, setRollCount] = useState(0);
	const [time, setTime] = useState(0);
	const [isTrackingTime, setIsTrackingTime] = useState(false);
	const [records, setRecords] = useState(
		JSON.parse(localStorage.getItem("records")) || []
	);
	const { user, logout, checkAuth } = AuthData();

	function formatGameRecords(records) {
		return records.map((record) => {
			return {
				id: record._id,
				seconds: Math.floor(record.time),
				milliseconds: (
					(record.time - Math.floor(record.time)) *
					100
				).toFixed(),
				rollCount: record.rolls,
				datePlayed: record.datePlayed,
			};
		});
	}

	// Fetch records from the appropriate source based on authentication status
	useEffect(() => {
		async function fetchRecords() {
			if (user) {
				// Fetch records from the API if user is logged in
				try {
					const res = await axios.get(
						import.meta.env.VITE_BACKEND_URL +
							"/api/profiles/" +
							user.profileId,
						{
							withCredentials: true,
						}
					);
					console.log(res.data.games);
					setRecords(formatGameRecords(res.data.games));
				} catch (err) {
					console.error(err);
				}
			} else {
				// Fetch records from localStorage if user is not logged in
				const localRecords = JSON.parse(
					localStorage.getItem("records")
				);
				setRecords(localRecords || []);
			}
		}
		fetchRecords();
	}, [user]);

	// check if user is logged in
	useEffect(() => {
		async function checkAuthWrapper() {
			await checkAuth();
		}
		checkAuthWrapper();
	}, []);

	// Seconds calculation
	const seconds = Math.floor((time / 1000) % 60);

	// Milliseconds calculation
	// the number of milliseconds in the range 0-99
	const milliseconds = (time / 10) % 100;

	useEffect(() => {
		const allHeld = dice.every((die) => die.isHeld);
		const firstValue = dice[0].value;
		const allSameValue = dice.every((die) => die.value === firstValue);
		if (allHeld && allSameValue) {
			setTenzies(true);
			setIsTrackingTime(false);
		}
	}, [dice]);

	// track time
	useEffect(() => {
		let intervalId;
		if (isTrackingTime) {
			// setting time from 0 to 1 every 10 milisecond using javascript setInterval method
			intervalId = setInterval(() => setTime((time) => time + 10), 10);
		}

		return () => {
			return clearInterval(intervalId);
		};
	}, [isTrackingTime]);

	// Store record to the appropriate storage when the game ends
	useEffect(() => {
		if (tenzies) {
			const newRecord = {
				id: nanoid(),
				seconds,
				milliseconds,
				// if we use time, there would be a discrepancy
				// between the time displayed and the time stored
				time: seconds + milliseconds / 100, // in seconds
				rollCount,
				datePlayed: Date.now(),
			};

			if (user) {
				// Save record to the server if user is logged in
				const saveRecord = async () => {
					try {
						await axios.post(
							import.meta.env.VITE_BACKEND_URL +
								"/api/profiles/" +
								user.profileId +
								"/games/",
							{
								rolls: newRecord.rollCount,
								time: newRecord.time,
								datePlayed: newRecord.datePlayed,
							},
							{ withCredentials: true }
						);

						// just for the preview
						setRecords((prevRecords) => {
							const newRecords = [newRecord, ...prevRecords];
							return newRecords;
						});
					} catch (err) {
						console.error(err);

						// store to local storage if the server fails
						setRecords((prevRecords) => {
							// mark the record as unsynced
							const markedNewRecord = {
								...newRecord,
								unsynced: true,
								profileId: user.profileId,
							};
							const newRecords = [
								markedNewRecord,
								...prevRecords,
							];
							localStorage.setItem(
								"records",
								JSON.stringify(newRecords)
							);
							return newRecords;
						});

						// TODO:
						// 1. show a message to the user that the record is not synced
						// 2. retry syncing the record
					}
				};
				saveRecord();
			} else {
				setRecords((prevRecords) => {
					const newRecords = [newRecord, ...prevRecords];
					localStorage.setItem("records", JSON.stringify(newRecords));
					return newRecords;
				});
			}
		}
	}, [tenzies]);

	function generateNewDie() {
		return {
			value: Math.ceil(Math.random() * 6),
			isHeld: false,
			id: nanoid(),
		};
	}

	function allNewDice() {
		const newDice = [];
		for (let i = 0; i < 10; i++) {
			newDice.push(generateNewDie());
		}
		return newDice;
	}

	function rollDice() {
		if (!isTrackingTime && rollCount == 0) {
			setIsTrackingTime((prevVal) => !prevVal);
		}

		if (!tenzies) {
			setDice((oldDice) =>
				oldDice.map((die) => {
					return die.isHeld ? die : generateNewDie();
				})
			);
			setRollCount((oldVal) => oldVal + 1);
		} else {
			setIsTrackingTime(false);
			setTime(0);
			setTenzies(false);
			setDice(allNewDice());
			setRollCount(0);
		}
	}

	function holdDice(id) {
		// the moment the first die gets clicked, the timer should start
		if (dice.every((die) => !die.isHeld)) setIsTrackingTime(true);

		setDice((oldDice) =>
			oldDice.map((die) => {
				return die.id === id ? { ...die, isHeld: !die.isHeld } : die;
			})
		);
	}

	function reset() {
		if (rollCount > 0) {
			setIsTrackingTime(false);
			setTime(0);
			setTenzies(false);
			setDice(allNewDice());
			setRollCount(0);
		}
	}

	const diceElements = dice.map((die) => (
		<Die
			key={die.id}
			value={die.value}
			isHeld={die.isHeld}
			holdDice={() => holdDice(die.id)}
		/>
	));

	return (
		<>
			{tenzies && <Confetti width={window.innerwidth} />}
			<div className="d-flex flex-column" style={{ height: "100vh" }}>
				<Header user={user} />
				{user ? (
					<p style={{ color: "white" }}>
						{user && JSON.stringify(user)}
					</p>
				) : (
					<p style={{ color: "white" }}>you're not logged in</p>
				)}

				<div
					className="container d-flex justify-content-center align-items-center"
					style={{ flex: 1 }}
				>
					<div className="row">
						<main
							className="
                        col-lg-8 
                        container-fluid 
                        d-flex 
                        flex-column 
                        justify-content-center 
                        align-items-center"
						>
							<h1 className="title">Tenzies</h1>
							<p className="instructions">
								Roll until all dice are the same. Click each die
								to freeze it at its current value between rolls.
							</p>
							<div className="dice-container">{diceElements}</div>
							<button className="roll-dice" onClick={rollDice}>
								{tenzies ? "New Game" : "Roll"}
							</button>
							<div
								className="
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
							<Stats records={records} />
						</div>
					</div>
				</div>
				<div
					className="footer text-center p-3"
					style={{
						backgroundColor: `#172b46`,
						color: "white",
					}}
				>
					<span>
						Made with{" "}
						<svg
							viewBox="0 0 1792 1792"
							preserveAspectRatio="xMidYMid meet"
							xmlns="http://www.w3.org/2000/svg"
							style={{ height: `0.8rem` }}
						>
							<path
								d="M896 1664q-26 0-44-18l-624-602q-10-8-27.5-26T145 952.5 77 855 23.5 734 0 596q0-220 127-344t351-124q62 0 126.5 21.5t120 58T820 276t76 68q36-36 76-68t95.5-68.5 120-58T1314 128q224 0 351 124t127 344q0 221-229 450l-623 600q-18 18-44 18z"
								fill="#e25555"
							></path>
						</svg>{" "}
						by{" "}
						<a
							className="text-white"
							href="https://github.com/swinarga/tenzies"
						>
							swinarga
						</a>
					</span>
				</div>
			</div>
		</>
	);
}
