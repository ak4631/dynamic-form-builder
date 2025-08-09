<?php

namespace Optimust\Config;

use Conf;
use Optimust\ORM\Exception\ConfigNotFoundException;

class Config
{
    public const MODULES = 'modules';
    public const MODULE_PATHS = 'module_paths';
    public const MODULE_CONFIGS = 'module_configs';
    public const BASE_DIR = 'base_dir';
    public const SRC_DIR = 'src_dir';
    public const MODULES_DIR = 'modules_dir';
    public const PUBLIC_DIR = 'public_dir';
    public const LOG_DIR = 'log_dir';
    public const CACHE_DIR = 'cache_dir';
    public const CONFIG_DIR = 'config_dir';
    public const CRYPTO_KEY_DIR = 'crypto_key_dir';
    public const SESSION_DIR = 'session_dir';
    public const DOCTRINE_PROXY_DIR = 'doctrine_proxy_dir';
    public const APP_TEMPLATE_DIR = 'app_template_dir';
    public const TEST_DIR = 'test_dir';
    public const CONF_FILE_PATH = 'conf_file_path';
    public const DATE_FORMATTING_ENABLED = 'date_formatting_enabled';
    public const REACT_BUILD_TIMESTAMP = 'react_build_timestamp';
    public const MAX_SESSION_IDLE_TIME = 'max_session_idle_time';

    public const MODE_DEV = 'dev';
    public const MODE_PROD = 'prod';
    public const MODE_TEST = 'test';
    public const MODE_DEMO = 'demo';

    public const PRODUCT_NAME = 'Optimust Software';
    public const PRODUCT_VERSION = '1.0';
    public const OPTIMUST_API_VERSION = '1.0';
    public const PRODUCT_MODE = self::MODE_DEV;
    public const REGISTRATION_URL = 'https://www.optimust.world';

    public const DEFAULT_MAX_SESSION_IDLE_TIME = 1800;

    /**
     * @var array
     */
    protected static array $configs = [];

    /**
     * @var Conf|null
     */
    protected static ?Conf $conf = null;

    /**
     * @var bool
     */
    protected static bool $initialized = false;

    private function __construct()
    {
    }

    private static function init(): void
    {
        if (!self::$initialized) {
            $configHelper = new ConfigHelper();
            self::add($configHelper->getConfigs());

            self::$initialized = true;
        }
    }

    /**
     * @param string $name
     * @param null $default
     * @return mixed|null
     */
    public static function get(string $name, $default = null)
    {
        self::init();
        return self::$configs[$name] ?? $default;
    }

    /**
     * @param string $name
     * @return bool
     */
    public static function has(string $name): bool
    {
        self::init();
        return array_key_exists($name, self::$configs);
    }

    /**
     * @param string $name
     * @param $value
     */
    public static function set(string $name, $value)
    {
        self::$configs[$name] = $value;
    }

    /**
     * @param array $parameters
     */
    public static function add(array $parameters = [])
    {
        self::$configs = array_merge(self::$configs, $parameters);
    }

    /**
     * @return array
     */
    public static function getAll(): array
    {
        self::init();
        return self::$configs;
    }

    public static function clear(): void
    {
        self::$configs = [];
    }

    /**
     * @return bool
     */
    public static function isInstalled(): bool
    {
        try {
            Config::getConf();
            return true;
        } catch (ConfigNotFoundException $e) {
            return false;
        }
    }

    /**
     * @param bool $force
     * @return Conf
     * @throws ConfigNotFoundException
     */
    public static function getConf(bool $force = false): Conf
    {
        if (!self::$conf instanceof Conf || $force) {
            if (!@include_once(self::get(self::CONF_FILE_PATH))) {
                throw ConfigNotFoundException::notInstalled();
            }
            self::$conf = new Conf();
        }
        return self::$conf;
    }
}
