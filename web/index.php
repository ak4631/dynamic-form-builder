<?php

include_once('../src/config/log_settings.php');

use Optimust\Framework\Framework;
use Optimust\Framework\Http\Request;
use Symfony\Component\ErrorHandler\Debug;

require realpath(__DIR__ . '/../src/vendor/autoload.php');

$env = 'prod';
$debug = 'prod' !== $env;

if ($debug) {
    umask(0000);
    Debug::enable();
}

$kernel = new Framework($env, $debug);
$request = Request::createFromGlobals();

$response = $kernel->handleRequest($request);

$response->send();
$kernel->terminate($request, $response);
