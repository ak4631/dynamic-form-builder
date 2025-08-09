<?php

namespace Optimust\Core\Traits\Service;

use Optimust\Core\Service\TextHelperService;
use Optimust\Core\Traits\ServiceContainerTrait;
use Optimust\Framework\Services;

trait TextHelperTrait
{
    use ServiceContainerTrait;

    /**
     * @return TextHelperService
     */
    protected function getTextHelper(): TextHelperService
    {
        return $this->getContainer()->get(Services::TEXT_HELPER_SERVICE);
    }
}
