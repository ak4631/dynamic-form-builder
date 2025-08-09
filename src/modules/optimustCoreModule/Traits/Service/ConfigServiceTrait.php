<?php

namespace Optimust\Core\Traits\Service;

use Optimust\Core\Service\ConfigService;
use Optimust\Core\Traits\ServiceContainerTrait;
use Optimust\Framework\Services;

trait ConfigServiceTrait
{
    use ServiceContainerTrait;

    /**
     * @return ConfigService
     */
    public function getConfigService(): ConfigService
    {
        return $this->getContainer()->get(Services::CONFIG_SERVICE);
    }
}
