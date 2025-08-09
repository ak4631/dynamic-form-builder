<?php

namespace Optimust\ORM\Exception;

use Exception;

class ConfigNotFoundException extends Exception
{
    /**
     * @return self
     */
    public static function notInstalled(): self
    {
        return new self('Application not installed');
    }
}
