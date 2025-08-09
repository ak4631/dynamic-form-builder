<?php

namespace Optimust\Core\Traits;

use Optimust\Framework\Logger\Logger;
use Optimust\Framework\Services;

trait LoggerTrait
{
    use ServiceContainerTrait;

    /**
     * @return Logger
     */
    protected function getLogger(): Logger
    {
        return $this->getContainer()->get(Services::LOGGER);
    }
}
