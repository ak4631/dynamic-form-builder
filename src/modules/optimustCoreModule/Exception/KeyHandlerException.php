<?php

namespace Optimust\Core\Exception;

use Exception;

class KeyHandlerException extends Exception
{
    public static function keyAlreadyExists(): self
    {
        return new self('Key already exists');
    }

    public static function failedToCreateKey(): self
    {
        return new self('Failed to create key');
    }

    public static function keyDoesNotExist(): self
    {
        return new self('Key file does not exist');
    }

    public static function keyIsNotReadable(): self
    {
        return new self('Key is not readable');
    }
}
