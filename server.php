<?php
session_start();

if (is_null(session_id()) || strlen(session_id()) <= 0)
    session_regenerate_id();

$SESSION_ID = session_id();
if (is_null($SESSION_ID) || strlen($SESSION_ID) <= 0)
    die(header('HTTP/1.0 403 oridden'));


$headers = getallheaders();
$body = file_get_contents('php://input');

if (!isset($headers["Dislay-Name"]))
    die(header('HTTP/1.0 400 Bad Request'));

$path = 'uploads/' . $headers["Dislay-Name"];

$response = file_put_contents($path, $body);
if ($response)
    die(header("HTTP/1.0 200 Success"));
else
    die(header("HTTP/1.0 500 Internal Server Error"));
