<?php

namespace Optimust\Admin\Traits\Service;

use Optimust\Admin\Service\UserService;
use Optimust\Core\Traits\ServiceContainerTrait;
use Optimust\Framework\Services;

trait UserServiceTrait
{
    use ServiceContainerTrait;

    /**
     * @return UserService
     */
    protected function getUserService(): UserService
    {
        return $this->getContainer()->get(Services::USER_SERVICE);
    }
}
