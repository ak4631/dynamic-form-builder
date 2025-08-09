<?php

namespace Optimust\Core\Api\V1\Exception;

use Exception;
use Throwable;

class BadRequestException extends Exception
{
    public const DEFAULT_ERROR_MESSAGE = "Bad Request";

    public function __construct($message = self::DEFAULT_ERROR_MESSAGE, $code = 0, Throwable $previous = null)
    {
        parent::__construct($message, $code, $previous);
    }
}
