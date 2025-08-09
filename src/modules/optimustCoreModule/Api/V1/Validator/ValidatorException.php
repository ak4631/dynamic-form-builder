<?php

namespace Optimust\Core\Api\V1\Validator;

use Exception;
use Throwable;

class ValidatorException extends Exception
{
    public const DEFAULT_ERROR_MESSAGE = "Validator Error";

    public function __construct($message = self::DEFAULT_ERROR_MESSAGE, $code = 0, Throwable $previous = null)
    {
        parent::__construct($message, $code, $previous);
    }
}
