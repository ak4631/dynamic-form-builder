<?php

namespace Optimust\Core\Utility;

class Base64Url
{
    /**
     * @param string $value
     * @return string
     */
    public static function encode(string $value): string
    {
        $base64 = base64_encode($value);
        if ($base64 === false) {
            return false;
        }

        return str_replace(['+', '/', '='], ['-', '_', ''], $base64);
    }

    /**
     * @param string $value
     * @return false|string
     */
    public static function decode(string $value)
    {
        return base64_decode(str_replace(['-', '_'], ['+', '/'], $value));
    }
}
