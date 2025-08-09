<?php

namespace Optimust\Core\Traits;

use Optimust\Framework\Cache\FilesystemAdapter;
use Optimust\Framework\Services;
use Symfony\Component\Cache\Adapter\AdapterInterface;
use Symfony\Contracts\Cache\CacheInterface;

trait CacheTrait
{
    use ServiceContainerTrait;

    /**
     * @return AdapterInterface|CacheInterface|FilesystemAdapter
     */
    protected function getCache(): AdapterInterface
    {
        return $this->getContainer()->get(Services::CACHE);
    }
}
