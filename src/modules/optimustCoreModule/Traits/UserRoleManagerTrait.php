<?php

namespace Optimust\Core\Traits;

use Optimust\Core\Authorization\Helper\UserRoleManagerHelper;
use Optimust\Core\Authorization\Manager\AbstractUserRoleManager;
use Optimust\Core\Authorization\Manager\BasicUserRoleManager;
use Optimust\Framework\Services;

trait UserRoleManagerTrait
{
    use ServiceContainerTrait;

    /**
     * @return AbstractUserRoleManager|BasicUserRoleManager
     */
    protected function getUserRoleManager(): AbstractUserRoleManager
    {
        return $this->getContainer()->get(Services::USER_ROLE_MANAGER);
    }

    /**
     * @return UserRoleManagerHelper
     */
    protected function getUserRoleManagerHelper(): UserRoleManagerHelper
    {
        return $this->getContainer()->get(Services::USER_ROLE_MANAGER_HELPER);
    }
}
