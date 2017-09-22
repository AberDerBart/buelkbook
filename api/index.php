<?php
include('Router.php');
include('KeyValueStore.php');

function validate_attendee($attendee) {
	$optionIds = array_map(function ($opt) {
		return $opt["id"];
	}, JSON_decode(file_get_contents("../data/options.json"), true));

	if (!is_array($attendee)) {
		return false;
	}

	if (count($attendee) != 6) {
		return false;
	}

	if (!is_string($attendee["id"]) && !is_null($attendee["id"])) {
		return false;
	}

	if (!is_string($attendee["name"]) || strlen($attendee["name"]) < 1) {
		return false;
	} 

	if (!is_string($attendee["stuff"])) {
		return false;
	}

	if (!is_string($attendee["comment"])) {
		return false;
	}

	if (!is_array($attendee["companions"])) {
		return false;
	}

	if (!is_string($attendee["option"]) || !in_array($attendee["option"], $optionIds)) {
		return false;
	}

	foreach ($attendee["companions"] as $companion) {
		if (!is_array($companion)) {
			return false;
		}

		if (count($companion) != 1) {
			return false;
		}

		if (!is_string($companion["name"]) || strlen($companion["name"]) < 1) {
			return false;
		}
	}

	return true;
}

$config = JSON_decode(file_get_contents('config.json'), true);

$mysqli = new mysqli($config["db_host"], $config["db_user"], $config["db_password"], $config["db_database"]);

if ($mysqli->connect_errno) {
    echo "Failed to connect to MySQL: " . $mysqli->connect_error;
}

$kvs = new KeyValueStore($mysqli, "attendee");
$router = new Router();

$router->get("attendee", function ($req) use ($kvs) {
	return array(200, $kvs->all());
});

$router->get("attendee/:id", function ($req) use ($kvs) {
	if (!$req["params"]["id"]) {
		return array(400, "No id specified");
	}

	$data = $kvs->read($req["params"]["id"]);

	if ($data !== null) {
		return array(200, $data);
	} else {
		return array(404, "Not found");
	}
});

$router->post("attendee", function ($req) use ($kvs) {
	if (!validate_attendee($req["body"])) {
		return array(400, "Invalid attendee!");
	}

	// TODO catch possible exception
	$data = $kvs->create($req["body"]);

	return array(201, $data);
});

$router->put("attendee/:id", function ($req) use ($kvs) {
	if (!validate_attendee($req["body"])) {
		return array(400, "Invalid attendee!");
	}

	if ($req["body"]["id"] !== $req["params"]["id"]) {
		var_dump($req);
		return array(400, "Ambigous id '" . $req["body"] . "' !== '" . $req["params"]["id"] . "'");
	}

	// TODO catch possible exception
	$data = $kvs->update($req["body"]);

	return array(200, $data);
});

$router->delete("attendee/:id", function ($req) use ($kvs) {
	$data = $kvs->delete($req["params"]["id"]);

	return array(204, null);
});

$router->get("option", function ($req) {
	return array(200, JSON_decode(file_get_contents("../data/options.json"), true));
});

$router->get("meal", function ($req) {
	return array(200, JSON_decode(file_get_contents("../data/meals.json"), true));
});

$router->respond();
?>