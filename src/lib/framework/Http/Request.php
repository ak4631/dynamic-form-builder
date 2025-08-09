<?php

namespace Optimust\Framework\Http;

use BadFunctionCallException;
use Optimust\Config\Config;
use Symfony\Component\HttpFoundation\Request as HttpRequest;

class Request extends HttpRequest
{
    /**
     * @inheritDoc
     * @deprecated
     */
    public function get(string $key, $default = null) : mixed
    {
        if (Config::PRODUCT_MODE == Config::MODE_DEV) {
            $backtrace = debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1);
            if (count($backtrace) > 0 && isset($backtrace[0]['file'])) {
                $callerFile = $backtrace[0]['file'];
                $callerFile = str_replace(Config::get(Config::BASE_DIR), '', $callerFile);
                if (false !== strpos($callerFile, '/src/modules')) {
                    throw new BadFunctionCallException(
                        'Internal method since Symfony 7.1, use explicit request parameters from the appropriate public property (attributes, query, request) instead. ' .
                        'See more https://symfony.com/blog/new-in-symfony-5-4-controller-changes'
                    );
                }
            }
        }
        return parent::get($key, $default);
    }

    /**
     * @return static
     */
    public static function createFromGlobals(): static
    {
        if (!isset($_SERVER['HTTP_AUTHORIZATION']) || !isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
            // https://github.com/symfony/symfony/issues/19693
            $headers = array_change_key_case(getallheaders(), CASE_LOWER);
            if (isset($headers['authorization'])) {
                $_SERVER['HTTP_AUTHORIZATION'] = $headers['authorization'];
            }
        }
        return parent::createFromGlobals();
    }
}
