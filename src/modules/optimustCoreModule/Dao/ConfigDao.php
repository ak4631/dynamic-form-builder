<?php

namespace Optimust\Core\Dao;

use Exception;
use Optimust\Core\Exception\DaoException;
use Optimust\Core\Traits\LoggerTrait;
use Optimust\Entity\Config;

class ConfigDao extends BaseDao
{
    use LoggerTrait;

    /**
     * Set $key to given $value
     * @param string $name Key
     * @param string $value Value
     * @throws DaoException
     */
    public function setValue(string $name, string $value): Config
    {
        try {
            $config = $this->getRepository(Config::class)->find($name);

            if (!$config instanceof Config) {
                $config = new Config();
            }
            $config->setName($name);
            $config->setValue($value);
            $this->persist($config);
            return $config;
        } catch (Exception $e) {
            $this->getLogger()->error($e->getMessage());
            $this->getLogger()->error($e->getTraceAsString());
            throw new DaoException($e->getMessage(), $e->getCode(), $e);
        }
    }

    /**
     * Get value corresponding to given $key
     * @param string $name Key
     * @return string|null value
     */
    public function getValue(string $name): ?string
    {
        try {
            $config = $this->getRepository(Config::class)->find($name);
            if ($config instanceof Config) {
                return $config->getValue();
            }
            return null;
        } catch (Exception $e) {
            $this->getLogger()->error($e->getMessage());
            $this->getLogger()->error($e->getTraceAsString());
            throw new DaoException($e->getMessage(), $e->getCode(), $e);
        }
    }

    /**
     * @return array
     * @throws DaoException
     */
    public function getAllValues(): array
    {
        try {
            $values = [];
            $configs = $this->getRepository(Config::class)->findAll();
            foreach ($configs as $config) {
                $values[$config->getName()] = $config->getValue();
            }
            return $values;
        } catch (Exception $e) {
            throw new DaoException($e->getMessage(), $e->getCode(), $e);
        }
    }
}
