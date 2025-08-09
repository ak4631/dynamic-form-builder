<?php

namespace Optimust\Core\Api\V1\Serializer;

use Exception;

class NormalizeException extends Exception
{
    public static function notSetRequiredAttributes(): self
    {
        return new self('Not set required model attributes');
    }

    /**
     * @param string $requiredType
     * @param $object
     * @return static
     */
    public static function unsupportedType(string $requiredType, $object): self
    {
        return new self("Required instance of `$requiredType`, but got instance of `" . gettype($object) . "`");
    }
}
