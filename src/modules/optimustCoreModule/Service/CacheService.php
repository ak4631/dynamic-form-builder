<?php

namespace Optimust\Core\Service;

use Optimust\Config\Config;
use Optimust\Framework\Cache\FilesystemAdapter;
use Symfony\Component\Cache\Adapter\AdapterInterface;
use Symfony\Contracts\Cache\CacheInterface;

class CacheService
{
    /**
     * @var array<string, AdapterInterface>
     */
    private static array $cache = [];

    /**
     * @param string $namespace
     * @return AdapterInterface|CacheInterface
     */
    public static function getCache(string $namespace = 'optimust'): AdapterInterface
    {
        if (!isset($cache[$namespace])) {
            self::$cache[$namespace] = new FilesystemAdapter($namespace, 0, Config::get(Config::CACHE_DIR));
        }
        return self::$cache[$namespace];
    }
}
