<?php
class Router {
	private $endpoints = array();

	function get($route, $handler) {
		$this->handle($route, "GET", $handler);
	}

	function post($route, $handler) {
		$this->handle($route, "POST", $handler);
	}

	function put($route, $handler) {
		$this->handle($route, "PUT", $handler);
	}

	function delete($route, $handler) {
		$this->handle($route, "DELETE", $handler);
	}

	function respond() {
		list($status, $message) = $this->get_response($_GET["q"], $_SERVER["REQUEST_METHOD"]);

		header("Content-type: application/json; charset=utf8");
		http_response_code($status);
		if (!is_null($message)) {
			echo JSON_encode($message, JSON_PRETTY_PRINT);
		}
	}

	private function get_response($path, $method) {
		$endpoint = $this->get_endpoint($path, $method);

		if ($endpoint) {
			$req = array(
				"path" => $path,
				"params" => $this->get_params($endpoint, $path),
				"body" => $this->get_data($method),
			); 

			try {
				return $endpoint["handler"]($req);
			} catch (Exception $e) {
				return array(500, array(
					"Message" => $e->getMessage(),
					"File" => $e->getFile(),
					"Line" => $e->getLine(),
					"Stack" => $e->getTrace(),
				));
			}
		} 

		return array(404, "Nothing to be found...");
	}

	private function handle($route, $method, $handler) {
		array_push($this->endpoints, array (
			"route" => $route,
			"method" => $method,
			"handler" => $handler
		));
	}

	private function get_endpoint($path, $method) {
		foreach ($this->endpoints as $endpoint) {
			if ($method == $endpoint["method"] && preg_match($this->path_to_regexp($endpoint["route"]), $path)) {
				return $endpoint;
			}
		}

		return null;
	}

	private function get_data($method) {
		$data = null;

		if ($method == "POST" || $method == "PUT") {
			$data = JSON_decode(file_get_contents("php://input"), true);
		} 

		return $data;
	}

	private function get_params($endpoint, $path) {
		$pattern = $this->path_to_regexp($endpoint["route"]);

		if (preg_match($pattern, $path, $matches)) {
			return $matches;
		}

		return null;
	}

	private function path_to_regexp($path) {
		// path might contain regex special chars
		$path = preg_quote($path);
		// replace /:abc/ with capturing group /?<abc>[^/]+)/
		// \\\\: monstrosity needed as : is escaped by preg_quote above
		$path = preg_replace("#(^|/)\\\\:([a-zA-Z]+)(/|$)#", "$1(?<$2>[^/]+)$3", $path);
		// escape hash, as it is used as delimiter
		$path = str_replace("#", "\\#", $path);
		return "#^" . $path . "$#"; 
	}
}
?>