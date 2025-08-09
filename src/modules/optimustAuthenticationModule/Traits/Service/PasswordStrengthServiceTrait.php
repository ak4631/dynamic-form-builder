<?php

namespace Optimust\Authentication\Traits\Service;

use Optimust\Authentication\Service\PasswordStrengthService;
use Optimust\Core\Traits\ServiceContainerTrait;
use Optimust\Framework\Services;

trait PasswordStrengthServiceTrait
{
    use ServiceContainerTrait;

    /**
     * @return PasswordStrengthService
     */
    protected function getPasswordStrengthService(): PasswordStrengthService
    {
        return $this->getContainer()->get(Services::PASSWORD_STRENGTH_SERVICE);
    }
}
