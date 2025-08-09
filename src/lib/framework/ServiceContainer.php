<?php

namespace Optimust\Framework;

use Optimust\Framework\DependencyInjection\ContainerBuilder;

class ServiceContainer
{
    /**
     * @var self|null
     */
    private static ?ServiceContainer $instance = null;

    /**
     * @var ContainerBuilder|null
     */
    private static ?ContainerBuilder $containerBuilder = null;

    private function __construct()
    {
        self::$containerBuilder = new ContainerBuilder();
    }

    /**
     * @return static
     */
    protected static function getInstance(): self
    {
        if (is_null(self::$instance)) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * @return ContainerBuilder
     */
    public static function getContainer(): ContainerBuilder
    {
        self::getInstance();
        return self::$containerBuilder;
    }
}
