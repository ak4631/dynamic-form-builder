<?php

namespace Optimust\Core\Api\V1\Exception;

use Exception;
use Optimust\Core\Api\V1\Validator\Exceptions\ValidationEscapableException;
use Throwable;

class ForbiddenException extends Exception implements ValidationEscapableException
{
    public const DEFAULT_ERROR_MESSAGE = "Unauthorized";

    public function __construct($message = self::DEFAULT_ERROR_MESSAGE, $code = 0, Throwable $previous = null)
    {
        parent::__construct($message, $code, $previous);
    }
}
