<?php

namespace Optimust\Core\Utility;

use Exception;
use Optimust\Config\Config;
use Optimust\Core\Exception\KeyHandlerException;
use Optimust\Framework\Filesystem\Filesystem;

class KeyHandler
{
    private static string $key;
    private static bool $keySet = false;

    /**
     * @throws KeyHandlerException
     */
    public static function createKey(): void
    {
        if (self::keyExists()) {
            throw KeyHandlerException::keyAlreadyExists();
        }

        try {
            $cryptKey = '';
            for ($i = 0; $i < 4; $i++) {
                $cryptKey .= md5(random_int(10000000, 99999999));
            }
            $cryptKey = str_shuffle($cryptKey);

            $fs = new Filesystem();
            $fs->dumpFile(self::getPathToKey(), $cryptKey);
            clearstatcache(true);
        } catch (Exception $e) {
            throw KeyHandlerException::failedToCreateKey();
        }
    }

    /**
     * @return string
     * @throws KeyHandlerException
     */
    public static function readKey(): string
    {
        if (!self::keyExists()) {
            throw KeyHandlerException::keyDoesNotExist();
        }

        if (!is_readable(self::getRealPathToKey())) {
            throw KeyHandlerException::keyIsNotReadable();
        }

        if (!self::$keySet) {
            self::$key = trim(file_get_contents(self::getRealPathToKey()));
            self::$keySet = true;
        }

        return self::$key;
    }

    /**
     * @return bool
     */
    public static function keyExists(): bool
    {
        return self::getRealPathToKey() !== null;
    }

    /**
     * @return string|null
     */
    public static function getRealPathToKey(): ?string
    {
        $path = realpath(self::getPathToKey());
        return $path === false ? null : $path;
    }

    /**
     * @return string
     */
    public static function getPathToKey(): string
    {
        return Config::get(Config::CRYPTO_KEY_DIR) . DIRECTORY_SEPARATOR . 'key.optimust';
    }
}
