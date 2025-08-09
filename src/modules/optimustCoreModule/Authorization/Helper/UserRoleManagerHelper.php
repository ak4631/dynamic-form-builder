<?php

namespace Optimust\Core\Authorization\Helper;

use Optimust\Core\Authorization\Dto\DataGroupPermissionCollection;
use Optimust\Core\Authorization\Dto\DataGroupPermissionFilterParams;
use Optimust\Core\Authorization\Dto\ResourcePermission;
use Optimust\Core\Authorization\Manager\AbstractUserRoleManager;
use Optimust\Core\Authorization\Manager\BasicUserRoleManager;
use Optimust\Core\Exception\DaoException;
use Optimust\Core\Traits\ServiceContainerTrait;
use Optimust\Framework\Services;

class UserRoleManagerHelper
{
    use ServiceContainerTrait;

    /**
     * @return AbstractUserRoleManager|BasicUserRoleManager
     */
    private function getUserRoleManager(): AbstractUserRoleManager
    {
        return $this->getContainer()->get(Services::USER_ROLE_MANAGER);
    }

    /**
     * Returns the data group permissions without other entity
     *
     * @param string[]|string $dataGroupNames
     *
     * @return ResourcePermission
     * @throws DaoException
     */
    public function getEntityIndependentDataGroupPermissions($dataGroupNames): ResourcePermission
    {
        return $this->getUserRoleManager()->getDataGroupPermissions($dataGroupNames, [], [], false, []);
    }

    /**
     * Returns the data group permission collection without considering any other entity
     *
     * @param array $dataGroups
     * @return DataGroupPermissionCollection
     */
    public function geEntityIndependentDataGroupPermissionCollection(array $dataGroups): DataGroupPermissionCollection
    {
        $dataGroupPermissionFilterParams = new DataGroupPermissionFilterParams();
        $dataGroupPermissionFilterParams->setDataGroups($dataGroups);
        return $this->getUserRoleManager()->getDataGroupPermissionCollection($dataGroupPermissionFilterParams);
    }

}
