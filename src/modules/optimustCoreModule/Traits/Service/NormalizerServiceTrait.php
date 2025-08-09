<?php

namespace Optimust\Core\Traits\Service;

use Optimust\Core\Service\NormalizerService;
use Optimust\Core\Traits\ServiceContainerTrait;
use Optimust\Framework\Services;

trait NormalizerServiceTrait
{
    use ServiceContainerTrait;

    /**
     * @return NormalizerService
     */
    public function getNormalizerService(): NormalizerService
    {
        return $this->getContainer()->get(Services::NORMALIZER_SERVICE);
    }
}
