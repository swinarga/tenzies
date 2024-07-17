export default function Stats(props) {
	const recordsEl = props.records.map((record, index) => {
		return (
			<tr key={record.id}>
				<th scope="row">{index + 1}</th>
				<td>
					{record?.seconds.toString().padStart(2, "0")}:
					{record?.milliseconds.toString().padStart(2, "0")}
				</td>
				<td>{record.rollCount}</td>
			</tr>
		);
	});
	return (
		<div className="stats table-responsive">
			<table className="table">
				<thead>
					<tr>
						<th scope="col">#</th>
						<th scope="col">Time</th>
						<th scope="col">Rolls</th>
					</tr>
				</thead>
				<tbody>{recordsEl}</tbody>
			</table>
		</div>
	);
}
