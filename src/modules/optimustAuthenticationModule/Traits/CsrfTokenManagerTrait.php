<?php

namespace Optimust\Authentication\Traits;

use Optimust\Authentication\Csrf\CsrfTokenManager;
use Optimust\Core\Traits\ServiceContainerTrait;
use Optimust\Framework\Services;

trait CsrfTokenManagerTrait
{
    use ServiceContainerTrait;

    /**
     * @return CsrfTokenManager
     */
    protected function getCsrfTokenManager(): CsrfTokenManager
    {
        return $this->getContainer()->get(Services::CSRF_TOKEN_MANAGER);
    }
}
