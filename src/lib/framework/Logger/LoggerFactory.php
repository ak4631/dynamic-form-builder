<?php

namespace Optimust\Framework\Logger;

use Monolog\Handler\StreamHandler;
use Optimust\Config\Config;
use Optimust\Framework\Framework;
use Optimust\Framework\ServiceContainer;
use Optimust\Framework\Services;

class LoggerFactory
{
    /**
     * @var array<string, Logger>
     */
    private static array $loggers = [];

    /**
     * @param string $name
     * @param string|null $path
     * @return Logger
     */
    public static function getLogger(string $name, ?string $path = null): Logger
    {
        if (!isset(self::$loggers[$name])) {
            $logger = new Logger($name);
            /** @var Framework $kernel */
            $kernel = ServiceContainer::getContainer()->get(Services::HTTP_KERNEL);
            self::$loggers[$name] = $logger->pushHandler(
                new StreamHandler(
                    Config::get(Config::LOG_DIR) . DIRECTORY_SEPARATOR . ($path ?? "$name.log"),
                    $kernel->isDebug() ? Logger::DEBUG : Logger::WARNING
                )
            );
        }
        return self::$loggers[$name];
    }
}
