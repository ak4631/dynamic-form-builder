<?php

namespace Optimust\Core\Traits\Service;

use Optimust\Core\Service\NumberHelperService;
use Optimust\Core\Traits\ServiceContainerTrait;
use Optimust\Framework\Services;

trait NumberHelperTrait
{
    use ServiceContainerTrait;

    /**
     * @return NumberHelperService
     */
    protected function getNumberHelper(): NumberHelperService
    {
        return $this->getContainer()->get(Services::NUMBER_HELPER_SERVICE);
    }
}
