<?php
class KeyValueStore {
	private $mysqli;
	private $table;

	function __construct($mysqli, $table) {
		$this->mysqli = $mysqli;
		$this->table = $table;
	}

	function all() {
		if (!$result = $this->mysqli->query("select data from " . $this->table)) {
			$this->report_error($this->mysqli);
		}

		$all = array_map(function ($row) {
			return JSON_decode($row["data"], true);
		}, $result->fetch_all(MYSQLI_ASSOC));

		return $all;
	}

	function create($data) {
		$id = $this->generate_uuid();
		$data["id"] = $id;
		$data_encoded = JSON_encode($data);

		if (!($stmt = $this->mysqli->prepare("insert into " . $this->table . " (id, data) values (?, ?)"))) {
			$this->report_error($this->mysqli);
		}

		$stmt->bind_param("ss", $id, $data_encoded);
		$stmt->execute();

		if ($stmt->affected_rows == 1) {
			return $data;
		} else {
			throw new Exception("Insert failed");
		}
	}

	function read($id) {
		if (!($stmt = $this->mysqli->prepare("select data from " . $this->table . " where id = ?"))) {
			$this->report_error($this->mysqli);
		}

		$stmt->bind_param("s", $id);

		$stmt->execute();
		$result = $stmt->get_result();

		if ($row = $result->fetch_assoc()) {
			return JSON_decode($row["data"], true);
		} else {
			return null;
		}
	}
	
	function update($data) {
		if (!$data['id']) {
			throw new Exception("Needs id!");
		}

		$id = $data['id'];
		$data_encoded = JSON_encode($data);

		if (!($stmt = $this->mysqli->prepare("update " . $this->table . " set data = ? where id = ?"))) {
			$this->report_error($this->mysqli);
		}

		$stmt->bind_param("ss", $data_encoded, $id);
		$stmt->execute();

		if ($stmt->affected_rows == 1) {
			return $data;
		} else {
			// TODO did update fail, or was no update neccessary? might need existence check...
			throw new Exception("Update failed" . $stmt->affected_rows);
		}
	}

	function delete($id) {
		if (!($stmt = $this->mysqli->prepare("delete from " . $this->table . " where id = ?"))) {
			$this->report_error($this->mysqli);
		}

		$stmt->bind_param("s", $id);
		$stmt->execute();

		if ($stmt->affected_rows == 1) {
			return true;
		} else {
			throw new Exception("Delete failed");
		}
	}

	private function generate_uuid() {
		// from http://rogerstringer.com/2013/11/15/generate-uuids-php/
		return sprintf( "%04x%04x-%04x-%04x-%04x-%04x%04x%04x",
			mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff ),
			mt_rand( 0, 0xffff ),
			mt_rand( 0, 0x0fff ) | 0x4000,
			mt_rand( 0, 0x3fff ) | 0x8000,
			mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff )
		);
	}

	private function report_error($mysqli) {
		throw new Exception("mysqli error (" . $mysqli->errno . "): " . $mysqli->error);
	}
}
?>