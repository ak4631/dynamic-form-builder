<?php

namespace Optimust\Core\Exception;

use Exception;

class CSVUploadFailedException extends Exception
{
    /**
     * @return static
     */
    public static function validationFailed(): self
    {
        return new self("The CSV File Is Not Valid");
    }
}
