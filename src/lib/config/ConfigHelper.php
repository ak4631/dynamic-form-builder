<?php

namespace Optimust\Config;
class ConfigHelper
{
    /**
     * @var array
     */
    protected array $configs = [];

    /**
     * @return array
     */
    private function getPathConfigs(): array
    {
        $pathToProjectBase = realpath(__DIR__ . '/../../../');
        $pathToSrcDir = realpath($pathToProjectBase . '/src/');
        $pathToConfigDir = $pathToProjectBase . DIRECTORY_SEPARATOR . 'lib' . DIRECTORY_SEPARATOR . 'confs';
        return [
            Config::BASE_DIR => $pathToProjectBase,
            Config::SRC_DIR => $pathToSrcDir,
            Config::MODULES_DIR => realpath($pathToSrcDir . '/modules'),
            Config::PUBLIC_DIR => realpath($pathToProjectBase . '/web'),
            Config::DOCTRINE_PROXY_DIR => realpath($pathToSrcDir . '/config/proxy'),
            Config::TEST_DIR => realpath($pathToSrcDir . '/test'),
            Config::LOG_DIR => $pathToSrcDir . DIRECTORY_SEPARATOR . 'log',
            Config::CACHE_DIR => $pathToSrcDir . DIRECTORY_SEPARATOR . 'cache',
            Config::CONFIG_DIR => $pathToConfigDir,
            Config::CRYPTO_KEY_DIR => $pathToConfigDir . DIRECTORY_SEPARATOR . 'cryptokeys',
            Config::SESSION_DIR => null,
            Config::CONF_FILE_PATH => $pathToConfigDir . DIRECTORY_SEPARATOR . 'Conf.php',
        ];
    }

    /**
     * This should call after call `getPathConfigs` and configure path configs
     * @return array[]
     */
    private function getModuleConfigs(): array
    {
        $modulesDir = $this->get(Config::MODULES_DIR);
        $moduleAbsPaths = [];
        $modules = [];
        $moduleConfigs = [];
        $dirs = scandir($modulesDir);
        $dirSuffix = 'Module';
        
        foreach ($dirs as $dirName) {
            if (stripos($dirName, $dirSuffix) !== false) {
                $moduleDir = realpath($modulesDir . DIRECTORY_SEPARATOR . $dirName);
                $moduleAbsPaths[] = $moduleDir;
                $modules[] = $dirName;
                if ($moduleDir) {
                    $moduleConfig = $this->getModuleConfiguration($moduleDir);
                    if (!is_null($moduleConfig)) {
                        $moduleConfigs[$dirName] = $moduleConfig;
                    }
                }
            }
        }
        return [
            Config::MODULES => $modules,
            Config::MODULE_PATHS => $moduleAbsPaths,
            Config::MODULE_CONFIGS => $moduleConfigs,
        ];
    }

    /**
     * @param string $moduleDir
     * @return array|null
     */
    private function getModuleConfiguration(string $moduleDir): ?array
    {
        $moduleConfigDir = realpath($moduleDir . DIRECTORY_SEPARATOR . 'config');
        if ($moduleConfigDir) {
            $files = scandir($moduleConfigDir);
            $fileSuffix = 'ModuleConfiguration.php';
            foreach ($files as $file) {
                if (stripos($file, $fileSuffix) !== false) {
                    $configFile = realpath($moduleConfigDir . DIRECTORY_SEPARATOR . $file);
                    return [
                        'filename' => $file,
                        'classname' => str_replace('.php', '', $file),
                        'filepath' => $configFile,
                        'dir' => $moduleConfigDir,
                    ];
                }
            }
        }
        return null;
    }

    /**
     * @return array
     */
    private function getClientConfigs(): array
    {
        $pathToProjectBase = $this->get(Config::BASE_DIR);
        $pathToSrcDir = $this->get(Config::SRC_DIR);
        $pathToReactBuildDir = realpath($pathToProjectBase . '/web/dist');
        $pathToBuildTimestampFile = realpath($pathToReactBuildDir . '/build');
        return [
            'client_dir' => realpath($pathToSrcDir . '/client'),
            Config::APP_TEMPLATE_DIR => realpath($pathToSrcDir . '/modules/OptimustCoreModule/templates'),
            'react_build_dir' => $pathToReactBuildDir,
            Config::REACT_BUILD_TIMESTAMP => $pathToBuildTimestampFile
                ? file_get_contents($pathToBuildTimestampFile) : '',
        ];
    }

    /**
     * @return array
     */
    private function getGlobalConfigs(): array
    {
        return [
            Config::DATE_FORMATTING_ENABLED => false,
            Config::MAX_SESSION_IDLE_TIME => Config::DEFAULT_MAX_SESSION_IDLE_TIME,
        ];
    }

    /**
     * @return array
     */
    public function getConfigs(): array
    {
        $this->add($this->getPathConfigs());
        $this->add($this->getModuleConfigs());
        $this->add($this->getClientConfigs());
        $this->add($this->getGlobalConfigs());
        return $this->getAll();
    }

    /**
     * @param string $name
     * @param null $default
     * @return mixed|null
     */
    protected function get(string $name, $default = null)
    {
        return $this->configs[$name] ?? $default;
    }

    /**
     * @return array
     */
    protected function getAll(): array
    {
        return $this->configs;
    }

    /**
     * @param array $parameters
     */
    protected function add(array $parameters = []): void
    {
        $this->configs = array_merge($this->configs, $parameters);
    }
}
