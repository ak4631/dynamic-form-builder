<?php

namespace Optimust\Core\Traits\Auth;

use Optimust\Authentication\Auth\User;
use Optimust\Core\Traits\ServiceContainerTrait;
use Optimust\Framework\Services;

trait AuthUserTrait
{
    use ServiceContainerTrait;

    /**
     * @return User
     */
    public function getAuthUser(): User
    {
        return $this->getContainer()->get(Services::AUTH_USER);
    }
}
