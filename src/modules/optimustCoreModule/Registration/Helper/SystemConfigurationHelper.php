<?php

namespace Optimust\Core\Registration\Helper;

use Optimust\Config\Config;
use Optimust\ORM\Doctrine;
use PDO;

class SystemConfigurationHelper
{
    /**
     * @return array
     */
    public function getSystemDetailsAsArray(): array
    {
        return [
            'os' => $this->getOsDetails(),
            'php' => $this->getPhpDetails(),
            'mysql' => $this->getMySqlDetails(),
            'server' => $this->getServerDetails(),
            'optimust' => $this->getOptimustDetails(),
        ];
    }

    /**
     * @return array
     */
    public function getOsDetails(): array
    {
        return [
            'os' => php_uname('s'),
            'release_name' => php_uname('r'),
            'version_info' => php_uname('v'),
        ];
    }

    /**
     * @return array
     */
    public function getPhpDetails(): array
    {
        return [
            'version' => phpversion()
        ];
    }

    /**
     * @return string|null
     */
    public function getServerDetails()
    {
        return $_SERVER['SERVER_SOFTWARE'] ?? null;
    }

    /**
     * @return string[]
     */
    public function getMySqlDetails(): array
    {
        return [
            'client_version' => 'Not captured',
            'server_version' => $this->getMySqlServerVersion(),
            'conn_type' => 'Not captured',
        ];
    }

    /**
     * @return array
     */
    public function getOptimustDetails(): array
    {
        return [
            'version' => Config::PRODUCT_VERSION,
        ];
    }

    /**
     * @return false|string
     */
    public function getSystemDetailsAsJson()
    {
        return json_encode($this->getSystemDetailsAsArray());
    }

    /**
     * Return MySQL server version
     * @return string
     */
    public function getMySqlServerVersion(): string
    {
        return Doctrine::getEntityManager()
                ->getConnection()
                ->getNativeConnection()
                ->getAttribute(PDO::ATTR_SERVER_VERSION) ?? '';
    }
}
