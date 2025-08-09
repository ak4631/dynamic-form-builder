<?php

namespace Optimust\Core\Traits\Service;

use Optimust\Core\Service\DateTimeHelperService;
use Optimust\Core\Traits\ServiceContainerTrait;
use Optimust\Framework\Services;

trait DateTimeHelperTrait
{
    use ServiceContainerTrait;

    /**
     * @return DateTimeHelperService
     */
    protected function getDateTimeHelper(): DateTimeHelperService
    {
        return $this->getContainer()->get(Services::DATETIME_HELPER_SERVICE);
    }
}
