<?php

namespace Optimust\Core\Api\V1\Exception;

use Exception;
use Throwable;

class RecordNotFoundException extends Exception
{
    public const DEFAULT_ERROR_MESSAGE = "Record Not Found";

    public function __construct($message = self::DEFAULT_ERROR_MESSAGE, $code = 0, Throwable $previous = null)
    {
        parent::__construct($message, $code, $previous);
    }
}
