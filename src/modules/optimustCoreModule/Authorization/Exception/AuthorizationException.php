<?php

namespace Optimust\Core\Authorization\Exception;

use Exception;

class AuthorizationException extends Exception
{
    /**
     * @param string $entityType
     * @param string $method
     * @return static
     */
    public static function entityNotSupported(string $entityType, string $method): self
    {
        return new self("Entity `$entityType` not supported, @ `$method`");
    }

    /**
     * @param string $entityType
     * @param string $method
     * @return static
     */
    public static function entityNotImplemented(string $entityType, string $method): self
    {
        return new self("Entity `$entityType` not implemented, @ `$method`");
    }

    /**
     * @param string $method
     * @return static
     */
    public static function methodNotImplemented(string $method): self
    {
        return new self("Method `$method` not implemented");
    }
}
