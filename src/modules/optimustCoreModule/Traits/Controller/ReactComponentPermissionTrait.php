<?php

namespace Optimust\Core\Traits\Controller;

use LogicException;
use Optimust\Core\Controller\AbstractReactController;
use Optimust\Core\Helper\ReactControllerHelper;
use Optimust\Core\Traits\UserRoleManagerTrait;

trait ReactComponentPermissionTrait
{
    use UserRoleManagerTrait;

    /**
     * @param array $dataGroups
     */
    protected function setPermissions(array $dataGroups)
    {
        $permissions = $this->getUserRoleManagerHelper()
            ->geEntityIndependentDataGroupPermissionCollection($dataGroups);
        if (!$this instanceof AbstractReactController) {
            throw new LogicException(self::class . ' should use in instanceof' . AbstractReactController::class);
        }
        $this->getContext()->set(
            ReactControllerHelper::PERMISSIONS,
            $permissions->toArray()
        );
    }
}
